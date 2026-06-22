import AnnouncementBar from "../components/AnnouncementBar";
import HeroSlider from "../components/HeroSlider";
import TrustBar from "../components/TrustBar";
import PromoBanners from "../components/PromoBanners";
import FeaturedProducts from "../components/FeaturedProducts";
import "../styles/home.css";

const reviews = [
  { name: "Ahmed K.", rating: 5, text: "Rolex ki quality bohot achi thi. Delivery bhi jaldi ho gayi. MenVibe se zaroor dobara khareedunga!", time: "2 days ago" },
  { name: "Sara F.", rating: 5, text: "Omega Seamaster bilkul waisi hi thi jesi picture mein thi. Cash on delivery ka option bhi tha.", time: "5 days ago" },
  { name: "Usman R.", rating: 4, text: "Apple Watch ne meri zindagi aasan kar di. Packaging bhi secure thi. Highly recommended!", time: "1 week ago" },
  { name: "Maryam N.", rating: 5, text: "Tissot PRX ki quality amazing hai. Ghar mein sab ko pasand aaya. Bohot fast delivery thi.", time: "1 week ago" },
];

function StarRating({ count }) {
  return (
    <span className="stars">
      {Array.from({ length: 5 }, (_, i) => (
        <span key={i} style={{ color: i < count ? "#D4AF37" : "#444" }}>★</span>
      ))}
    </span>
  );
}

function Home() {
  return (
    <div className="home">
      {/* 1. Announcement bar — slim, always top */}
      <AnnouncementBar />

      {/* 2. Hero slider — first thing customer sees */}
      <HeroSlider />

      {/* 3. Featured products — immediately after hero, no delay */}
      <FeaturedProducts />

      {/* 4. Promo banners — after customer has seen products */}
      <PromoBanners />

      {/* 5. Reviews */}
      <section className="reviews-section">
        <div className="reviews-inner">
          <p className="section-eyebrow">Customer Stories</p>
          <h2 className="section-title">What Our Customers Say</h2>
          <div className="reviews-grid">
            {reviews.map((r, i) => (
              <div key={i} className="review-card">
                <StarRating count={r.rating} />
                <p className="review-text">"{r.text}"</p>
                <div className="review-author">
                  <span className="review-avatar">{r.name[0]}</span>
                  <div>
                    <p className="review-name">{r.name}</p>
                    <p className="review-time">{r.time}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. Stats */}
      <section className="stats-section">
        <div className="stats-inner">
          {[
            { value: "5,000+", label: "Happy Customers" },
            { value: "50+",    label: "Watch Brands" },
            { value: "4.9★",   label: "Average Rating" },
            { value: "2-4",    label: "Days Delivery" },
          ].map((s, i) => (
            <div key={i} className="stat-block">
              <p className="stat-val">{s.value}</p>
              <p className="stat-lbl">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 7. Trust bar — just above footer, where customers look before buying */}
      <TrustBar />
    </div>
  );
}

export default Home;