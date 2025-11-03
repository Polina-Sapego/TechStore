import Basket from '../../../images/basket.png'
import { useCartDrawer } from './useCartDrawer.tsx';

export default function CartButton() {
  const { open } = useCartDrawer();
  return (
    <img
      src={Basket}
      alt="Open cart"
      className="cart-icon"
      role="button"
      tabIndex={0}
      onClick={open}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(); } }}
    />
  );
}
