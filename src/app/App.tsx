import { BrowserRouter, Route, Routes } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout.tsx';
import HomePage from '../components/homePage';
import Admin from '../components/admin';
import Authorization from '../components/authorization';
import CartDrawer from '../components/cart/CartDrawer.tsx';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<HomePage />} />
          <Route path="/admin" element={<Admin />} />
        </Route>
        <Route path="/authorization" element={<Authorization />} />
        <Route path="/signup" element={<Authorization />} />
        <Route path="*" element={<h1>Not Found</h1>} />
      </Routes>
      <CartDrawer />
      {process.env.NODE_ENV !== 'production' && <ReactQueryDevtools initialIsOpen={false} />}
    </BrowserRouter>
  );
}
