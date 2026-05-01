import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-grid">
        <div className="footer-brand">
          <Link to="/home" className="logo">MIMALICIOUS</Link>
          <p>Serving up the boldest flavors and the cheesiest smiles since 2024.</p>
        </div>
        <div>
          <h3 className="footer-heading">Get In Touch</h3>
          <ul className="footer-contact-list">
            <li><i className="fa-solid fa-envelope"></i><a href="mailto:service@mima.com.ph">service@mima.com.ph</a></li>
            <li><i className="fa-solid fa-phone"></i><span>8-533-3333</span></li>
          </ul>
        </div>
        <div>
          <h3 className="footer-heading">Explore</h3>
          <ul className="footer-links">
            <li><Link to="/home">Home</Link></li>
            <li><Link to="/menu">Full Menu</Link></li>
            <li><Link to="/about">Our Story</Link></li>
            <li><Link to="/contact">Find Us</Link></li>
          </ul>
        </div>
        <div>
          <h3 className="footer-heading">Get Social</h3>
          <div className="footer-social">
            <a href="#" aria-label="Facebook"><i className="fa-brands fa-facebook-f"></i></a>
            <a href="#" aria-label="Instagram"><i className="fa-brands fa-instagram"></i></a>
            <a href="#" aria-label="TikTok"><i className="fa-brands fa-tiktok"></i></a>
            <a href="#" aria-label="YouTube"><i className="fa-brands fa-youtube"></i></a>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        &copy; 2026 MIMALICIOUS. ALL RIGHTS RESERVED. WAG KANG MAGPAPAGUTOM!<br />
        DEVELOPED BY PROGRAMIZ
      </div>
    </footer>
  );
}
