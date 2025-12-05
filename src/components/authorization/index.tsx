import React, { useState } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import { useAuthStore } from '../../store/user/store.ts';

export const LOGIN_ROUTE = '/authorization';
export const SIGNUP_ROUTE = '/signup';
export const HOME_ROUTE = '/';
export const ADMIN_ROUTE = '/admin';

const Authorization = () => {
  const location = useLocation();
  const isLogin = location.pathname === LOGIN_ROUTE;
  const navigate = useNavigate();
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const setUser = useAuthStore((s) => s.setUser);

  const handleLogin = async () => {
    setError('');

    try {
      const res = await fetch('http://localhost:3000/authorization', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ login, password }),
        credentials: 'include',
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || 'Login failed');
        return;
      }

      Cookies.set('token', data.token, {
        expires: 3,
        secure: true,
        sameSite: 'none',
        path: '/',
      });
      setUser(data.user);
      navigate(data.user.role === 'ADMIN' ? ADMIN_ROUTE : HOME_ROUTE);

    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Unknown error');
      }
    }
  };

  const handleRegister = async () => {
    setError('');

    try {
      const res = await fetch('http://localhost:3000/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ login, password }),
        credentials: 'include',
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Login failed");
        return;
      }

      Cookies.set('token', data.token, {
        expires: 3,
        secure: true,
        sameSite: 'none',
        path: '/',
      });

      setUser(data.user);
      navigate(HOME_ROUTE);

    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Unknown error');
      }
    }
  };

  const handleSubmit = async () => {
    if (isLogin) {
      await handleLogin();
    } else {
      await handleRegister();
    }
  };

  const isDisabled =
    login.trim() === '' ||
    password.trim() === '';

  return (
    <div
      className="h-screen flex items-center justify-center"
      style={{ backgroundColor: 'rgba(149, 127, 85, 0.24)' }}
    >
      <div className="bg-white w-[550px] p-12 rounded-lg shadow-md flex flex-col">
        <h2 className="text-2xl font-bold text-center mb-6">
          {isLogin ? 'Log in' : 'Sign up'}
        </h2>

        <div className="flex flex-col gap-4 flex-grow">

          <input
            type="text"
            placeholder="Input your login..."
            value={login}
            onChange={(e) => setLogin(e.target.value)}
            className="border p-2 rounded focus:outline-none focus:ring-2 focus:ring-greenMainHover"
          />

          <input
            type="password"
            placeholder="Input your password..."
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border p-2 rounded focus:outline-none focus:ring-2 focus:ring-greenMainHover"
          />

          {error && <div className="text-red-600 text-sm mt-1">{error}</div>}

          <div className="flex justify-between items-center mt-4 text-sm">
            {isLogin ? (
              <div>
                Don’t have an account?{' '}
                <NavLink className="text-blue-500 hover:underline" to={SIGNUP_ROUTE}>
                  Sign up
                </NavLink>
              </div>
            ) : (
              <div>
                Already have an account?{' '}
                <NavLink className="text-blue-500 hover:underline" to={LOGIN_ROUTE}>
                  Log in
                </NavLink>
              </div>
            )}
          </div>
        </div>

        <button
          disabled={isDisabled}
          onClick={handleSubmit}
          className={`mt-6 w-full py-1.5 rounded-lg transition text-white
            ${
            isDisabled
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-greenMain hover:bg-greenMainHover active:bg-greenMainActive'
          }`}
        >
          {isLogin ? 'Log in' : 'Sign up'}
        </button>
      </div>
    </div>
  );
};

export default Authorization;
