import { Router } from 'express';
import { getCart, updateCart } from '../cartStore';
import { authCheck, type RequestWithUser } from '../middleware/authMiddleware';

const router = Router();

router.get('/', authCheck, (req: RequestWithUser, res) => {
  const cartId = `user:${req.user!.id}`;
  const cart = getCart(cartId);
  res.json(cart.items);
});

router.post('/add', authCheck, (req: RequestWithUser, res) => {
  const cartId = `user:${req.user!.id}`;
  const cart = getCart(cartId);

  const newItem = req.body;
  const existing = cart.items.find(i => i.id === newItem.id);

  if (existing) {
    existing.qty += newItem.qty;
  } else {
    cart.items.push(newItem);
  }

  updateCart(cartId, cart.items);
  res.json(cart.items);
});

router.post('/remove', authCheck, (req: RequestWithUser, res) => {
  const cartId = `user:${req.user!.id}`;
  const cart = getCart(cartId);

  const idToRemove = req.body.id;
  cart.items = cart.items.filter(i => i.id !== idToRemove);

  updateCart(cartId, cart.items);
  res.json(cart.items);
});

export default router;
