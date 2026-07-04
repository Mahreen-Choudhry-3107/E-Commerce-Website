import { useCart } from '../context/CartContext';

export default function ProductCard({ product }) {
  const { addToCart } = useCart();

  return (
    <div className="product-card">
      <div className="product-image-wrap">
        <img src={product.image} alt={product.name} loading="lazy" />
        <span className="product-category">{product.category}</span>
        <div className="product-overlay">
          <button className="btn-quickview" onClick={() => addToCart(product.id, 1)}>
            Add to Cart
          </button>
        </div>
      </div>
      <div className="product-info">
        <h3 className="product-name">{product.name}</h3>
        <p className="product-desc">{product.description}</p>
        <div className="product-meta">
          <span className="product-price">${product.price.toFixed(2)}</span>
          <span className="product-rating">&#9733; {product.rating}</span>
        </div>
      </div>
    </div>
  );
}
