import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-columns">
        <div className="footer-col">
          <div className="footer-brand">Last Seen</div>
          <p>Considered clothing for people who notice details.</p>
        </div>
        <div className="footer-col">
          <h4>Shop</h4>
          <Link to="/category/Shirts">Shirts</Link>
          <Link to="/category/Jackets">Jackets</Link>
          <Link to="/category/Shoes">Shoes</Link>
          <Link to="/category/Accessories">Accessories</Link>
        </div>
        <div className="footer-col">
          <h4>Help</h4>
          <span>Shipping &amp; Returns</span>
          <span>Size Guide</span>
          <span>Contact Us</span>
        </div>
        <div className="footer-col">
          <h4>About</h4>
          <span>Our Story</span>
          <span>Sustainability</span>
          <span>Careers</span>
        </div>
      </div>
      <div className="footer-bottom">
        &copy; {new Date().getFullYear()} Last Seen. All prices in INR.
      </div>
    </footer>
  );
}
