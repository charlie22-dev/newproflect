import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';

export default function Home() {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);
  const carouselRef = useRef(null);

  const slides = ['/images/carousel1.jpg', '/images/carousel2.jpg', '/images/carousel3.png'];

  const goToSlide = (index) => setCurrentSlide(index);

  useEffect(() => {
    const interval = setInterval(() => setCurrentSlide(s => (s + 1) % slides.length), 5000);
    return () => clearInterval(interval);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const nav = document.getElementById('mainNav');
    if (!nav) return;
    let lastScrollY = window.scrollY;
    const onScroll = () => {
      const scrollY = window.scrollY;
      if (scrollY > 50) nav.classList.add('nav-scrolled'); else nav.classList.remove('nav-scrolled');
      if (scrollY > lastScrollY && scrollY > 200) nav.classList.add('nav-hidden'); else nav.classList.remove('nav-hidden');
      // Parallax
      if (carouselRef.current && window.matchMedia('(pointer: fine)').matches) {
        carouselRef.current.style.transform = `translateY(${scrollY * 0.4}px)`;
      }
      lastScrollY = scrollY;
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const obs = new IntersectionObserver(entries => entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('animate-in'); obs.unobserve(e.target); }
    }), { threshold: 0.12 });
    document.querySelectorAll('.reveal, .reveal-stagger').forEach(el => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  const SESAME_SVG = `url("data:image/svg+xml,%3Csvg width='200' height='150' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23fcefb4' opacity='0.9'%3E%3Cpath d='M20,10c2,0,5,3,5,6c0,4-3,6-5,6c-2,0-5-2-5-6C15,13,18,10,20,10z' transform='rotate(15 20 16)'/%3E%3Cpath d='M80,30c2,0,5,3,5,6c0,4-3,6-5,6c-2,0-5-2-5-6C75,33,78,30,80,30z' transform='rotate(-20 80 36)'/%3E%3Cpath d='M140,15c2,0,5,3,5,6c0,4-3,6-5,6c-2,0-5-2-5-6C135,18,138,15,140,15z' transform='rotate(45 140 21)'/%3E%3Cpath d='M40,60c2,0,5,3,5,6c0,4-3,6-5,6c-2,0-5-2-5-6C35,63,38,60,40,60z' transform='rotate(-35 40 66)'/%3E%3Cpath d='M100,70c2,0,5,3,5,6c0,4-3,6-5,6c-2,0-5-2-5-6C95,73,98,70,100,70z' transform='rotate(10 100 76)'/%3E%3C/g%3E%3C/svg%3E")`;

  return (
    <>
      <style>{`
        body { padding-top: 0; background-color: var(--red); }
        .top-bun { position: relative; background: linear-gradient(180deg, #e8a335 0%, #c27d1a 100%) !important; border-radius: 50% 50% 0 0 / 100px 100px 0 0 !important; overflow: hidden; box-shadow: inset 0 20px 40px rgba(255,255,255,0.25), 0 -10px 20px rgba(0,0,0,0.1) !important; z-index: 20; padding-top: 5rem !important; margin-top: -100px; }
        .top-bun::after { content: ''; position: absolute; inset: 0; pointer-events: none; background-image: ${SESAME_SVG}; background-size: 260px 190px; z-index: 1; }
        #stats.top-bun .stat-item { position: relative; z-index: 2; }
        #stats.top-bun .stat-number { color: #fff !important; text-shadow: 3px 3px 0 var(--brown) !important; }
        #stats.top-bun .stat-label { color: var(--brown) !important; font-weight: 900 !important; }
        .hero-container { position: relative; height: 100dvh; min-height: 560px; width: 100%; background: var(--brown); overflow: hidden; display: flex; align-items: center; }
        .carousel { position: absolute; inset: -15% 0; z-index: 1; will-change: transform; }
        .carousel-item { position: absolute; inset: 0; opacity: 0; transition: opacity 1.2s ease-in-out; background-size: cover; background-repeat: no-repeat; background-position: center; }
        .carousel-item.active { opacity: 1; }
        .hero-overlay { position: absolute; inset: 0; background: linear-gradient(105deg, rgba(59,26,8,0.82) 0%, rgba(59,26,8,0.5) 55%, rgba(59,26,8,0.1) 100%); z-index: 2; }
        .hero-texture { position: absolute; inset: 0; background-image: radial-gradient(circle, rgba(255,255,255,0.08) 1px, transparent 1px); background-size: 24px 24px; pointer-events: none; z-index: 3; }
        .hero-content { position: relative; z-index: 10; padding: 0 6%; color: var(--white); max-width: 700px; }
        .hero-content h1 { font-family: var(--font-display); font-size: clamp(3.5rem, 10vw, 7rem); line-height: 0.92; text-transform: uppercase; letter-spacing: 0.02em; text-shadow: 4px 4px 0 rgba(0,0,0,0.3); margin-bottom: 1.2rem; }
        .hero-content p { font-size: clamp(1rem, 2.2vw, 1.3rem); color: var(--cream); margin-bottom: 2.5rem; font-weight: 600; line-height: 1.5; max-width: 480px; }
        .hero-top-nav { position: fixed; top: 0; left: 0; width: 100%; z-index: 100; display: flex; justify-content: space-between; align-items: center; padding: 1.8rem 6%; background: transparent; box-shadow: none; transition: transform 0.4s cubic-bezier(0.32, 0.72, 0, 1), background-color 0.4s ease, padding 0.4s ease, box-shadow 0.4s ease; }
        .hero-top-nav.nav-scrolled { background: var(--red); padding: 1.2rem 6%; box-shadow: 0 10px 30px rgba(0,0,0,0.3); }
        .hero-top-nav.nav-hidden { transform: translateY(-100%); }
        .hero-top-nav .logo { color: var(--yellow); text-shadow: 2px 2px 0 var(--brown); }
        .order-btn { display: inline-flex; align-items: center; gap: 0.6rem; background: var(--yellow); color: var(--brown); border: 3px solid var(--brown); border-radius: 50px; padding: 1rem 2.4rem; font-family: var(--font-display); font-size: 1.3rem; letter-spacing: 0.06em; cursor: pointer; text-decoration: none; transition: background 200ms var(--ease-out), color 200ms var(--ease-out), transform 160ms var(--ease-out), box-shadow 200ms var(--ease-out); box-shadow: 0 6px 0 var(--brown); }
        .order-btn:hover { background: var(--white); color: var(--red); transform: translateY(-3px); box-shadow: 0 10px 0 var(--brown), 0 6px 28px rgba(245,166,35,0.5); }
        .carousel-dots { position: absolute; bottom: 4.5rem; left: 6%; z-index: 20; display: flex; gap: 0.5rem; }
        .carousel-dot { width: 8px; height: 8px; border-radius: 50%; background: rgba(245,237,214,0.4); border: 2px solid rgba(245,237,214,0.6); cursor: pointer; transition: background 250ms var(--ease-out), transform 250ms var(--ease-out); }
        .carousel-dot.active { background: var(--yellow); border-color: var(--yellow); transform: scale(1.3); }
        @keyframes sizzlePatty { 0%, 100% { transform: translateY(0) scale(1); } 50% { transform: translateY(3px) scale(0.995); } }
        .daily-deals { padding: 6rem 6%; text-align: center; background: #3b1a08; position: relative; z-index: 10; box-shadow: inset 0 -10px 25px rgba(0,0,0,0.9), inset 0 10px 25px rgba(0,0,0,0.9); animation: sizzlePatty 3s infinite ease-in-out; }
        .daily-deals .section-title { color: var(--yellow); text-shadow: 3px 3px 0 var(--black); position: relative; z-index: 2; }
        .deals-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px,1fr)); gap: 2.5rem; max-width: 1100px; margin: 0 auto; position: relative; z-index: 2; }
        .deal-card { background: rgba(255,250,240,0.95); border: 1px solid rgba(255,255,255,0.5); border-radius: 2rem; box-shadow: 0 20px 40px -10px rgba(0,0,0,0.6), inset 0 2px 0 rgba(255,255,255,0.8); color: var(--brown); transition: transform 300ms cubic-bezier(0.23,1,0.32,1), box-shadow 300ms cubic-bezier(0.23,1,0.32,1); position: relative; z-index: 2; padding: 2.5rem 2rem; display: flex; flex-direction: column; align-items: center; text-align: center; backdrop-filter: blur(10px); overflow: hidden; }
        .deal-card:hover { transform: translateY(-8px); box-shadow: 0 30px 50px -15px rgba(0,0,0,0.7), inset 0 2px 0 rgba(255,255,255,1); }
        .deal-tag { position: absolute; top: 1.5rem; right: -2.5rem; background: #E53935; color: white; font-family: var(--font-display); font-size: 0.9rem; letter-spacing: 0.1em; padding: 0.4rem 3rem; transform: rotate(45deg); z-index: 5; }
        .deal-card h3 { color: #3E2723; font-size: 1.7rem; margin-bottom: 0.5rem; line-height: 1.1; }
        .deal-card p { color: #6D4C41; font-size: 0.95rem; line-height: 1.5; margin-bottom: 2rem; font-family: var(--font-body); flex-grow: 1; }
        .grab-btn { display: inline-flex; align-items: center; justify-content: center; gap: 0.5rem; width: 100%; background: #FFB300; color: #3E2723; border: none; border-radius: 50px; padding: 1rem 1.5rem; font-family: var(--font-display); font-size: 1.15rem; letter-spacing: 0.05em; cursor: pointer; transition: background 200ms ease, color 200ms ease, transform 160ms cubic-bezier(0.23,1,0.32,1); box-shadow: 0 6px 15px rgba(255,179,0,0.3), inset 0 2px 0 rgba(255,255,255,0.4); }
        .grab-btn:hover { background: #FFA000; color: #1A1009; transform: translateY(-2px); }
        .lettuce-curtain { position: relative; width: 100%; height: 75px; margin-top: -10px; margin-bottom: -65px; background-image: url("data:image/svg+xml,%3Csvg width='400' height='75' viewBox='0 0 400 75' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M 0,0 L 0,40 C 10,40 15,10 25,10 C 35,10 45,50 60,50 C 75,50 85,20 100,20 C 115,20 125,60 140,60 C 155,60 165,15 180,15 C 195,15 205,50 220,50 C 235,50 245,25 260,25 C 275,25 290,65 310,65 C 330,65 345,15 360,15 C 375,15 385,40 400,40 L 400,0 Z' fill='%232e5a1c'/%3E%3Cpath d='M 0,0 L 0,55 C 10,55 20,25 30,25 C 40,25 50,45 60,45 C 70,45 80,10 95,10 C 110,10 120,65 135,65 C 150,65 160,35 175,35 C 190,35 200,45 210,45 C 220,45 235,15 255,15 C 275,15 285,55 300,55 C 315,55 325,35 340,35 C 355,35 365,65 380,65 C 390,65 395,55 400,55 L 400,0 Z' fill='%2370B354' stroke='%23A5D6A7' stroke-width='1.5'/%3E%3C/svg%3E"); background-size: 400px 75px; z-index: 15; animation: swayLettuce 15s infinite ease-in-out alternate; filter: drop-shadow(0 6px 8px rgba(0,0,0,0.4)); pointer-events: none; }
        @keyframes swayLettuce { from { background-position: 0 0; } to { background-position: -400px 0; } }
        .home-footer-note { text-align: center; padding: 6rem 2rem 2.5rem; font-weight: 800; font-size: 0.85rem; color: var(--brown); text-transform: uppercase; letter-spacing: 0.06em; background: linear-gradient(180deg, #e8a335 0%, #c27d1a 100%); border-radius: 20px 20px 50% 50% / 20px 20px 80px 80px; position: relative; z-index: 5; box-shadow: inset 0 -15px 30px rgba(160,90,10,0.7); }
        @media (max-width: 768px) { .hero-content h1 { font-size: clamp(3rem, 12vw, 5rem); } }
      `}</style>

      {/* Overlay navbar for Home (custom transparent hero nav) */}
      <Navbar />

      {/* HERO */}
      <section className="hero-container" id="hero">
        <div className="carousel" id="parallaxCarousel" ref={carouselRef}>
          {slides.map((src, i) => (
            <div key={i} className={`carousel-item${currentSlide === i ? ' active' : ''}`} style={{ backgroundImage: `url('${src}')` }}></div>
          ))}
        </div>
        <div className="hero-overlay"></div>
        <div className="hero-texture"></div>

        <div className="hero-content">
          <span className="eyebrow">Ready for Round 2?</span>
          <h1 style={{ textTransform: 'none', display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: '0.55em', textTransform: 'lowercase', lineHeight: 1 }}>welcome</span>
            <span style={{ color: 'var(--yellow)', textTransform: 'uppercase' }}>BACK!</span>
          </h1>
          <p>Ang tagal mong nawala, muntik nang lumamig ang patties namin. Order na!</p>
          <button className="order-btn" onClick={() => navigate('/menu')} id="feed-hunger-btn">
            FEED MY HUNGER <i className="fa-solid fa-fire"></i>
          </button>
        </div>

        <div className="carousel-dots" id="carouselDots">
          {slides.map((_, i) => (
            <div key={i} className={`carousel-dot${currentSlide === i ? ' active' : ''}`} onClick={() => goToSlide(i)}></div>
          ))}
        </div>
      </section>

      {/* STATS BAR — TOP BUN */}
      <div className="stats-bar reveal-stagger top-bun" id="stats">
        <div className="stat-item"><span className="stat-number">12k+</span><span className="stat-label">Burgers Smashed</span></div>
        <div className="stat-item"><span className="stat-number">0%</span><span className="stat-label">Leftovers Ever</span></div>
        <div className="stat-item"><span className="stat-number">100%</span><span className="stat-label">Freshness Guaranteed</span></div>
        <div className="stat-item"><span className="stat-number">Unlimited</span><span className="stat-label">Flavor Hits</span></div>
      </div>

      {/* LETTUCE CURTAIN */}
      <div className="lettuce-curtain"></div>

      {/* DAILY DEALS — THE PATTY */}
      <section className="daily-deals" id="deals">
        <h2 className="section-title reveal">Today's <span>Sizzling</span> Hits</h2>
        <div className="deals-grid reveal-stagger">
          {[
            { img: 'deluxe.png', tag: 'HOT DEAL', name: 'Mima-namnam Deluxe', desc: 'Savory beef, bacon, and fresh toppings stacked high.', id: 'grab-deluxe' },
            { img: 'bite.png', tag: 'LIMITED', name: 'Mima-amazing Bite', desc: 'Juicy beef, crispy bacon, cheesy goodness in every bite.', id: 'grab-bite' },
            { img: 'supreme.png', tag: 'LIMITED', name: 'Mima-sarap Supreme', desc: 'Beef + fried chicken with rich sauces. The full experience.', id: 'grab-supreme' },
          ].map((d, i) => (
            <div className="deal-card" key={i}>
              <div className="deal-tag">{d.tag}</div>
              <img src={`/images/${d.img}`} alt={d.name} style={{ width: '150px', marginBottom: '1rem', alignSelf: 'center' }} />
              <h3>{d.name}</h3>
              <p>{d.desc}</p>
              <button className="grab-btn" id={d.id} onClick={() => navigate('/menu#order-here')}>
                GRAB IT <i className="fa-solid fa-bag-shopping"></i>
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* CHEESE MELT */}
      <div className="cheese-melt"></div>

      {/* SLIM FOOTER */}
      <div className="home-footer-note">
        <p>&copy; 2026 MIMALICIOUS. ALL RIGHTS RESERVED. WAG KANG MAGPAPAGUTOM!<br />DEVELOPED BY PROGRAMIZ</p>
      </div>
    </>
  );
}
