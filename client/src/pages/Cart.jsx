import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

export default function Cart() {
  const { items, updateQuantity, removeFromCart } = useCart();
  const [products, setProducts] = useState([]);

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

  if (items.length === 0) {
    return (
      <div className="page">
        <div className="page-header">
          <div className="container">
            <h1>Shopping Cart</h1>
          </div>
        </div>
        <div className="container section empty-state">
          <div className="empty-cart-icon">&#128722;</div>
          <h2>Your cart is empty</h2>
          <p>Looks like you haven't added anything yet.</p>
          <Link to="/shop" className="btn btn-primary">Continue Shopping</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      <div className="page-header">
        <div className="container">
          <h1>Shopping Cart</h1>
          <p>{items.length} item{items.length !== 1 ? 's' : ''} in your cart</p>
        </div>
      </div>

      <div className="container section cart-layout">
        <div className="cart-items">
          {cartProducts.map(({ product, quantity, productId }) => (
            <div key={productId} className="cart-item">
              <img src={product.image} alt={product.name} className="cart-item-img" />
              <div className="cart-item-details">
                <h3>{product.name}</h3>
                <p className="cart-item-price">${product.price.toFixed(2)}</p>
              </div>
              <div className="cart-item-qty">
                <button onClick={() => updateQuantity(productId, quantity - 1)} className="qty-btn">-</button>
                <span className="qty-value">{quantity}</span>
                <button onClick={() => updateQuantity(productId, quantity + 1)} className="qty-btn">+</button>
              </div>
              <div className="cart-item-total">${(product.price * quantity).toFixed(2)}</div>
              <button onClick={() => removeFromCart(productId)} className="btn-remove">&times;</button>
            </div>
          ))}
        </div>

        <div className="cart-summary">
          <h3>Order Summary</h3>
          <div className="summary-row">
            <span>Subtotal</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>
          <div className="summary-row">
            <span>Tax (8%)</span>
            <span>${tax.toFixed(2)}</span>
          </div>
          <div className="summary-row summary-total">
            <span>Total</span>
            <span>${total.toFixed(2)}</span>
          </div>
          <Link to="/checkout" className="btn btn-primary btn-block">Proceed to Checkout</Link>
          <Link to="/shop" className="btn btn-outline btn-block">Continue Shopping</Link>
        </div>
      </div>
    </div>
  );
}
