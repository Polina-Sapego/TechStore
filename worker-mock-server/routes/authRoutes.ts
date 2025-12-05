import express, { Router } from 'express';
import bodyParser from 'body-parser';
import { generateToken, verifyToken } from '../utils/jwt';
import path from 'path';
import fs from 'fs';
import { authCheck } from '../middleware/authMiddleware.ts';

const router = Router();

const app = express();
app.use(bodyParser.json());

export interface UserDB {
  id: number;
  login: string;
  password: string;
  role: 'ADMIN' | 'USER';
}

interface JwtUserPayload {
  id: number;
  login: string;
  role: 'ADMIN' | 'USER';
  iat: number;
  exp: number;
}

const usersFile = path.join(__dirname, '../data', 'users.json');

function loadUsers(): UserDB[] {
  try {
    const data = fs.readFileSync(usersFile, 'utf-8');
    return JSON.parse(data);
  } catch {
    return [];
  }
}

function saveUsers(users: UserDB[]) {
  fs.writeFileSync(usersFile, JSON.stringify(users, null, 2));
}

router.post('/authorization', (req, res) => {
  const { login, password } = req.body;
  const users = loadUsers();

  const user = users.find(
    (u) => u.login === login && u.password === password,
  );

  if (!user) {
    return res.status(401).json({ message: 'Invalid login or password' });
  }

  const token = generateToken(user);

  return res.json({
    token,
    user: {
      id: user.id,
      login: user.login,
      role: user.role,
    },
  });
});

router.post('/register', (req, res) => {
  const { login, password } = req.body;

  if (!login || !password) {
    return res.status(400).json({ message: 'Missing fields' });
  }

  const users = loadUsers();

  const userExists = users.find((u) => u.login === login);
  if (userExists) {
    return res.status(400).json({ message: 'User already exists' });
  }

  const newUser: UserDB = {
    id: users.length + 1,
    login,
    password,
    role: 'USER',
  };

  users.push(newUser);
  saveUsers(users);

  const token = generateToken(newUser);

  return res.status(201).json({
    token,
    user: {
      id: newUser.id,
      role: newUser.role,
    },
  });
});

router.get('/me', authCheck, (req, res) => {
  const userData = req.user;

  if (!userData) {
    return res.status(401).json({ message: 'No token' });
  }

  const users = loadUsers();
  const user = users.find(u => u.id === userData.id);

  if (!user) {
    return res.status(401).json({ message: 'Invalid token' });
  }

  return res.json({
    user: {
      id: user.id,
      login: user.login,
      role: user.role,
    },
  });
});

export default router;
