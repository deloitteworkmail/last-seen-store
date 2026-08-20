import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { formatPrice } from "../utils/currency";

export default function OrderConfirmationPage() {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get("order_id");
  const [order, setOrder] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!orderId) {
      setError("Missing order id.");
      return;
    }

    fetch(`/api/orders/${orderId}`, { credentials: "include" })
      .then((res) => {
        if (!res.ok) throw new Error("Could not load order.");
        return res.json();
      })
      .then(setOrder)
      .catch((err) => setError(err.message));
  }, [orderId]);

  if (error) return <p className="error">{error}</p>;
  if (!order) return <p className="page">Loading your order...</p>;

  return (
    <div className="page">
      <h1>{order.status === "paid" ? "Thank you for your order!" : "Order pending"}</h1>
      <p>Order #{order.id}</p>
      <div className="cart-list">
        {order.items.map((item) => (
          <div key={item.id} className="cart-row">
            <img src={item.product.imageUrl} alt={item.product.name} />
            <div className="cart-row-info">
              <span>{item.product.name}</span>
              <p className="price">
                {item.quantity} &times; {formatPrice(item.priceEach)}
              </p>
            </div>
            <p className="cart-row-subtotal">{formatPrice(item.priceEach * item.quantity)}</p>
          </div>
        ))}
      </div>
      <Link to="/">Continue shopping</Link>
    </div>
  );
}
