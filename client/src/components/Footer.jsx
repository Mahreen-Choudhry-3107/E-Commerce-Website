import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <div className="logo">
              <span className="logo-icon">&#9632;</span>
              <span className="logo-text">EASYCART</span>
            </div>
            <p className="footer-tagline">
              Premium quality products for modern living. We curate the best so you don't have to.
            </p>
          </div>
          <div className="footer-col">
            <h4>Quick Links</h4>
            <Link to="/">Home</Link>
            <Link to="/shop">Shop</Link>
            <Link to="/cart">Cart</Link>
          </div>
          <div className="footer-col">
            <h4>Categories</h4>
            <Link to="/shop?category=Electronics">Electronics</Link>
            <Link to="/shop?category=Clothing">Clothing</Link>
            <Link to="/shop?category=Accessories">Accessories</Link>
            <Link to="/shop?category=Home">Home</Link>
          </div>
          <div className="footer-col">
            <h4>Contact</h4>
            <p>support@easycart.com</p>
            <p>+1 (555) 123-4567</p>
            <p>123 Commerce St, Suite 100<br/>New York, NY 10001</p>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; 2026 Mahreen Choudhry. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  );
}
