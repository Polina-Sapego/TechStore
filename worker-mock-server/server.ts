import type { Request, Response } from 'express';
import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import http from 'http';
import { setupWebSocket } from './socket';

const app = express();

app.use(cors());
app.use(express.json());

const server = http.createServer(app);

setupWebSocket(server);

const dataPath = path.join(__dirname, 'data', 'products.json');

interface Product {
  id: number;
  title: string;
  price: number;
  rating: number;
  image: string;
  category: string;
  inStock: boolean;
}

app.get('/products', (req: Request, res: Response) => {
  const raw = fs.readFileSync(dataPath, 'utf-8');
  const { products } = JSON.parse(raw) as { products: Product[] };

  const { sort, category } = req.query;
  let result = [...products];

  if (category && typeof category === 'string') {
    result = result.filter(p => p.category === category);
  }

  if (sort === 'asc') {
    result.sort((a, b) => a.price - b.price);
  } else if (sort === 'desc') {
    result.sort((a, b) => b.price - a.price);
  }

  res.json(result);
});

app.get('/products/:id', (req: Request, res: Response) => {
  const raw = fs.readFileSync(dataPath, 'utf-8');
  const { products } = JSON.parse(raw) as { products: Product[] };

  const product = products.find(p => p.id === Number(req.params.id));

  if (product) {
    res.json(product);
  } else {
    res.status(404).json({ message: 'Product not found' });
  }
});

(async () => {
  const PORT = process.env.PORT ? Number(process.env.PORT) : 3000;
  server.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
  });
})();
