import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import ProductCard from '../components/ProductCard';

export default function Shop() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  const activeCategory = searchParams.get('category') || '';
  const searchQuery = searchParams.get('search') || '';

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams();
    if (activeCategory) params.set('category', activeCategory);
    if (searchQuery) params.set('search', searchQuery);

    fetch(`/api/products?${params.toString()}`)
      .then(res => res.json())
      .then(data => {
        setProducts(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [activeCategory, searchQuery]);

  const categories = ['All', 'Electronics', 'Clothing', 'Accessories', 'Home'];

  const handleCategory = (cat) => {
    if (cat === 'All') {
      setSearchParams({});
    } else {
      setSearchParams({ category: cat });
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    const form = e.target;
    const term = form.search.value;
    const params = new URLSearchParams();
    if (activeCategory) params.set('category', activeCategory);
    if (term) params.set('search', term);
    setSearchParams(params);
  };

  return (
    <div className="page">
      <div className="page-header">
        <div className="container">
          <h1>Shop</h1>
          <p>Browse our curated collection</p>
        </div>
      </div>

      <div className="container shop-toolbar">
        <form className="search-form" onSubmit={handleSearch}>
          <input
            type="text"
            name="search"
            defaultValue={searchQuery}
            placeholder="Search products..."
            className="search-input"
          />
          <button type="submit" className="btn btn-primary">Search</button>
        </form>
        <div className="category-filters">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => handleCategory(cat)}
              className={`filter-btn ${(cat === 'All' && !activeCategory) || cat === activeCategory ? 'active' : ''}`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="container section">
        {loading ? (
          <div className="loading">Loading...</div>
        ) : products.length === 0 ? (
          <div className="empty-state">
            <h3>No products found</h3>
            <p>Try adjusting your search or filter.</p>
          </div>
        ) : (
          <div className="product-grid">
            {products.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
