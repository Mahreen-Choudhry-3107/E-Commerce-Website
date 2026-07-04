import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';

export default function Checkout() {
  const { items, clearCart, sessionId } = useCart();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [form, setForm] = useState({
    name: '',
    email: '',
    address: '',
    city: '',
    zip: ''
  });

  useEffect(() => {
    fetch('/api/products')
      .then(res => res.json())
      .then(data => setProducts(data))
      .catch(() => {});
  }, []);

  const cartProducts = items.map(item => {
    const product = products.find(p => p.id === item.productId);
    return { ...item, product };
  }).filter(item => item.product);

  const subtotal = cartProducts.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const tax = subtotal * 0.08;
  const total = subtotal + tax;

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (items.length === 0) return;
    setSubmitting(true);

    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items,
          customer: form
        })
      });
      if (res.ok) {
        setSuccess(true);
        clearCart();
      }
    } catch {
      alert('Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="page">
        <div className="container section empty-state">
          <div className="success-icon">&#10003;</div>
          <h2>Order Placed Successfully!</h2>
          <p>Thank you for your purchase. You will receive a confirmation email shortly.</p>
          <Link to="/shop" className="btn btn-primary">Continue Shopping</Link>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="page">
        <div className="container section empty-state">
          <h2>Your cart is empty</h2>
          <p>Add some items before checking out.</p>
          <Link to="/shop" className="btn btn-primary">Shop Now</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      <div className="page-header">
        <div className="container">
          <h1>Checkout</h1>
        </div>
      </div>

      <div className="container section checkout-layout">
        <form className="checkout-form" onSubmit={handleSubmit}>
          <h3>Shipping Information</h3>
          <div className="form-group">
            <label>Full Name</label>
            <input name="name" required value={form.name} onChange={handleChange} placeholder="John Doe" />
          </div>
          <div className="form-group">
            <label>Email</label>
            <input name="email" type="email" required value={form.email} onChange={handleChange} placeholder="john@example.com" />
          </div>
          <div className="form-group">
            <label>Address</label>
            <input name="address" required value={form.address} onChange={handleChange} placeholder="123 Main St" />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>City</label>
              <input name="city" required value={form.city} onChange={handleChange} placeholder="New York" />
            </div>
            <div className="form-group">
              <label>ZIP Code</label>
              <input name="zip" required value={form.zip} onChange={handleChange} placeholder="10001" />
            </div>
          </div>
          <button type="submit" className="btn btn-primary btn-block" disabled={submitting}>
            {submitting ? 'Processing...' : `Place Order — $${total.toFixed(2)}`}
          </button>
        </form>

        <div className="checkout-summary">
          <h3>Order Summary</h3>
          {cartProducts.map(({ product, quantity }) => (
            <div key={product.id} className="checkout-item">
              <img src={product.image} alt={product.name} />
              <div>
                <p className="checkout-item-name">{product.name}</p>
                <p className="checkout-item-qty">Qty: {quantity}</p>
              </div>
              <span>${(product.price * quantity).toFixed(2)}</span>
            </div>
          ))}
          <div className="summary-row"><span>Subtotal</span><span>${subtotal.toFixed(2)}</span></div>
          <div className="summary-row"><span>Tax</span><span>${tax.toFixed(2)}</span></div>
          <div className="summary-row summary-total"><span>Total</span><span>${total.toFixed(2)}</span></div>
        </div>
      </div>
    </div>
  );
}
