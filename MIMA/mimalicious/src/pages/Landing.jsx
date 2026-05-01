import React, { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Footer from '../components/Footer';

const REVIEWS = [
  { initial: 'M', quote: '"Grabe yung Big Mima, kaya na nyang pumalit sa aking ex! Hindi ako nag-regret kahit isang segundo. Solid ang lasa, bes — babalik na naman ako bukas!"', name: 'Marvie Santos', tag: 'Verified Burger Addict • Quezon City' },
  { initial: 'K', quote: '"Yung Mima Cheesy Overload? Bro, four layers ng cheese. FOUR. I called my mom after just to tell her I\'m okay. Kinain ko ulit pagkatapos. 10/10 no regrets."', name: 'Karlo Reyes', tag: 'Regular Customer • Makati' },
  { initial: 'L', quote: '"Pina-order ko \'tong Mima BBQ Blast sa first date ko. Third date na kami ngayon, and he said \'the burger sealed the deal.\' Hindi ko sure kung ako yung ibig sabihin — basta ayaw ko malaman."', name: 'Lovely Dela Cruz', tag: 'Suki ng Mimalicious • Pasig' },
  { initial: 'A', quote: '"Tinry ko yung Mima Fire Crunch isang beses. Isang beses lang — kasi every day na ako mag-uuwi ng lima. Doc said my blood type is now BBQ. Absolutely worth it."', name: 'Andro Bautista', tag: 'Power Customer • Mandaluyong' },
];

const AUTOPLAY_MS = 5000;

export default function Landing() {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [revCurrent, setRevCurrent] = useState(0);
  const [revAnim, setRevAnim] = useState(REVIEWS.map((_, i) => i === 0 ? 'active' : ''));
  const isAnimating = useRef(false);
  const timerRef = useRef(null);
  const progressRef = useRef(null);
  const carouselRef = useRef(null);

  const slides = ['/images/carousel1.jpg', '/images/carousel2.jpg', '/images/carousel3.png'];

  useEffect(() => {
    const interval = setInterval(() => setCurrentSlide(s => (s + 1) % slides.length), 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const onScroll = () => {
      if (carouselRef.current && window.matchMedia('(pointer: fine)').matches) {
        carouselRef.current.style.transform = `translateY(${window.scrollY * 0.4}px)`;
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const goTo = (index) => {
    if (isAnimating.current || index === revCurrent) return;
    isAnimating.current = true;
    const prev = revCurrent;
    setRevCurrent(index);
    setRevAnim(a => { const n = [...a]; n[prev] = 'exit'; n[index] = 'active'; return n; });
    setTimeout(() => {
      setRevAnim(a => { const n = [...a]; n[prev] = ''; return n; });
      isAnimating.current = false;
    }, 480);
    resetProgress();
  };

  const resetProgress = () => {
    const bar = progressRef.current;
    if (!bar) return;
    bar.style.transition = 'none'; bar.style.width = '0%';
    void bar.offsetWidth;
    bar.style.transition = `width ${AUTOPLAY_MS}ms linear`; bar.style.width = '100%';
  };

  useEffect(() => {
    resetProgress();
    timerRef.current = setInterval(() => {
      setRevCurrent(prev => { const next = (prev + 1) % REVIEWS.length; if (!isAnimating.current) goTo(next); return prev; });
    }, AUTOPLAY_MS);
    return () => clearInterval(timerRef.current);
  }, [revCurrent]);

  useEffect(() => {
    const obs = new IntersectionObserver(entries => entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('animate-in'); obs.unobserve(e.target); }
    }), { threshold: 0.12 });
    document.querySelectorAll('.reveal, .reveal-stagger').forEach(el => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  return (
    <>
      <style>{`
        body { padding-top: 0; }
        .hero-container { position: relative; height: 100dvh; min-height: 560px; width: 100%; background: var(--brown); overflow: hidden; display: flex; align-items: center; }
        .carousel-bg { position: absolute; inset: -15% 0; z-index: 1; will-change: transform; }
        .carousel-item { position: absolute; inset: 0; opacity: 0; transition: opacity 1.2s ease-in-out; background-size: cover; background-repeat: no-repeat; background-position: center; }
        .carousel-item.active { opacity: 1; }
        .hero-overlay { position: absolute; inset: 0; background: linear-gradient(105deg, rgba(59,26,8,0.82) 0%, rgba(59,26,8,0.5) 55%, rgba(59,26,8,0.1) 100%); z-index: 2; }
        .hero-texture { position: absolute; inset: 0; background-image: radial-gradient(circle, rgba(255,255,255,0.08) 1px, transparent 1px); background-size: 24px 24px; pointer-events: none; z-index: 3; }
        .hero-content { position: relative; z-index: 10; padding: 0 6%; color: var(--white); max-width: 700px; }
        .hero-content h1 { font-family: var(--font-display); font-size: clamp(3.5rem, 10vw, 7rem); line-height: 0.92; text-transform: uppercase; letter-spacing: 0.02em; text-shadow: 4px 4px 0 rgba(0,0,0,0.3); margin-bottom: 1.2rem; }
        .hero-content p { font-size: clamp(1rem, 2.2vw, 1.3rem); color: var(--yellow); margin-bottom: 2.5rem; font-weight: 600; line-height: 1.5; max-width: 480px; }
        .hero-top-nav { position: absolute; top: 0; left: 0; width: 100%; z-index: 20; display: flex; justify-content: space-between; align-items: center; padding: 1.4rem 6%; }
        .hero-top-nav .logo { color: var(--yellow); text-shadow: 2px 2px 0 var(--brown); }
        .order-btn { display: inline-flex; align-items: center; gap: 0.6rem; background: var(--yellow); color: var(--brown); border: 3px solid var(--brown); border-radius: 50px; padding: 1rem 2.4rem; font-family: var(--font-display); font-size: 1.3rem; letter-spacing: 0.06em; cursor: pointer; text-decoration: none; transition: background 200ms var(--ease-out), color 200ms var(--ease-out), transform 160ms var(--ease-out), box-shadow 200ms var(--ease-out); box-shadow: 0 6px 0 var(--brown); }
        .order-btn:hover { background: var(--white); color: var(--red); transform: translateY(-3px); box-shadow: 0 10px 0 var(--brown), 0 6px 28px rgba(245,166,35,0.5); }
        .carousel-dots-hero { position: absolute; bottom: 4.5rem; left: 6%; z-index: 20; display: flex; gap: 0.5rem; }
        .carousel-dot-hero { width: 8px; height: 8px; border-radius: 50%; background: rgba(245,237,214,0.4); border: 2px solid rgba(245,237,214,0.6); cursor: pointer; transition: background 250ms var(--ease-out), transform 250ms var(--ease-out); }
        .carousel-dot-hero.active { background: var(--yellow); border-color: var(--yellow); transform: scale(1.3); }
        .nav-button-landing { display: inline-flex; align-items: center; justify-content: center; text-decoration: none; background: var(--yellow); color: var(--brown); padding: 0 1.4rem; border-radius: 50px; border: 2.5px solid var(--brown); box-shadow: 4px 4px 0 var(--brown); font-family: var(--font-display); font-size: 0.95rem; letter-spacing: 0.06em; height: 40px; cursor: pointer; transition: background 200ms var(--ease-out), color 200ms var(--ease-out); }
        .nav-button-landing:hover { background: var(--white); color: var(--red); }
        .testimonials-section { background: var(--red); background-image: radial-gradient(circle, rgba(255,255,255,0.09) 1px, transparent 1px); background-size: 22px 22px; padding: 6rem 6%; position: relative; overflow: hidden; }
        .testimonials-section::before { content: ''; position: absolute; width: 500px; height: 500px; border-radius: 50%; background: rgba(245,166,35,0.08); top: -160px; right: -160px; pointer-events: none; }
        .testimonials-section::after { content: ''; position: absolute; width: 350px; height: 350px; border-radius: 50%; background: rgba(0,0,0,0.06); bottom: -100px; left: -100px; pointer-events: none; }
        .reviews-heading { font-family: var(--font-display); font-size: clamp(2rem, 5vw, 3.2rem); color: var(--cream); text-align: center; text-transform: uppercase; letter-spacing: 0.06em; margin-bottom: 0.5rem; position: relative; z-index: 2; }
        .reviews-heading span { color: var(--yellow); }
        .reviews-sub { text-align: center; font-weight: 600; font-size: 0.95rem; color: rgba(245,237,214,0.65); margin-bottom: 3rem; position: relative; z-index: 2; }
        .rev-track { position: relative; max-width: 760px; margin: 0 auto; min-height: 300px; display: flex; align-items: center; justify-content: center; z-index: 2; }
        .rev-card { position: absolute; width: 100%; background: rgba(245,237,214,0.11); backdrop-filter: blur(18px); -webkit-backdrop-filter: blur(18px); border: 1.5px solid rgba(245,166,35,0.4); box-shadow: inset 0 1px 0 rgba(255,255,255,0.16), 0 24px 56px rgba(59,26,8,0.28); border-radius: 28px; padding: 2.5rem 2.5rem 2rem; opacity: 0; transform: translateX(48px) scale(0.97); transition: opacity 480ms var(--ease-out), transform 480ms var(--ease-out); pointer-events: none; animation: rev-float 5s ease-in-out infinite; }
        .rev-card.active { opacity: 1; transform: translateX(0) scale(1); pointer-events: auto; }
        .rev-card.exit { opacity: 0; transform: translateX(-48px) scale(0.97); animation: none; }
        .rev-card:not(.active) { animation: none; }
        @keyframes rev-float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-9px); } }
        .rev-quote-mark { font-family: Georgia, serif; font-size: 8rem; line-height: 0; color: var(--yellow); opacity: 0.28; position: absolute; top: 2rem; left: 1.8rem; pointer-events: none; user-select: none; }
        .rev-stars { font-size: 1.25rem; color: var(--yellow); letter-spacing: 0.1em; display: block; margin-bottom: 1rem; text-shadow: 0 0 10px rgba(245,166,35,0.55); }
        .rev-text { font-style: italic; font-size: 1.05rem; font-weight: 600; color: var(--cream); line-height: 1.7; margin-bottom: 1.6rem; position: relative; z-index: 1; max-width: 58ch; }
        .rev-customer { display: flex; align-items: center; gap: 1rem; }
        .rev-avatar { width: 50px; height: 50px; border-radius: 50%; border: 2.5px solid var(--yellow); background: var(--brown); display: flex; align-items: center; justify-content: center; flex-shrink: 0; font-family: var(--font-display); font-size: 1.3rem; color: var(--yellow); box-shadow: 0 0 0 4px rgba(245,166,35,0.2); }
        .rev-name { font-family: var(--font-display); font-size: 1.05rem; color: var(--yellow); letter-spacing: 0.04em; display: block; line-height: 1.1; }
        .rev-tag { font-size: 0.78rem; font-weight: 600; color: rgba(245,237,214,0.6); display: block; margin-top: 0.2rem; }
        .rev-dots { display: flex; gap: 0.55rem; justify-content: center; margin-top: 2rem; position: relative; z-index: 2; }
        .rev-dot { width: 9px; height: 9px; border-radius: 50%; background: rgba(245,237,214,0.3); border: 2px solid rgba(245,166,35,0.35); cursor: pointer; transition: background 250ms var(--ease-out), transform 250ms var(--ease-out), border-color 250ms var(--ease-out); }
        .rev-dot.active { background: var(--yellow); border-color: var(--yellow); transform: scale(1.4); }
        .rev-progress { width: 180px; height: 3px; background: rgba(245,237,214,0.18); border-radius: 99px; margin: 0.9rem auto 0; overflow: hidden; position: relative; z-index: 2; }
        .rev-progress-bar { height: 100%; border-radius: 99px; background: var(--yellow); width: 0%; }
        @media(max-width:768px) { .hero-content h1 { font-size: clamp(3rem,12vw,5rem); } }
        @media(max-width:600px) { .testimonials-section { padding: 4rem 4%; } .rev-card { padding: 2rem 1.6rem 1.6rem; } .rev-text { font-size: 0.95rem; } }
        @media(prefers-reduced-motion:reduce) { .rev-card { animation: none !important; transition: opacity 200ms ease !important; } }
      `}</style>

      {/* HERO */}
      <section className="hero-container" id="hero">
        <div className="carousel-bg" ref={carouselRef}>
          {slides.map((src, i) => (
            <div key={i} className={`carousel-item${currentSlide === i ? ' active' : ''}`} style={{ backgroundImage: `url('${src}')` }}></div>
          ))}
        </div>
        <div className="hero-overlay"></div>
        <div className="hero-texture"></div>

        {/* Floating top nav */}
        <nav className="hero-top-nav">
          <Link to="/" className="logo">MIMALICIOUS</Link>
          <button className="nav-button-landing" onClick={() => navigate('/login')} id="landing-login-btn">Login / Sign Up</button>
        </nav>

        <div className="hero-content">
          <span className="eyebrow">Flame-Grilled Since 2026</span>
          <h1 style={{ textTransform: 'none', display: 'flex', flexDirection: 'column' }}>
            <span style={{ color: 'var(--yellow)', fontSize: '0.55em', textTransform: 'lowercase', lineHeight: 1 }}>welcome to</span>
            <span style={{ color: 'var(--white)', textTransform: 'uppercase' }}>MIMALICIOUS</span>
          </h1>
          <p>Order your favorite burger now and enjoy sizzling flavors built exactly the way you want it.</p>
          <button className="order-btn" onClick={() => navigate('/login')} id="hero-cta-btn">
            GET STARTED <i className="fa-solid fa-arrow-right"></i>
          </button>
        </div>

        <div className="carousel-dots-hero" id="carouselDots">
          {slides.map((_, i) => (
            <div key={i} className={`carousel-dot-hero${currentSlide === i ? ' active' : ''}`} onClick={() => setCurrentSlide(i)}></div>
          ))}
        </div>

        <div className="scroll-indicator" onClick={() => document.getElementById('testimonials')?.scrollIntoView({ behavior: 'smooth' })}>
          <span></span><span></span><span></span>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="testimonials-section" id="testimonials">
        <h2 className="reviews-heading">What Our <span>Hungry</span> Fams Say</h2>
        <p className="reviews-sub">Real orders. Real reactions. All sizzling.</p>
        <div className="rev-track" aria-live="polite" aria-atomic="true">
          {REVIEWS.map((r, i) => (
            <article key={i} className={`rev-card${revAnim[i] === 'active' ? ' active' : revAnim[i] === 'exit' ? ' exit' : ''}`} aria-label={`Review from ${r.name}`}>
              <span className="rev-quote-mark" aria-hidden="true">&ldquo;</span>
              <span className="rev-stars" aria-label="5 out of 5 stars">★★★★★</span>
              <p className="rev-text">{r.quote}</p>
              <div className="rev-customer">
                <div className="rev-avatar" aria-hidden="true">{r.initial}</div>
                <div>
                  <span className="rev-name">{r.name}</span>
                  <span className="rev-tag">{r.tag}</span>
                </div>
              </div>
            </article>
          ))}
        </div>
        <div className="rev-dots" role="tablist" aria-label="Review navigation">
          {REVIEWS.map((_, i) => (
            <button key={i} className={`rev-dot${revCurrent === i ? ' active' : ''}`} role="tab" aria-selected={revCurrent === i} aria-label={`Review ${i + 1}`} onClick={() => goTo(i)} />
          ))}
        </div>
        <div className="rev-progress" aria-hidden="true">
          <div className="rev-progress-bar" ref={progressRef}></div>
        </div>
      </section>

      <Footer />
    </>
  );
}
