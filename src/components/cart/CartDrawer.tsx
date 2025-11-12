import { useEffect, useRef } from 'react';
import { useCartDrawer } from './useCartDrawer';
import Basket from '../../../assets/images/basket2.png';
import { useCartStore } from '../../store/cart/store';

export default function CartDrawer() {
  const { isOpen, close } = useCartDrawer();
  const product = useCartStore((s) => s.product);
  const removeProduct = useCartStore((s) => s.removeProduct);
  const clearProduct = useCartStore((s) => s.clearCart);
  const closeBtnRef = useRef<HTMLButtonElement | null>(null);
  const drawerRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') close();
    }

    if (isOpen) {
      document.addEventListener('keydown', onKey);
      closeBtnRef.current?.focus();
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [isOpen, close]);

  const subtotal = (product ?? []).reduce((sum, it) => sum + (it.price * (it.qty ?? 1)), 0);

  if (!isOpen) return null;

  return (
    <>
      <div className="cart-box" onClick={close} data-testid="cart-overlay" />
      <aside
        className="cart-drawer"
        role="basket"
        aria-modal="true"
        aria-labelledby="cart-title"
        ref={drawerRef}
      >
        <header className="cart-drawer-header">
          <h2 id="cart-title" className="cart-title">YOUR CART</h2>
          <button
            ref={closeBtnRef}
            className="cart-close"
            aria-label="Close cart"
            onClick={close}
          >
            ✕
          </button>
        </header>
        <div className="cart-drawer-content">
          <div className="cart-columns">
            <div className="cart-col-items">
              <h3 className="items-heading">ITEMS</h3>
              <div className="items-list" data-testid="items-list">
                {product.length === 0 ? (
                  <div className="empty-state">Your cart is empty</div>
                ) : (
                  product.map(item => (
                    <div className="cart-item" key={item.id} data-testid="cart-item">
                      <div className="item-image-wrap">
                        <img src={item.image} alt={item.title} className="item-image" />
                      </div>
                      <div className="item-main">
                        <div className="item-title" data-testid="product-title">{item.title}</div>
                        <div className="item-qty-price">
                          <span className="item-qty">Qty: {item.qty ?? 1}</span>
                          <span className="item-price" data-testid="product-price">
                             ${(item.price * (item.qty ?? 1)).toFixed(2)}
                           </span>
                        </div>
                      </div>
                      <button className="remove-btn" aria-label="Remove" title="Remove item"
                              onClick={() => removeProduct(item.id)}>
                        ✕
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
            <div className="cart-col-summary">
              <div className="summary-image-wrap" aria-hidden="true">
                <img src={Basket} alt="" className="summary-image" />
              </div>
              <div className="cart-summary" data-testid="cart-summary">
                <h3 className="summary-title">Cart summary</h3>
                <div className="summary-row">
                  <span>Subtotal</span>
                  <strong>${subtotal.toFixed(2)}</strong>
                </div>
                <button className="checkout-button" onClick={() => {
                }}>
                  Proceed to checkout
                </button>
                <button onClick={clearProduct} className="clear-button">Clear cart</button>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
