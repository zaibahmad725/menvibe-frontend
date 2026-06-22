import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getHeroSlides } from "../services/api";
import { API_URL } from "../config";
import "../styles/hero.css";

// Shown only if the database has zero hero slides yet (e.g. fresh install,
// before admin has added any via the dashboard). Once admin adds slides,
// this fallback is never used.
const FALLBACK_SLIDE = {
  _id: "fallback",
  eyebrow: "MenVibe Store",
  title: "Timepieces\nFor Every Man",
  subtitle: "Discover our curated collection of luxury watches.",
  accent: "",
  cta: "Shop Now",
  link: "/shop",
  image: null,
};

function HeroSlider() {
  const [slides, setSlides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [current, setCurrent] = useState(0);
  const [animating, setAnimating] = useState(false);

  useEffect(() => {
    getHeroSlides()
      .then((res) => {
        setSlides(res.data?.length ? res.data : [FALLBACK_SLIDE]);
      })
      .catch(() => setSlides([FALLBACK_SLIDE]))
      .finally(() => setLoading(false));
  }, []);

  const goTo = (index) => {
    if (animating || index === current) return;
    setAnimating(true);
    setTimeout(() => {
      setCurrent(index);
      setAnimating(false);
    }, 400);
  };

  useEffect(() => {
    if (slides.length <= 1) return;
    const timer = setInterval(() => {
      goTo((current + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [current, slides.length]);

  if (loading) {
    return <div className="hero-slider hero-slider-loading" />;
  }

  const slide = slides[current];
  const imageSrc = slide.image
    ? slide.image.startsWith("http")
      ? slide.image
      : `${API_URL}${slide.image}`
    : null;

  return (
    <div className="hero-slider">
      <div className={`hero-slide ${animating ? "hero-fade-out" : "hero-fade-in"}`}>
        {imageSrc ? (
          <img src={imageSrc} alt={slide.title} className="hero-bg" />
        ) : (
          <div className="hero-bg hero-bg-placeholder" />
        )}
        <div className="hero-overlay" />
        <div className="hero-content">
          {slide.eyebrow && <p className="hero-eyebrow">{slide.eyebrow}</p>}
          <h1 className="hero-title">
            {slide.title.split("\n").map((line, i) => (
              <span key={i}>{line}<br /></span>
            ))}
          </h1>
          {slide.subtitle && <p className="hero-subtitle">{slide.subtitle}</p>}
          {slide.accent && <p className="hero-accent">{slide.accent}</p>}
          <Link to={slide.link || "/shop"} className="hero-cta">{slide.cta || "Shop Now"}</Link>
        </div>
      </div>

      {slides.length > 1 && (
        <>
          <div className="hero-dots">
            {slides.map((_, i) => (
              <button
                key={i}
                className={`hero-dot ${i === current ? "active" : ""}`}
                onClick={() => goTo(i)}
                aria-label={`Slide ${i + 1}`}
              />
            ))}
          </div>

          <button className="hero-arrow hero-prev" onClick={() => goTo((current - 1 + slides.length) % slides.length)}>‹</button>
          <button className="hero-arrow hero-next" onClick={() => goTo((current + 1) % slides.length)}>›</button>
        </>
      )}
    </div>
  );
}

export default HeroSlider;