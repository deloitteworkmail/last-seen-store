import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function Home() {
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch("/api/categories")
      .then((res) => res.json())
      .then(setCategories)
      .catch(() => setError("Could not load categories."));
  }, []);

  return (
    <div>
      <div className="hero">
        <h1>Last Seen</h1>
        <p>Considered clothing for people who notice details.</p>
      </div>
      <div className="page">
        <h2 style={{ marginTop: 0 }}>Shop by Category</h2>
        {error && <p className="error">{error}</p>}
        <div className="grid">
          {categories.map((category) => (
            <Link
              key={category.id}
              to={`/category/${category.name}`}
              className="category-card"
            >
              {category.name}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
