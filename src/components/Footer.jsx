import { Link } from "react-router-dom";
import {
  FaInstagram,
  FaFacebookF,
  FaTiktok,
  FaWhatsapp,
} from "react-icons/fa";

import "../styles/footer.css";

function Footer() {
  return (
    <footer className="footer">

      <div className="footer-container">

        {/* Brand */}
        <div className="footer-section">
          <h2 className="footer-logo">MenVibe</h2>

          <p>
            Premium luxury watches crafted for style,
            elegance and confidence.
          </p>
        </div>

        {/* Links */}
        <div className="footer-section">
          <h3>Quick Links</h3>

          <Link to="/">Home</Link>
          <Link to="/shop">Shop</Link>
          <Link to="/contact">Contact</Link>
        </div>

        {/* Customer Service */}
        <div className="footer-section">
          <h3>Customer Service</h3>

          <p>Shipping Policy</p>
          <p>Return Policy</p>
          <p>Privacy Policy</p>
        </div>

        {/* Contact */}
        <div className="footer-section">
          <h3>Contact</h3>

          <p>📞 +92 349 703 5121</p>
          <p>📧 menvibestore@gmail.com</p>
          <p>📍 Lahore, Pakistan</p>

          <div className="footer-socials">
            <a href="https://www.instagram.com/menvibestore.pk/" target="_blank">
              <FaInstagram />
            </a>

            <a href="https://www.facebook.com/menvibestore.pk" target="_blank">
              <FaFacebookF />
            </a>

            <a href="https://www.tiktok.com/@menvibestore.pk" target="_blank">
              <FaTiktok />
            </a>

            <a href="https://wa.me/923497035121" target="_blank">
              <FaWhatsapp />
            </a>
          </div>
        </div>

      </div>

      <div className="footer-bottom">
        © 2026 MenVibe. All Rights Reserved.
      </div>

    </footer>
  );
}

export default Footer;