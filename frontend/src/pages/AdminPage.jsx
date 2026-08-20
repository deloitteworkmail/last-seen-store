import { useEffect, useState } from "react";
import { formatPrice } from "../utils/currency";

const emptyForm = { name: "", description: "", price: "", imageUrl: "", categoryId: "" };

export default function AdminPage() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [orders, setOrders] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState(null);

  function loadAll() {
    fetch("/api/admin/products", { credentials: "include" }).then((res) => res.json()).then(setProducts);
    fetch("/api/admin/categories", { credentials: "include" }).then((res) => res.json()).then(setCategories);
    fetch("/api/admin/orders", { credentials: "include" }).then((res) => res.json()).then(setOrders);
  }

  useEffect(() => {
    loadAll();
  }, []);

  function startEdit(product) {
    setEditingId(product.id);
    setForm({
      name: product.name,
      description: product.description,
      price: product.price,
      imageUrl: product.imageUrl,
      categoryId: product.categoryId,
    });
  }

  function cancelEdit() {
    setEditingId(null);
    setForm(emptyForm);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);

    const url = editingId ? `/api/admin/products/${editingId}` : "/api/admin/products";
    const method = editingId ? "PUT" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(form),
    });
    const data = await res.json();
    if (!res.ok) {
      setError(data.error || "Something went wrong.");
      return;
    }

    cancelEdit();
    loadAll();
  }

  async function handleDelete(id) {
    const res = await fetch(`/api/admin/products/${id}`, {
      method: "DELETE",
      credentials: "include",
    });
    if (res.status === 204) {
      loadAll();
    } else {
      const data = await res.json();
      setError(data.error || "Could not delete product.");
    }
  }

  return (
    <div className="page">
      <h1>Admin</h1>

      <h2>Products</h2>
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleSubmit} className="admin-form">
        <input
          placeholder="Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          required
        />
        <input
          placeholder="Description"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          required
        />
        <input
          placeholder="Price (INR)"
          type="number"
          value={form.price}
          onChange={(e) => setForm({ ...form, price: e.target.value })}
          required
        />
        <input
          placeholder="Image URL"
          value={form.imageUrl}
          onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
          required
        />
        <select
          value={form.categoryId}
          onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
          required
        >
          <option value="">Select category</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
        <div className="admin-form-buttons">
          <button type="submit">{editingId ? "Save Changes" : "Add Product"}</button>
          {editingId && (
            <button type="button" onClick={cancelEdit}>
              Cancel
            </button>
          )}
        </div>
      </form>

      <table className="admin-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Category</th>
            <th>Price</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.id}>
              <td>{product.name}</td>
              <td>{product.category.name}</td>
              <td>{formatPrice(product.price)}</td>
              <td>
                <button onClick={() => startEdit(product)}>Edit</button>
                <button className="cart-remove" onClick={() => handleDelete(product.id)}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2>All Orders</h2>
      <table className="admin-table">
        <thead>
          <tr>
            <th>Order #</th>
            <th>Customer</th>
            <th>Status</th>
            <th>Items</th>
            <th>Total</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => {
            const total = order.items.reduce((sum, item) => sum + item.priceEach * item.quantity, 0);
            return (
              <tr key={order.id}>
                <td>{order.id}</td>
                <td>{order.user.email}</td>
                <td className={`order-status order-status-${order.status}`}>{order.status}</td>
                <td>{order.items.map((item) => `${item.product.name} x${item.quantity}`).join(", ")}</td>
                <td>{formatPrice(total)}</td>
                <td>{new Date(order.createdAt).toLocaleDateString()}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
