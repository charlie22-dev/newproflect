import React, { useEffect, useRef } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';

const ORDER_HISTORY_KEY = 'mimaliciousOrderHistory';

export default function Navbar({ cartCount, onCartToggle, showCart }) {
  const navigate = useNavigate();
  const location = useLocation();
  const navRef = useRef(null);

  function logout(e) {
    e.preventDefault();
    localStorage.removeItem(ORDER_HISTORY_KEY);
    sessionStorage.removeItem(ORDER_HISTORY_KEY);
    localStorage.removeItem('loggedIn');
    navigate('/');
  }

  useEffect(() => {
    const nav = navRef.current;
    if (!nav) return;
    let lastScrollY = window.scrollY;
    const onScroll = () => {
      const scrollY = window.scrollY;
      if (scrollY > 50) nav.classList.add('scrolled'); else nav.classList.remove('scrolled');
      if (scrollY > lastScrollY && scrollY > 200) nav.classList.add('nav-hidden'); else nav.classList.remove('nav-hidden');
      lastScrollY = scrollY;
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // 3D tilt on nav links
  useEffect(() => {
    const items = document.querySelectorAll('.nav-links a');
    const handleMove = (item, e) => {
      const r = item.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      item.style.transition = 'none';
      item.style.transform = `perspective(600px) rotateX(${-y * 14}deg) rotateY(${x * 14}deg) scale(1.06)`;
    };
    const handleLeave = (item) => {
      item.style.transition = 'background 200ms var(--ease-out), transform 300ms var(--ease-out)';
      item.style.transform = '';
    };
    items.forEach(item => {
      item.addEventListener('mousemove', (e) => handleMove(item, e));
      item.addEventListener('mouseleave', () => handleLeave(item));
    });
    return () => {
      items.forEach(item => {
        item.replaceWith(item.cloneNode(true));
      });
    };
  }, [location.pathname]);

  const isMenu = location.pathname === '/menu';

  return (
    <nav className="navbar" id="mainNav" ref={navRef} style={isMenu ? { display: 'flex', justifyContent: 'space-between' } : {}}>
      <NavLink to="/home" className="logo">MIMALICIOUS</NavLink>
      <ul className="nav-links">
        <li><NavLink to="/home" className={({ isActive }) => isActive ? 'active' : ''}>HOME</NavLink></li>
        <li><NavLink to="/menu" className={({ isActive }) => isActive ? 'active' : ''}>MENU</NavLink></li>
        <li><NavLink to="/about" className={({ isActive }) => isActive ? 'active' : ''}>ABOUT</NavLink></li>
        <li><NavLink to="/contact" className={({ isActive }) => isActive ? 'active' : ''}>CONTACT</NavLink></li>
        <li><NavLink to="/history" className={({ isActive }) => isActive ? 'active' : ''}>ORDERS</NavLink></li>
      </ul>
      {isMenu ? (
        <div className="nav-right">
          <div className="cart-icon" onClick={onCartToggle} id="cart-toggle-btn">
            <i className="fa-solid fa-bag-shopping"></i>
            <span id="cart-count">{cartCount || 0}</span>
          </div>
          <button className="nav-button" onClick={logout} id="logout-btn">LOGOUT</button>
        </div>
      ) : (
        <button className="nav-button" onClick={logout} id="logout-btn">LOGOUT</button>
      )}
    </nav>
  );
}
