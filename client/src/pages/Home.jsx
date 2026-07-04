import { useState, useEffect, useCallback, useRef } from 'react';
import { Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard';

const slides = [
  {
    image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1600&q=80',
    headline: 'Discover Your<br/>Perfect Style',
    subtitle: 'Curated collections of premium products — from cutting-edge electronics to timeless fashion.',
    btnText: 'Shop Now'
  },
  {
    image: 'https://images.unsplash.com/photo-1490114538077-0a7f8cb49891?w=1600&q=80',
    headline: 'Tech That<br/>Inspires You',
    subtitle: 'Latest gadgets and accessories crafted for those who demand the best in design and performance.',
    btnText: 'Explore Tech'
  },
  {
    image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=1600&q=80',
    headline: 'Elevate Your<br/><span class="highlight">Wardrobe</span>',
    subtitle: 'Premium fashion essentials from sustainable materials — look good, feel good, do good.',
    btnText: 'Shop Fashion'
  }
];

const categories = [
  { name: 'Electronics', image: 'https://images.unsplash.com/photo-1468495244123-6c6c332eeece?w=600&q=80', count: '6 Products' },
  { name: 'Clothing', image: 'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=600&q=80', count: '5 Products' },
  { name: 'Accessories', image: 'https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?w=600&q=80', count: '4 Products' },
  { name: 'Home', image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600&q=80', count: '5 Products' }
];

const testimonials = [
  { name: 'Sarah Mitchell', role: 'Verified Buyer', text: 'Absolutely love my purchase! The quality exceeded my expectations and shipping was incredibly fast. Will definitely be ordering again.', avatar: 'SM', rating: 5 },
  { name: 'James Rodriguez', role: 'Verified Buyer', text: 'EasyCart has become my go-to online store. The product selection is amazing and customer service is top-notch. Highly recommend!', avatar: 'JR', rating: 5 },
  { name: 'Emily Chen', role: 'Verified Buyer', text: 'I was hesitant to order online but EasyCart made it seamless. The packaging was beautiful and the item was exactly as described.', avatar: 'EC', rating: 5 },
  { name: 'Michael Torres', role: 'Verified Buyer', text: 'Been shopping here for months now. Consistent quality, fair prices, and they always have the latest trends. Five stars all the way!', avatar: 'MT', rating: 5 }
];

const brands = ['TECHNOVA', 'VELORA', 'CRAFTIQUE', 'AURA', 'NORDEN', 'ZENITH'];

export default function Home() {
  const [featured, setFeatured] = useState([]);
  const [trending, setTrending] = useState([]);
  const [loading, setLoading] = useState(true);
  const [trendingLoading, setTrendingLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [testimonialIdx, setTestimonialIdx] = useState(0);
  const [counts, setCounts] = useState({ products: 0, customers: 0, orders: 0, reviews: 0 });
  const observerRef = useRef(null);
  const sectionRefs = useRef(new Map());

  const nextSlide = useCallback(() => {
    setCurrentSlide(prev => (prev + 1) % slides.length);
  }, []);

  const prevSlide = useCallback(() => {
    setCurrentSlide(prev => (prev - 1 + slides.length) % slides.length);
  }, []);

  useEffect(() => {
    const timer = setInterval(nextSlide, 5000);
    return () => clearInterval(timer);
  }, [nextSlide]);

  useEffect(() => {
    fetch('/api/products')
      .then(res => res.json())
      .then(data => {
        setFeatured(data.slice(0, 4));
        setLoading(false);
        const shuffled = [...data].sort(() => Math.random() - 0.5);
        setTrending(shuffled.slice(0, 4));
        setTrendingLoading(false);
      })
      .catch(() => { setLoading(false); setTrendingLoading(false); });
  }, []);

  useEffect(() => {
    const target = { products: 20, customers: 12000, orders: 8500, reviews: 3500 };
    const duration = 2000;
    const step = 50;
    let elapsed = 0;

    const timer = setInterval(() => {
      elapsed += step;
      const progress = Math.min(elapsed / duration, 1);
      setCounts({
        products: Math.floor(progress * target.products),
        customers: Math.floor(progress * target.customers),
        orders: Math.floor(progress * target.orders),
        reviews: Math.floor(progress * target.reviews)
      });
      if (progress >= 1) clearInterval(timer);
    }, step);

    return () => clearInterval(timer);
  }, []);

  const observeAll = useCallback(() => {
    if (observerRef.current) observerRef.current.disconnect();

    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in-view');
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );

    sectionRefs.current.forEach(ref => {
      if (ref) observerRef.current.observe(ref);
    });
  }, []);

  useEffect(() => {
    observeAll();
    return () => { if (observerRef.current) observerRef.current.disconnect(); };
  }, [observeAll]);

  useEffect(() => {
    if (!trendingLoading) observeAll();
  }, [trendingLoading, observeAll]);

  const setSectionRef = (id) => (el) => {
    if (el) sectionRefs.current.set(id, el);
    else sectionRefs.current.delete(id);
  };

  return (
    <div className="page">
      {/* ─── 1. Hero ─── */}
      <section className="hero">
        {slides.map((slide, i) => (
          <div key={i} className={`hero-slide ${i === currentSlide ? 'active' : ''}`}>
            <div className="hero-bg" style={{ backgroundImage: `url(${slide.image})` }} />
            <div className="hero-overlay" />
            <div className="hero-content">
              <span className="hero-badge">New Collection</span>
              <h1 dangerouslySetInnerHTML={{ __html: slide.headline }} />
              <p>{slide.subtitle}</p>
              <Link to="/shop" className="btn btn-primary">{slide.btnText}</Link>
            </div>
          </div>
        ))}
        <button className="hero-arrow prev" onClick={prevSlide}>&lsaquo;</button>
        <button className="hero-arrow next" onClick={nextSlide}>&rsaquo;</button>
        <div className="hero-dots">
          {slides.map((_, i) => (
            <button key={i} className={`hero-dot ${i === currentSlide ? 'active' : ''}`} onClick={() => setCurrentSlide(i)} />
          ))}
        </div>
      </section>

      {/* ─── 2. Stats Bar ─── */}
      <section className="stats-bar animate-on-scroll" ref={setSectionRef('stats')}>
        <div className="container stats-grid">
          <div className="stat-item"><span className="stat-number">{counts.products.toLocaleString()}+</span><span className="stat-label">Products</span></div>
          <div className="stat-item"><span className="stat-number">{counts.customers.toLocaleString()}+</span><span className="stat-label">Happy Customers</span></div>
          <div className="stat-item"><span className="stat-number">{counts.orders.toLocaleString()}+</span><span className="stat-label">Orders Delivered</span></div>
          <div className="stat-item"><span className="stat-number">{counts.reviews.toLocaleString()}+</span><span className="stat-label">Reviews</span></div>
        </div>
      </section>

      {/* ─── 3. Categories ─── */}
      <section className="section animate-on-scroll" ref={setSectionRef('categories')}>
        <div className="container">
          <div className="section-header">
            <div><span className="section-subtitle">Shop by</span><h2>Categories</h2></div>
          </div>
          <div className="categories-grid">
            {categories.map((cat, i) => (
              <Link key={cat.name} to={`/shop?category=${cat.name}`} className="category-card" style={{ animationDelay: `${0.1 + i * 0.1}s` }}>
                <div className="category-img"><img src={cat.image} alt={cat.name} loading="lazy" /></div>
                <div className="category-info"><h3>{cat.name}</h3><span className="category-count">{cat.count}</span></div>
                <div className="category-arrow">&rarr;</div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ─── 4. Featured Products ─── */}
      <section className="section section-alt animate-on-scroll" ref={setSectionRef('featured')}>
        <div className="container">
          <div className="section-header">
            <div><span className="section-subtitle">Top Picks</span><h2>Featured Products</h2></div>
            <Link to="/shop" className="btn btn-outline">View All &rarr;</Link>
          </div>
          {loading ? <div className="loading">Loading products...</div> : (
            <div className="product-grid">
              {featured.map(product => <ProductCard key={product.id} product={product} />)}
            </div>
          )}
        </div>
      </section>

      {/* ─── 5. Mid-page Promo Banner ─── */}
      <section className="promo-banner animate-on-scroll" ref={setSectionRef('promo')}>
        <div className="container promo-content">
          <span className="promo-tag">Limited Offer</span>
          <h2>Get 20% Off Your First Order</h2>
          <p>Use code <strong>EASY20</strong> at checkout. Offer valid for new customers only.</p>
          <Link to="/shop" className="btn promo-btn">Shop the Sale</Link>
        </div>
      </section>

      {/* ─── 6. Trending / Deals ─── */}
      <section className="section animate-on-scroll" ref={setSectionRef('trending')}>
        <div className="container">
          <div className="section-header">
            <div><span className="section-subtitle">Hot Right Now</span><h2>Trending Deals</h2></div>
            <Link to="/shop" className="btn btn-outline">View All &rarr;</Link>
          </div>
          {trendingLoading ? <div className="loading">Loading deals...</div> : (
            <div className="product-grid">
              {trending.map(product => <ProductCard key={product.id} product={product} />)}
            </div>
          )}
        </div>
      </section>

      {/* ─── 7. Testimonials ─── */}
      <section className="section section-alt testimonials-section animate-on-scroll" ref={setSectionRef('testimonials')}>
        <div className="container">
          <div className="section-header">
            <div><span className="section-subtitle">What They Say</span><h2>Customer Reviews</h2></div>
            <div className="testimonial-arrows">
              <button onClick={() => setTestimonialIdx(prev => (prev - 1 + testimonials.length) % testimonials.length)} className="testi-arrow">&lsaquo;</button>
              <button onClick={() => setTestimonialIdx(prev => (prev + 1) % testimonials.length)} className="testi-arrow">&rsaquo;</button>
            </div>
          </div>
          <div className="testimonials-wrapper">
            <div className="testimonials-track" style={{ transform: `translateX(-${testimonialIdx * 100}%)` }}>
              {testimonials.map(t => (
                <div key={t.name} className="testimonial-card">
                  <div className="testi-stars">{'★'.repeat(t.rating)}{'☆'.repeat(5 - t.rating)}</div>
                  <p className="testi-text">"{t.text}"</p>
                  <div className="testi-author">
                    <div className="testi-avatar">{t.avatar}</div>
                    <div><p className="testi-name">{t.name}</p><p className="testi-role">{t.role}</p></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="testimonials-dots">
            {testimonials.map((_, i) => (
              <button key={i} className={`testi-dot ${i === testimonialIdx ? 'active' : ''}`} onClick={() => setTestimonialIdx(i)} />
            ))}
          </div>
        </div>
      </section>

      {/* ─── 8. Trusted Brands ─── */}
      <section className="section brands-section animate-on-scroll" ref={setSectionRef('brands')}>
        <div className="container">
          <div className="section-header">
            <div><span className="section-subtitle">Partners</span><h2>Trusted Brands</h2></div>
          </div>
          <div className="brands-grid">
            {brands.map((b, i) => (
              <div key={b} className="brand-logo" style={{ animationDelay: `${i * 0.08}s` }}>{b}</div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── 9. Newsletter ─── */}
      <section className="newsletter-section animate-on-scroll" ref={setSectionRef('newsletter')}>
        <div className="container newsletter-content">
          <h2>Stay in the Loop</h2>
          <p>Subscribe for exclusive deals, new arrivals, and 10% off your next order.</p>
          <form className="newsletter-form" onSubmit={e => { e.preventDefault(); alert('Thanks for subscribing!'); }}>
            <input type="email" placeholder="Enter your email" required className="newsletter-input" />
            <button type="submit" className="btn btn-primary">Subscribe</button>
          </form>
        </div>
      </section>

      {/* ─── 10. Features ─── */}
      <section className="section features-section animate-on-scroll" ref={setSectionRef('features')}>
        <div className="container features-grid">
          <div className="feature-card"><div className="feature-icon">&#128666;</div><h3>Free Shipping</h3><p>On all orders over $50</p></div>
          <div className="feature-card"><div className="feature-icon">&#128260;</div><h3>24/7 Support</h3><p>Dedicated customer service</p></div>
          <div className="feature-card"><div className="feature-icon">&#128260;</div><h3>Easy Returns</h3><p>30-day money-back guarantee</p></div>
          <div className="feature-card"><div className="feature-icon">&#128274;</div><h3>Secure Checkout</h3><p>SSL encrypted payments</p></div>
        </div>
      </section>
    </div>
  );
}
