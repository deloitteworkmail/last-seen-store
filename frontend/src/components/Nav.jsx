import { Link, useNavigate } from "react-router-dom";
import RegionSelector from "./RegionSelector";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

export default function Nav() {
  const { user, loading, logout } = useAuth();
  const { totalItems } = useCart();
  const navigate = useNavigate();

  async function handleLogout() {
    await logout();
    navigate("/");
  }

  return (
    <nav className="nav">
      <Link to="/" className="nav-brand">
        Last Seen
      </Link>
      <div className="nav-right">
        <RegionSelector />
        <Link to="/cart" className="nav-link nav-cart">
          Cart{totalItems > 0 && <span className="cart-badge">{totalItems}</span>}
        </Link>
        {!loading && user && (
          <>
            <Link to="/orders" className="nav-link">
              My Orders
            </Link>
            {user.isAdmin && (
              <Link to="/admin" className="nav-link">
                Admin
              </Link>
            )}
            <span className="nav-user">{user.email}</span>
            <button className="nav-button" onClick={handleLogout}>
              Log out
            </button>
          </>
        )}
        {!loading && !user && (
          <>
            <Link to="/login" className="nav-link">
              Log in
            </Link>
            <Link to="/signup" className="nav-link">
              Sign up
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}
