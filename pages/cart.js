import { useCartDispatch, useCartState } from "../context/cart";

import commerce from "../lib/commerce";

function CartItem({ id, name, quantity, line_total }) {
  const { setCart } = useCartDispatch();

  const handleUpdateCart = ({ cart }) => setCart(cart);

  const removeItem = () => commerce.cart.remove(id).then(handleUpdateCart);

  const decrementQuantity = () => {
    quantity > 1
      ? commerce.cart
          .update(id, { quantity: quantity - 1 })
          .then(handleUpdateCart)
      : removeItem();
  };

  const incrementQuantity = () =>
    commerce.cart.update(id, { quantity: quantity + 1 }).then(handleUpdateCart);

  return (
    <div>
      <p>{name}</p>
      <p>{quantity}</p>
      <p>{line_total.formatted_with_symbol}</p>
      <div>
        <button onClick={decrementQuantity}>-</button>
        <button onClick={incrementQuantity}>+</button>
      </div>
      <button onClick={removeItem}>&times;</button>
    </div>
  );
}

export default function CartPage() {
  const { line_items, subtotal } = useCartState();

  const isEmpty = line_items.length === 0;

  if (isEmpty) return <p>Your cart is empty</p>;

  return (
    <div>
      <h1>Cart</h1>

      {line_items.map((item) => (
        <CartItem key={item.id} {...item} />
      ))}

      <hr />

      <p>
        <strong>Sub total:</strong> {subtotal.formatted_with_symbol}
      </p>
    </div>
  );
}
