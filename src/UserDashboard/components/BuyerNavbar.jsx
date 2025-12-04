import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import '../styles/BuyerNavbar.css';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location]);

  const isActive = (path) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <nav className={`buyer-navbar ${scrolled ? 'buyer-navbar-scrolled' : ''}`}>
      <div className="buyer-navbar-container">
        <div className="buyer-navbar-content">
          {/* Logo */}
          <Link to="/" className="buyer-navbar-logo">
            <div className="buyer-logo-container">
              <img src="/logo.jpeg" alt="India Propertys" className="buyer-logo-image" />
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="buyer-nav-links-desktop">
            <Link to="/BuyerHome" className={`buyer-nav-link ${isActive('/BuyerHome') ? 'active' : ''}`}>
              <span>Home</span>
            </Link>
            <Link to="/buy" className={`buyer-nav-link ${isActive('/Cityfilteredbuy') ? 'active' : ''}`}>
              <span>Buy</span>
            </Link>
            <Link to="/rent" className={`buyer-nav-link ${isActive('/Cityfilteredrent') ? 'active' : ''}`}>
              <span>Rent</span>
            </Link>
            <Link to="/BuyerProfile" className={`buyer-nav-link ${isActive('/BuyerProfile') ? 'active' : ''}`}>
              <span>Profile</span>
            </Link>
            <Link to="/ChatUs" className={`buyer-nav-link ${isActive('/ChatUs') ? 'active' : ''}`}>
              <span>Chat Us</span>
            </Link>
            <Link to="/BuyerContactPage" className={`buyer-nav-link ${isActive('/BuyerContactPage') ? 'active' : ''}`}>
              <span>Contact</span>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className={`buyer-mobile-menu-button ${isMenuOpen ? 'open' : ''}`}
            aria-label="Toggle menu"
          >
            <span className="buyer-menu-icon-line"></span>
            <span className="buyer-menu-icon-line"></span>
            <span className="buyer-menu-icon-line"></span>
          </button>
        </div>

        {/* Mobile Menu */}
        <div className={`buyer-mobile-menu ${isMenuOpen ? 'open' : ''}`}>
          <div className="buyer-mobile-menu-content">
            <Link to="/BuyerHome" className={`buyer-mobile-nav-link ${isActive('/BuyerHome') ? 'active' : ''}`}>
              <span>Home</span>
            </Link>
            <Link to="/buy" className={`buyer-mobile-nav-link ${isActive('/buy') ? 'active' : ''}`}>
              <span>Buy</span>
            </Link>
            <Link to="/rent" className={`buyer-mobile-nav-link ${isActive('/rent') ? 'active' : ''}`}>
              <span>Rent</span>
            </Link>
            <Link to="/BuyerProfile" className={`buyer-mobile-nav-link ${isActive('/BuyerProfile') ? 'active' : ''}`}>
              <span>Profile</span>
            </Link>
            <Link to="/chatus" className={`buyer-mobile-nav-link ${isActive('/chatus') ? 'active' : ''}`}>
              <span>Chat Us</span>
            </Link>
            <Link to="/buyercontact" className={`buyer-mobile-nav-link ${isActive('/buyercontact') ? 'active' : ''}`}>
              <span>Contact</span>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;