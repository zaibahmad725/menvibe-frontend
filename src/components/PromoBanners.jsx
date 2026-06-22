import { Link } from "react-router-dom";
import "../styles/promo.css";

const banners = [
  {
    label: "Limited Time",
    title: "Up to 30% Off",
    sub: "On selected luxury watches",
    cta: "Shop Sale",
    link: "/shop",
    style: "banner-sale",
  },
  {
    label: "New Arrivals",
    title: "2026 Collection",
    sub: "Just landed — Rolex, Omega & more",
    cta: "Explore",
    link: "/shop",
    style: "banner-new",
  },
  {
    label: "Free Shipping",
    title: "Free Delivery Nationwide",
    sub: "Cash on delivery across Pakistan",
    cta: "Start Shopping",
    link: "/shop",
    style: "banner-ship",
  },
];

function PromoBanners() {
  return (
    <section className="promo-section">
      {banners.map((b, i) => (
        <div key={i} className={`promo-banner ${b.style}`}>
          <p className="promo-label">{b.label}</p>
          <h3 className="promo-title">{b.title}</h3>
          <p className="promo-sub">{b.sub}</p>
          <Link to={b.link} className="promo-cta">{b.cta} →</Link>
        </div>
      ))}
    </section>
  );
}

export default PromoBanners;