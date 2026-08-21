import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { formatPrice } from "../utils/currency";

const CATEGORY_IMAGES = {
  Shirts: "/products/classic-white-shirt.jpg",
  Jackets: "/products/denim-jacket.jpg",
  Shoes: "/products/leather-boots.jpg",
  Accessories: "/products/wool-beanie.jpg",
};

export default function Home() {
  const [categories, setCategories] = useState([]);
  const [featured, setFeatured] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch("/api/categories")
      .then((res) => res.json())
      .then(setCategories)
      .catch(() => setError("Could not load categories."));

    fetch("/api/products")
      .then((res) => res.json())
      .then((products) => setFeatured(products.slice(0, 4)))
      .catch(() => {});
  }, []);

  return (
    <div>
      <div className="hero">
        <h1>Last Seen</h1>
        <p>Considered clothing for people who notice details.</p>
      </div>
      <div className="trust-bar">
        <span>Free shipping over ₹999</span>
        <span>Easy 7-day returns</span>
        <span>Secure checkout</span>
      </div>
      <div className="page">
        <h2 style={{ marginTop: 0 }}>Shop by Category</h2>
        {error && <p className="error">{error}</p>}
        <div className="grid category-grid">
          {categories.map((category) => (
            <Link
              key={category.id}
              to={`/category/${category.name}`}
              className="category-card"
              style={
                CATEGORY_IMAGES[category.name]
                  ? { backgroundImage: `url(${CATEGORY_IMAGES[category.name]})` }
                  : undefined
              }
            >
              <span className="category-card-label">{category.name}</span>
            </Link>
          ))}
        </div>

        {featured.length > 0 && (
          <>
            <h2>Featured</h2>
            <div className="grid">
              {featured.map((product) => (
                <Link key={product.id} to={`/product/${product.id}`} className="product-card">
                  <img src={product.imageUrl} alt={product.name} />
                  <h3>{product.name}</h3>
                  <p className="price">{formatPrice(product.price)}</p>
                </Link>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
