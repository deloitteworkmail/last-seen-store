import { useState } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { formatPrice } from "../utils/currency";

export default function ProductCard({ product }) {
  const { addToCart } = useCart();
  const [added, setAdded] = useState(false);

  function handleQuickAdd(e) {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, 1);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  }

  return (
    <Link to={`/product/${product.id}`} className="product-card">
      <div className="product-card-media">
        <img src={product.imageUrl} alt={product.name} loading="lazy" />
        <button
          className={`quick-add ${added ? "quick-add-done" : ""}`}
          onClick={handleQuickAdd}
          aria-label={`Add ${product.name} to cart`}
        >
          {added ? "Added" : "+ Add"}
        </button>
      </div>
      <h3>{product.name}</h3>
      <p className="price">{formatPrice(product.price)}</p>
    </Link>
  );
}
