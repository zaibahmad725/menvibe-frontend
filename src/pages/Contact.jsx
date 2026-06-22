import { useState } from "react";
import { FaInstagram, FaFacebookF, FaTiktok, FaWhatsapp } from "react-icons/fa";
import "../styles/contact.css";

const WHATSAPP_NUMBER = "923497035121"; 
const SOCIALS = {
    instagram: "https://www.instagram.com/menvibestore.pk/",
    facebook: "https://www.facebook.com/menvibestore.pk",
    tiktok: "https://www.tiktok.com/@menvibestore.pk",
}

function Contact() {
  const handleWhatsApp = (msg = "") => {
    const text = encodeURIComponent(msg || "Hello MenVibe! I have a query about your watches.");
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${text}`, "_blank");
  };

  return (
    <div className="contact-page">
      {/* Header */}
      <div className="contact-hero">
        <p className="contact-eyebrow">Get In Touch</p>
        <h1 className="contact-title">Contact Us</h1>
        <p className="contact-sub">
          We're here to help. Reach out via WhatsApp for the fastest response.
        </p>
      </div>

      <div className="contact-layout">
        {/* Info cards */}
        <div className="contact-info">
          <div className="info-card">
            <span className="info-icon">📍</span>
            <div>
              <p className="info-label">Our Location</p>
              <p className="info-value">Lahore, Punjab, Pakistan</p>
            </div>
          </div>

          <div className="info-card">
            <span className="info-icon">📞</span>
            <div>
              <p className="info-label">Phone / WhatsApp</p>
              <p className="info-value">+92 349 703 5121</p>
            </div>
          </div>

          <div className="info-card">
            <span className="info-icon">📧</span>
            <div>
              <p className="info-label">Email</p>
              <p className="info-value">Menvibestore@gmail.com</p>
            </div>
          </div>

          <div className="info-card">
            <span className="info-icon">🕐</span>
            <div>
              <p className="info-label">Business Hours</p>
              <p className="info-value">Mon – Sat: 10am – 8pm</p>
              <p className="info-value-sub">Sunday: 12pm – 6pm</p>
            </div>
          </div>

          <div className="info-card">
            <span className="info-icon">🚚</span>
            <div>
              <p className="info-label">Delivery</p>
              <p className="info-value">2–4 working days across Pakistan</p>
              <p className="info-value-sub">Cash on Delivery available</p>
            </div>
          </div>

          {/* Big WhatsApp CTA */}
          <button
            className="btn-whatsapp-main"
            onClick={() => handleWhatsApp()}
          >
            <span className="wa-icon">
              <svg viewBox="0 0 32 32" fill="currentColor" width="22" height="22">
                <path d="M16 2C8.28 2 2 8.28 2 16c0 2.46.66 4.76 1.8 6.76L2 30l7.44-1.78A13.93 13.93 0 0016 30c7.72 0 14-6.28 14-14S23.72 2 16 2zm7.1 19.44c-.3.84-1.74 1.6-2.4 1.7-.64.1-1.44.14-2.32-.14-.54-.16-1.22-.38-2.1-.74-3.7-1.6-6.12-5.34-6.3-5.6-.18-.24-1.44-1.92-1.44-3.66 0-1.74.9-2.6 1.22-2.96.3-.34.66-.42.88-.42l.64.01c.2 0 .48-.08.74.56.3.7 1.02 2.44 1.1 2.62.1.18.16.4.04.64-.12.24-.18.38-.36.58-.18.2-.38.44-.54.6-.18.18-.36.38-.16.74.2.36.9 1.48 1.94 2.4 1.34 1.18 2.46 1.56 2.82 1.72.36.18.58.16.8-.1.22-.26.9-1.06 1.14-1.42.24-.36.48-.3.8-.18.32.12 2.04.96 2.4 1.14.34.18.58.26.66.42.1.14.1.82-.2 1.64z"/>
              </svg>
            </span>
            Chat on WhatsApp
          </button>
        </div>

        {/* Quick message form */}
        <div className="contact-form-wrap">
          <h2 className="form-heading">Send a Quick Message</h2>
          <p className="form-sub">Fill in your details and we'll open WhatsApp with your message pre-filled.</p>

          <QuickMessageForm onSend={handleWhatsApp} />
        </div>
      </div>
<div className="social-section">
  <h2>Follow MenVibe</h2>

  <div className="social-links">
    <a
      href={SOCIALS.instagram}
      target="_blank"
      rel="noreferrer"
      className="social-btn"
    >
      <FaInstagram />
      <span>Instagram</span>
    </a>

    <a
      href={SOCIALS.facebook}
      target="_blank"
      rel="noreferrer"
      className="social-btn"
    >
      <FaFacebookF />
      <span>Facebook</span>
    </a>

    <a
      href={SOCIALS.tiktok}
      target="_blank"
      rel="noreferrer"
      className="social-btn"
    >
      <FaTiktok />
      <span>TikTok</span>
    </a>

    <a
      href={`https://wa.me/${WHATSAPP_NUMBER}`}
      target="_blank"
      rel="noreferrer"
      className="social-btn"
    >
      <FaWhatsapp />
      <span>WhatsApp</span>
    </a>
  </div>
</div>

      {/* FAQ strip */}
      <div className="faq-section">
        <h2 className="faq-title">Frequently Asked Questions</h2>
        <div className="faq-grid">
          {faqs.map((f, i) => (
            <div key={i} className="faq-card">
              <p className="faq-q">{f.q}</p>
              <p className="faq-a">{f.a}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function QuickMessageForm({ onSend }) {
  const [form, setForm] = useState({ name: "", phone: "", message: "" });

  const handle = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const send = () => {
    const { name, phone, message } = form;
    if (!name || !message) return alert("Please enter your name and message.");
    const text = `Hi MenVibe! My name is ${name}.${phone ? ` My number is ${phone}.` : ""}\n\n${message}`;
    onSend(text);
  };

  return (
    <div className="quick-form">
      <div className="form-group">
        <label>Your Name *</label>
        <input name="name" value={form.name} onChange={handle} placeholder="Ahmed Khan" />
      </div>
      <div className="form-group">
        <label>Phone (optional)</label>
        <input name="phone" value={form.phone} onChange={handle} placeholder="+92 300 0000000" />
      </div>
      <div className="form-group">
        <label>Message *</label>
        <textarea name="message" value={form.message} onChange={handle} rows={5}
          placeholder="I'm interested in the Rolex Submariner. Is it available?" />
      </div>
      <button className="btn-whatsapp-send" onClick={send}>
        <svg viewBox="0 0 32 32" fill="currentColor" width="18" height="18">
          <path d="M16 2C8.28 2 2 8.28 2 16c0 2.46.66 4.76 1.8 6.76L2 30l7.44-1.78A13.93 13.93 0 0016 30c7.72 0 14-6.28 14-14S23.72 2 16 2zm7.1 19.44c-.3.84-1.74 1.6-2.4 1.7-.64.1-1.44.14-2.32-.14-.54-.16-1.22-.38-2.1-.74-3.7-1.6-6.12-5.34-6.3-5.6-.18-.24-1.44-1.92-1.44-3.66 0-1.74.9-2.6 1.22-2.96.3-.34.66-.42.88-.42l.64.01c.2 0 .48-.08.74.56.3.7 1.02 2.44 1.1 2.62.1.18.16.4.04.64-.12.24-.18.38-.36.58-.18.2-.38.44-.54.6-.18.18-.36.38-.16.74.2.36.9 1.48 1.94 2.4 1.34 1.18 2.46 1.56 2.82 1.72.36.18.58.16.8-.1.22-.26.9-1.06 1.14-1.42.24-.36.48-.3.8-.18.32.12 2.04.96 2.4 1.14.34.18.58.26.66.42.1.14.1.82-.2 1.64z"/>
        </svg>
        Send via WhatsApp
      </button>
    </div>
  );
}

// Need React in scope for useState in same file

const faqs = [
  { q: "Do you offer Cash on Delivery?", a: "Yes! COD is available on all orders across Pakistan." },
  { q: "How long does delivery take?", a: "2–4 working days depending on your city." },
  { q: "Are the watches 100% authentic?", a: "Absolutely. We only stock genuine, verified timepieces." },
  { q: "Can I return a watch?", a: "Yes, we offer 7-day easy returns. No questions asked." },
  { q: "How do I place an order?", a: "Message us on WhatsApp with the watch you want and we'll handle the rest." },
  { q: "Do you ship outside Pakistan?", a: "Currently we ship within Pakistan only. International shipping coming soon." },
];

export default Contact;
