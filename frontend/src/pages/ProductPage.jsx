import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { formatPrice } from "../utils/currency";
import { useCart } from "../context/CartContext";

export default function ProductPage() {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [error, setError] = useState(null);
  const [added, setAdded] = useState(false);
  const { addToCart } = useCart();

  useEffect(() => {
    setError(null);
    setProduct(null);
    setAdded(false);
    fetch(`/api/products/${productId}`)
      .then((res) => {
        if (!res.ok) throw new Error("not found");
        return res.json();
      })
      .then(setProduct)
      .catch(() => setError("Product not found."));
  }, [productId]);

  if (error) return <p className="error">{error}</p>;
  if (!product) return <p>Loading...</p>;

  function handleAddToCart() {
    addToCart(product, 1);
    setAdded(true);
  }

  return (
    <div className="page">
      <Link to={`/category/${product.category.name}`} className="back-link">
        &larr; {product.category.name}
      </Link>
      <div className="product-detail">
        <img src={product.imageUrl} alt={product.name} />
        <div>
          <h1>{product.name}</h1>
          <p className="price">{formatPrice(product.price)}</p>
          <p>{product.description}</p>
          <button onClick={handleAddToCart}>Add to Cart</button>
          {added && (
            <p className="added-message">
              Added to cart. <Link to="/cart">View cart</Link>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
