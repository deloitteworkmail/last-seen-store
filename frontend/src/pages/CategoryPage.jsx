import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import ProductCard from "../components/ProductCard";

export default function CategoryPage() {
  const { categoryName } = useParams();
  const [products, setProducts] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    setError(null);
    fetch(`/api/products?category=${encodeURIComponent(categoryName)}`)
      .then((res) => res.json())
      .then(setProducts)
      .catch(() => setError("Could not load products."));
  }, [categoryName]);

  if (error) return <p className="error">{error}</p>;

  return (
    <div className="page">
      <Link to="/" className="back-link">
        &larr; All categories
      </Link>
      <h1>{categoryName}</h1>
      <div className="grid">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
