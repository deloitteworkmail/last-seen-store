import { useEffect, useState } from "react";
import { formatPrice } from "../utils/currency";

export default function OrdersPage() {
  const [orders, setOrders] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch("/api/orders", { credentials: "include" })
      .then((res) => {
        if (!res.ok) throw new Error("Could not load orders.");
        return res.json();
      })
      .then(setOrders)
      .catch((err) => setError(err.message));
  }, []);

  if (error) return <p className="error">{error}</p>;
  if (!orders) return <p className="page">Loading...</p>;

  if (orders.length === 0) {
    return (
      <div className="page">
        <h1>My Orders</h1>
        <p>You haven't placed any orders yet.</p>
      </div>
    );
  }

  return (
    <div className="page">
      <h1>My Orders</h1>
      {orders.map((order) => {
        const total = order.items.reduce(
          (sum, item) => sum + item.priceEach * item.quantity,
          0
        );
        return (
          <div key={order.id} className="order-card">
            <div className="order-card-header">
              <span>Order #{order.id}</span>
              <span className={`order-status order-status-${order.status}`}>
                {order.status}
              </span>
              <span>{new Date(order.createdAt).toLocaleDateString()}</span>
            </div>
            <ul>
              {order.items.map((item) => (
                <li key={item.id}>
                  {item.product.name} &times; {item.quantity}
                </li>
              ))}
            </ul>
            <p className="order-card-total">Total: {formatPrice(total)}</p>
          </div>
        );
      })}
    </div>
  );
}
