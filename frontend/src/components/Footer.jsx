import { useState } from "react";
import { Link } from "react-router-dom";

export default function Footer() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  function handleSubscribe(e) {
    e.preventDefault();
    if (!email) return;
    setSubscribed(true);
    setEmail("");
  }

  return (
    <footer className="site-footer">
      <div className="footer-columns">
        <div className="footer-col">
          <div className="footer-brand">Last Seen</div>
          <p>Considered clothing for people who notice details.</p>
          <form className="newsletter-form" onSubmit={handleSubscribe}>
            <input
              type="email"
              placeholder="Your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <button type="submit">Join</button>
          </form>
          {subscribed && <p className="newsletter-thanks">You're on the list.</p>}
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
          <Link to="/info/shipping-returns">Shipping &amp; Returns</Link>
          <Link to="/info/size-guide">Size Guide</Link>
          <Link to="/info/contact">Contact Us</Link>
        </div>
        <div className="footer-col">
          <h4>About</h4>
          <Link to="/info/our-story">Our Story</Link>
          <Link to="/info/sustainability">Sustainability</Link>
          <Link to="/info/careers">Careers</Link>
        </div>
      </div>
      <div className="footer-bottom">
        &copy; {new Date().getFullYear()} Last Seen. All prices in INR.
      </div>
    </footer>
  );
}
