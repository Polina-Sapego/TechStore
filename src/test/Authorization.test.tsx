import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import Authorization, { ADMIN_ROUTE, HOME_ROUTE } from '../components/authorization/index.tsx';
import Cookies from 'js-cookie';

jest.mock('js-cookie');

const mockNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

const mockSetUser = jest.fn();

jest.mock('../store/user/store.ts', () => ({
  useAuthStore: jest.fn((selector: any) => selector({
    setUser: mockSetUser,
    user: null,
  })),
}));

beforeEach(() => {
  global.fetch = jest.fn();
});

afterEach(() => {
  jest.clearAllMocks();
});

const renderAuth = (path = '/authorization') =>
  render(
    <MemoryRouter initialEntries={[path]}>
      <Authorization />
    </MemoryRouter>,
  );

test('успешный логин: USER → redirect на HOME', async () => {
  (fetch as jest.Mock).mockResolvedValue({
    ok: true,
    json: async () => ({
      token: 'abc123',
      user: { id: 1, login: 'john', role: 'USER' },
    }),
  });

  renderAuth();

  await userEvent.type(screen.getByPlaceholderText(/input your login/i), 'john');
  await userEvent.type(screen.getByPlaceholderText(/input your password/i), '123');

  await userEvent.click(screen.getByRole('button', { name: /log in/i }));

  await waitFor(() => {
    expect(mockSetUser).toHaveBeenCalledWith({
      id: 1,
      login: 'john',
      role: 'USER',
    });
  });

  expect(Cookies.set).toHaveBeenCalledWith(
    'token',
    'abc123',
    expect.any(Object),
  );

  expect(mockNavigate).toHaveBeenCalledWith(HOME_ROUTE);
});

test('ошибка: неверные данные', async () => {
  (fetch as jest.Mock).mockResolvedValue({
    ok: false,
    json: async () => ({ message: 'Invalid login or password' }),
  });

  renderAuth();

  await userEvent.type(screen.getByPlaceholderText(/input your login/i), 'wrong');
  await userEvent.type(screen.getByPlaceholderText(/input your password/i), 'wrong');
  await userEvent.click(screen.getByRole('button', { name: /log in/i }));

  await waitFor(() =>
    expect(screen.getByText(/invalid login or password/i)).toBeInTheDocument(),
  );
});

test('USER → не может зайти в admin, redirect HOME', async () => {
  (fetch as jest.Mock).mockResolvedValue({
    ok: true,
    json: async () => ({
      token: 'usertoken',
      user: { id: 10, login: 'user', role: 'USER' },
    }),
  });

  renderAuth();

  await userEvent.type(screen.getByPlaceholderText(/input your login/i), 'user');
  await userEvent.type(screen.getByPlaceholderText(/input your password/i), 'pass');
  await userEvent.click(screen.getByRole('button', { name: /log in/i }));

  await waitFor(() =>
    expect(mockNavigate).toHaveBeenCalledWith(HOME_ROUTE),
  );
});

test('ADMIN → redirect ADMIN_ROUTE', async () => {
  (fetch as jest.Mock).mockResolvedValue({
    ok: true,
    json: async () => ({
      token: 'admintoken',
      user: { id: 99, login: 'admin', role: 'ADMIN' },
    }),
  });

  renderAuth();

  await userEvent.type(screen.getByPlaceholderText(/input your login/i), 'admin');
  await userEvent.type(screen.getByPlaceholderText(/input your password/i), '123');
  await userEvent.click(screen.getByRole('button', { name: /log in/i }));

  await waitFor(() =>
    expect(mockNavigate).toHaveBeenCalledWith(ADMIN_ROUTE),
  );
});
