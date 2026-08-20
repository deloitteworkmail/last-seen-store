import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { formatPrice } from "../utils/currency";

export default function CartPage() {
  const { items, updateQuantity, removeFromCart, totalPrice, clearCart } = useCart();
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [checkingOut, setCheckingOut] = useState(false);
  const [error, setError] = useState(null);

  async function handleCheckout() {
    if (!user) {
      navigate("/login");
      return;
    }

    setError(null);
    setCheckingOut(true);

    try {
      const res = await fetch("/api/checkout/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          items: items.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
          })),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Could not start checkout.");

      const razorpay = new window.Razorpay({
        key: data.keyId,
        amount: data.amount,
        currency: data.currency,
        order_id: data.razorpayOrderId,
        name: "Last Seen",
        prefill: { email: user.email },
        theme: { color: "#111111" },
        handler: async function (response) {
          try {
            const verifyRes = await fetch("/api/checkout/verify", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              credentials: "include",
              body: JSON.stringify(response),
            });
            const verifyData = await verifyRes.json();
            if (!verifyRes.ok) throw new Error(verifyData.error || "Payment verification failed.");
            clearCart();
            navigate(`/order-confirmation?order_id=${data.orderId}`);
          } catch (err) {
            setError(err.message);
          }
        },
        modal: {
          ondismiss: function () {
            setCheckingOut(false);
          },
        },
      });

      razorpay.open();
      setCheckingOut(false);
    } catch (err) {
      setError(err.message);
      setCheckingOut(false);
    }
  }

  if (items.length === 0) {
    return (
      <div className="page">
        <h1>Your Cart</h1>
        <p>Your cart is empty.</p>
        <Link to="/">Continue shopping</Link>
      </div>
    );
  }

  return (
    <div className="page">
      <h1>Your Cart</h1>
      <div className="cart-list">
        {items.map((item) => (
          <div key={item.productId} className="cart-row">
            <img src={item.imageUrl} alt={item.name} />
            <div className="cart-row-info">
              <Link to={`/product/${item.productId}`}>{item.name}</Link>
              <p className="price">{formatPrice(item.price)}</p>
            </div>
            <div className="cart-row-qty">
              <button onClick={() => updateQuantity(item.productId, item.quantity - 1)}>
                -
              </button>
              <span>{item.quantity}</span>
              <button onClick={() => updateQuantity(item.productId, item.quantity + 1)}>
                +
              </button>
            </div>
            <p className="cart-row-subtotal">{formatPrice(item.price * item.quantity)}</p>
            <button className="cart-remove" onClick={() => removeFromCart(item.productId)}>
              Remove
            </button>
          </div>
        ))}
      </div>
      <div className="cart-total">
        <span>Total</span>
        <span>{formatPrice(totalPrice)}</span>
      </div>
      {error && <p className="error">{error}</p>}
      {!loading && !user && (
        <p className="cart-login-note">
          You'll need to <Link to="/login">log in</Link> before checking out.
        </p>
      )}
      <button onClick={handleCheckout} disabled={checkingOut}>
        {checkingOut ? "Opening payment..." : "Proceed to Checkout"}
      </button>
    </div>
  );
}
