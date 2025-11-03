import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import { useCartStore } from "../../store/cart/store.ts";
import { CartDrawerProvider } from "../cart/CartDrawerContext.tsx";
import CartDrawer from "../cart/CartDrawer";
import CartButton from "../cart/CartButton";

function renderWithProviders(ui: React.ReactNode) {
  return render(<CartDrawerProvider>{ui}</CartDrawerProvider>);
}

beforeEach(() => {
  const { clearCart } = useCartStore.getState();
  clearCart();
});

describe("CartDrawer integration", () => {
  it("отображает добавленный товар после открытия корзины", async () => {
    const user = userEvent.setup();

    const { addProduct } = useCartStore.getState();
    addProduct({
      id: 1,
      title: "Test Product",
      price: 15,
      qty: 1,
      image: "test-image.png",
    });

    renderWithProviders(
      <>
        <CartButton />
        <CartDrawer />
      </>
    );

    const cartButton = screen.getByRole("button", { name: /open cart/i });
    await user.click(cartButton);

    const drawer = await screen.findByRole("basket");
    expect(drawer).toBeInTheDocument();

    const productTitle = await screen.findByTestId("product-title");
    expect(productTitle).toHaveTextContent("Test Product");

    const summary = await screen.findByTestId("cart-summary");
    expect(summary).toHaveTextContent("$15.00");
  });
});
