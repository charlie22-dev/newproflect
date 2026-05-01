import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

const EYE_SVG = `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>`;
const EYEOFF_SVG = `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>`;

const REVIEWS = [
  { initial: 'M', quote: '"Grabe yung Big Mima, kaya na nyang pumalit sa aking ex! Hindi ako nag-regret kahit isang segundo. Solid ang lasa, bes!"', name: 'Marvie Santos', tag: 'Verified Burger Addict • Quezon City' },
  { initial: 'K', quote: '"Yung Mima Cheesy Overload? Bro, four layers ng cheese. FOUR. I called my mom after just to tell her I\'m okay. Sobrang sarap!"', name: 'Karlo Reyes', tag: 'Regular Customer • Makati' },
  { initial: 'L', quote: '"Pina-order ko \'tong Mima BBQ Blast sa first date ko. Third date na kami ngayon, and he said \'the burger sealed the deal.\' I\'m not sure if he means me or the food."', name: 'Lovely Dela Cruz', tag: 'Suki ng Mimalicious • Pasig' },
  { initial: 'A', quote: '"Tinry ko yung Mima Fire Crunch isang beses. Isang beses lang — kasi every day na ako nag-uuwi ng lima. Doc said my blood type is now BBQ. Worth it."', name: 'Andro Bautista', tag: 'Power Customer • Mandaluyong' },
];

const AUTOPLAY_MS = 4000;
const TRANSITION_MS = 500;

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState('login');
  const [showForgotSuccess, setShowForgotSuccess] = useState(false);
  const [pwVisible, setPwVisible] = useState({ login: false, signup: false, confirm: false });
  const [signupError, setSignupError] = useState('');
  const [current, setCurrent] = useState(0);
  const [animState, setAnimState] = useState([]); // 'active' | 'exit' | ''
  const isAnimating = useRef(false);
  const timerRef = useRef(null);
  const progressRef = useRef(null);
  const trackRef = useRef(null);

  // Redirect if already logged in
  useEffect(() => {
    if (localStorage.getItem('loggedIn') === 'true') {
      const params = new URLSearchParams(location.search);
      navigate(params.get('to') || '/home', { replace: true });
    }
  }, [navigate, location.search]);

  // Init animState
  useEffect(() => {
    setAnimState(REVIEWS.map((_, i) => i === 0 ? 'active' : ''));
  }, []);

  const goTo = (index) => {
    if (isAnimating.current || index === current) return;
    isAnimating.current = true;
    const prevIdx = current;
    setCurrent(index);
    setAnimState(arr => {
      const next = [...arr];
      next[prevIdx] = 'exit';
      next[index] = 'active';
      return next;
    });
    setTimeout(() => {
      setAnimState(arr => {
        const next = [...arr];
        next[prevIdx] = '';
        return next;
      });
      isAnimating.current = false;
    }, TRANSITION_MS);
    resetProgress();
  };

  const resetProgress = () => {
    const bar = progressRef.current;
    if (!bar) return;
    bar.style.transition = 'none';
    bar.style.width = '0%';
    void bar.offsetWidth;
    bar.style.transition = `width ${AUTOPLAY_MS}ms linear`;
    bar.style.width = '100%';
  };

  const startAutoplay = () => {
    timerRef.current = setInterval(() => {
      setCurrent(prev => {
        const next = (prev + 1) % REVIEWS.length;
        if (!isAnimating.current) goTo(next);
        return prev;
      });
    }, AUTOPLAY_MS);
  };

  const stopAutoplay = () => {
    clearInterval(timerRef.current);
  };

  useEffect(() => {
    resetProgress();
    startAutoplay();
    return () => stopAutoplay();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [current]);

  const handleLogin = (e) => {
    e.preventDefault();
    const email = e.target['l-email'].value;
    const pw = e.target['l-password'].value;

    // Admin Access check
    if (pw === 'admin2026' || email === 'admin@mimalicious.com') {
      if (pw === 'admin2026') {
        localStorage.setItem('mimaAdminLoggedIn', 'true');
        localStorage.setItem('loggedIn', 'true');
        navigate('/admin');
        return;
      }
    }

    localStorage.setItem('loggedIn', 'true');
    const params = new URLSearchParams(location.search);
    navigate(params.get('to') || '/home');
  };

  const handleSignup = (e) => {
    e.preventDefault();
    const pw = e.target['s-password'].value;
    const cf = e.target['s-confirm'].value;
    if (pw !== cf) { setSignupError('Passwords do not match.'); return; }
    setSignupError('');
    localStorage.setItem('loggedIn', 'true');
    navigate('/home');
  };

  const handleForgot = (e) => {
    e.preventDefault();
    setShowForgotSuccess(true);
  };

  return (
    <>
      <style>{`
        body { padding-top: 0; display: flex; flex-direction: column; min-height: 100dvh; margin: 0; font-family: 'Poppins', var(--font-body); }
        .login-wrap { display: grid; grid-template-columns: 1fr 1fr; flex: 1; min-height: 100dvh; }
        .login-form-side { background: var(--cream); display: flex; align-items: center; justify-content: center; padding: 4rem 3rem; position: relative; background-image: radial-gradient(circle, rgba(59, 26, 8, 0.05) 1px, transparent 1px); background-size: 20px 20px; }
        .auth-card { width: 100%; max-width: 420px; background: var(--white); border-radius: 28px; padding: 3rem 2.5rem; border: 4px solid var(--yellow); box-shadow: 8px 8px 0 var(--brown), 0 30px 60px rgba(59, 26, 8, 0.1); animation: card-enter 400ms var(--ease-out) both; }
        @keyframes card-enter { from { opacity: 0; transform: translateY(20px) scale(0.97); } to { opacity: 1; transform: translateY(0) scale(1); } }
        .form-brand-mark { display: flex; align-items: center; gap: 0.6rem; margin-bottom: 2rem; }
        .form-brand-mark .logo-small { font-family: var(--font-display); font-size: 1.5rem; color: var(--red); letter-spacing: 0.04em; text-decoration: none; line-height: 1; }
        .form-brand-mark .badge-pill { background: var(--yellow); color: var(--brown); font-family: var(--font-display); font-size: 0.72rem; letter-spacing: 0.06em; border-radius: 50px; padding: 0.25rem 0.75rem; border: 2px solid var(--brown); }
        .auth-card h2 { font-family: var(--font-display); font-size: 2.2rem; color: var(--red); margin-bottom: 0.3rem; letter-spacing: 0.04em; line-height: 1; }
        .auth-card > p { font-weight: 600; color: var(--brown-mid); font-size: 0.92rem; margin-bottom: 2rem; }
        .form-group label { font-family: 'Poppins', sans-serif; font-weight: 700; font-size: 0.78rem; }
        .form-group input { font-family: 'Poppins', sans-serif; font-size: 0.95rem; }
        .submit-btn { width: 100%; padding: 1rem; border-radius: 50px; border: 3px solid var(--brown); background: var(--red); color: var(--white); font-family: var(--font-display); font-size: 1.2rem; letter-spacing: 0.06em; cursor: pointer; margin-top: 0.8rem; transition: background 200ms var(--ease-out), color 200ms var(--ease-out), transform 160ms var(--ease-out), box-shadow 200ms var(--ease-out); box-shadow: 0 5px 0 var(--red-deep); }
        .submit-btn:hover { background: var(--yellow); color: var(--brown); transform: translateY(-2px); box-shadow: 0 8px 0 var(--yellow-deep), 0 4px 20px rgba(245, 166, 35, 0.4); }
        .submit-btn:active { transform: scale(0.97); box-shadow: 0 2px 0 var(--red-deep); }
        .back-link { display: block; text-align: center; margin-top: 1.5rem; color: var(--brown-mid); font-weight: 700; font-size: 0.88rem; text-decoration: none; transition: color 200ms var(--ease-out); }
        .back-link:hover { color: var(--red); }
        .reviews-panel { background: var(--red); background-image: radial-gradient(circle, rgba(255, 255, 255, 0.10) 1px, transparent 1px); background-size: 22px 22px; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 4rem 3rem; position: relative; overflow: hidden; }
        .reviews-panel::before { content: ''; position: absolute; width: 400px; height: 400px; border-radius: 50%; background: rgba(245, 166, 35, 0.10); top: -120px; right: -120px; pointer-events: none; }
        .reviews-panel::after { content: ''; position: absolute; width: 300px; height: 300px; border-radius: 50%; background: rgba(0, 0, 0, 0.07); bottom: -80px; left: -80px; pointer-events: none; }
        .reviews-heading { font-family: var(--font-display); font-size: clamp(1.6rem, 3vw, 2.4rem); color: var(--cream); letter-spacing: 0.06em; text-align: center; margin-bottom: 2rem; text-transform: uppercase; position: relative; z-index: 2; }
        .reviews-heading span { color: var(--yellow); }
        .carousel-track { position: relative; width: 100%; max-width: 460px; z-index: 2; min-height: 280px; display: flex; align-items: center; justify-content: center; }
        .review-card { position: absolute; width: 100%; background: rgba(245, 237, 214, 0.13); backdrop-filter: blur(16px); -webkit-backdrop-filter: blur(16px); border: 1.5px solid rgba(245, 166, 35, 0.45); box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.18), 0 20px 50px rgba(59, 26, 8, 0.25), 0 4px 16px rgba(0, 0, 0, 0.12); border-radius: 24px; padding: 2.2rem 2rem 1.8rem; text-align: left; animation: card-float 4s ease-in-out infinite; opacity: 0; transform: translateX(40px) scale(0.97); transition: opacity 500ms var(--ease-out), transform 500ms var(--ease-out); pointer-events: none; }
        .review-card.active { opacity: 1; transform: translateX(0) scale(1); pointer-events: auto; }
        .review-card.exit { opacity: 0; transform: translateX(-40px) scale(0.97); }
        @keyframes card-float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-7px); } }
        .review-card.exit, .review-card:not(.active) { animation: none; }
        .quote-mark { font-family: Georgia, serif; font-size: 7rem; color: var(--yellow); opacity: 0.35; line-height: 0; position: absolute; top: 1.6rem; left: 1.4rem; pointer-events: none; user-select: none; }
        .review-stars { font-size: 1.2rem; color: var(--yellow); letter-spacing: 0.1em; margin-bottom: 0.9rem; display: block; text-shadow: 0 0 8px rgba(245, 166, 35, 0.6); }
        .review-quote { font-family: 'Poppins', sans-serif; font-style: italic; font-size: 0.97rem; font-weight: 600; color: var(--cream); line-height: 1.65; margin-bottom: 1.4rem; position: relative; z-index: 1; max-width: 52ch; }
        .review-customer { display: flex; align-items: center; gap: 0.85rem; }
        .avatar { width: 46px; height: 46px; border-radius: 50%; border: 2.5px solid var(--yellow); background: var(--brown); display: flex; align-items: center; justify-content: center; flex-shrink: 0; font-family: var(--font-display); font-size: 1.2rem; color: var(--yellow); letter-spacing: 0; box-shadow: 0 0 0 3px rgba(245, 166, 35, 0.25); }
        .customer-name { font-family: var(--font-display); font-size: 1rem; color: var(--yellow); letter-spacing: 0.04em; display: block; line-height: 1.1; }
        .customer-tag { font-family: 'Poppins', sans-serif; font-size: 0.75rem; font-weight: 600; color: rgba(245, 237, 214, 0.65); display: block; margin-top: 0.15rem; }
        .carousel-dots { display: flex; gap: 0.5rem; margin-top: 1.8rem; justify-content: center; position: relative; z-index: 2; }
        .dot { width: 8px; height: 8px; border-radius: 50%; background: rgba(245, 237, 214, 0.35); border: 2px solid rgba(245, 166, 35, 0.4); cursor: pointer; transition: background 250ms var(--ease-out), transform 250ms var(--ease-out), border-color 250ms var(--ease-out); }
        .dot.active { background: var(--yellow); border-color: var(--yellow); transform: scale(1.35); }
        .carousel-progress { width: 100%; max-width: 200px; height: 3px; background: rgba(245, 237, 214, 0.2); border-radius: 99px; margin-top: 0.8rem; overflow: hidden; position: relative; z-index: 2; }
        .carousel-progress-bar { height: 100%; background: var(--yellow); border-radius: 99px; width: 0%; transition: width 0ms linear; }
        .auth-tabs { display: flex; background: var(--cream); border: 2.5px solid var(--brown); border-radius: 50px; padding: 4px; margin-bottom: 1.8rem; gap: 4px; }
        .auth-tab { flex: 1; height: 36px; border: none; border-radius: 50px; font-family: var(--font-display); font-size: 0.92rem; letter-spacing: 0.05em; cursor: pointer; background: transparent; color: var(--brown-mid); transition: background 200ms var(--ease-out), color 200ms var(--ease-out), box-shadow 200ms var(--ease-out); }
        .auth-tab.active { background: var(--red); color: var(--white); box-shadow: 2px 2px 0 var(--brown); }
        .auth-panel { display: none; }
        .auth-panel.active { display: block; animation: panel-in 220ms var(--ease-out) both; }
        @keyframes panel-in { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
        .pw-wrap { position: relative; }
        .pw-wrap input { padding-right: 3rem; }
        .pw-toggle { position: absolute; right: 0.75rem; top: 50%; transform: translateY(-50%); width: 32px; height: 32px; display: flex; align-items: center; justify-content: center; background: none; border: none; cursor: pointer; color: var(--brown-mid); border-radius: 8px; transition: color 160ms var(--ease-out), background 160ms var(--ease-out); }
        .pw-toggle:hover { color: var(--brown); background: rgba(59,26,8,0.06); }
        .forgot-link-wrap { text-align: right; margin-top: -0.7rem; margin-bottom: 1.2rem; }
        .forgot-link { background: none; border: none; cursor: pointer; font-size: 0.82rem; font-weight: 700; color: var(--brown-mid); transition: color 160ms var(--ease-out); padding: 0; }
        .forgot-link:hover { color: var(--red); }
        .inline-err { font-size: 0.75rem; color: var(--red); font-weight: 700; display: block; margin-top: 0.3rem; min-height: 1rem; }
        .forgot-success-box { background: #e8f7ed; border: 2px solid #2d8c4e; border-radius: 12px; padding: 1rem; text-align: center; font-weight: 700; color: #154d1d; font-size: 0.9rem; margin-bottom: 1rem; }
        .forgot-back { background:none; border:none; cursor:pointer; font-size:0.85rem; font-weight:700; color:var(--brown-mid); margin-top:0.5rem; display:block; text-align:center; transition:color 160ms var(--ease-out); }
        .forgot-back:hover { color:var(--red); }
        @media (max-width: 900px) { .login-wrap { grid-template-columns: 1fr; } .reviews-panel { min-height: 420px; } }
        @media (max-width: 600px) { .login-form-side { padding: 2.5rem 1.5rem; } .auth-card { padding: 2rem 1.5rem; } .reviews-panel { padding: 3rem 1.5rem; } .review-card { padding: 1.8rem 1.5rem 1.4rem; } }
        @media (prefers-reduced-motion: reduce) { .review-card { animation: none !important; transition: opacity 200ms ease !important; } .auth-card { animation: none !important; } }
      `}</style>

      <div className="login-wrap">
        {/* LEFT — Login Form */}
        <div className="login-form-side">
          <div className="auth-card">
            <div className="form-brand-mark">
              <Link to="/" className="logo-small">MIMALICIOUS</Link>
              <span className="badge-pill">EST. 2026</span>
            </div>

            {/* Tab switcher */}
            <div className="auth-tabs" role="tablist">
              <button className={`auth-tab${activeTab === 'login' ? ' active' : ''}`} role="tab" aria-selected={activeTab === 'login'} onClick={() => setActiveTab('login')}>LOGIN</button>
              <button className={`auth-tab${activeTab === 'signup' ? ' active' : ''}`} role="tab" aria-selected={activeTab === 'signup'} onClick={() => setActiveTab('signup')}>SIGN UP</button>
            </div>

            {/* LOGIN PANEL */}
            <div className={`auth-panel${activeTab === 'login' ? ' active' : ''}`} role="tabpanel">
              <h2>Welcome Back!</h2>
              <p>Sign in to start your order</p>
              <form onSubmit={handleLogin}>
                <div className="form-group">
                  <label htmlFor="l-email">Email Address</label>
                  <input id="l-email" type="email" placeholder="you@example.com" required autoComplete="email" />
                </div>
                <div className="form-group">
                  <label htmlFor="l-password">Password</label>
                  <div className="pw-wrap">
                    <input id="l-password" type={pwVisible.login ? 'text' : 'password'} placeholder="••••••••" required autoComplete="current-password" />
                    <button type="button" className="pw-toggle" onClick={() => setPwVisible(v => ({ ...v, login: !v.login }))} aria-label={pwVisible.login ? 'Hide password' : 'Show password'} dangerouslySetInnerHTML={{ __html: pwVisible.login ? EYEOFF_SVG : EYE_SVG }} />
                  </div>
                </div>
                <div className="forgot-link-wrap">
                  <button type="button" className="forgot-link" onClick={() => setActiveTab('forgot')}>Forgot Password?</button>
                </div>
                <button type="submit" className="submit-btn" id="login-submit-btn">LOGIN</button>
              </form>
            </div>

            {/* SIGN UP PANEL */}
            <div className={`auth-panel${activeTab === 'signup' ? ' active' : ''}`} role="tabpanel">
              <h2>Join Mimalicious!</h2>
              <p>Create your account and start ordering</p>
              <form onSubmit={handleSignup}>
                <div className="form-group">
                  <label htmlFor="s-name">Full Name</label>
                  <input id="s-name" name="s-name" type="text" placeholder="Juan dela Cruz" required autoComplete="name" />
                </div>
                <div className="form-group">
                  <label htmlFor="s-email">Email Address</label>
                  <input id="s-email" name="s-email" type="email" placeholder="you@example.com" required autoComplete="email" />
                </div>
                <div className="form-group">
                  <label htmlFor="s-password">Password</label>
                  <div className="pw-wrap">
                    <input id="s-password" name="s-password" type={pwVisible.signup ? 'text' : 'password'} placeholder="••••••••" required autoComplete="new-password" />
                    <button type="button" className="pw-toggle" onClick={() => setPwVisible(v => ({ ...v, signup: !v.signup }))} aria-label="Toggle password" dangerouslySetInnerHTML={{ __html: pwVisible.signup ? EYEOFF_SVG : EYE_SVG }} />
                  </div>
                </div>
                <div className="form-group">
                  <label htmlFor="s-confirm">Confirm Password</label>
                  <div className="pw-wrap">
                    <input id="s-confirm" name="s-confirm" type={pwVisible.confirm ? 'text' : 'password'} placeholder="••••••••" required autoComplete="new-password" />
                    <button type="button" className="pw-toggle" onClick={() => setPwVisible(v => ({ ...v, confirm: !v.confirm }))} aria-label="Toggle confirm password" dangerouslySetInnerHTML={{ __html: pwVisible.confirm ? EYEOFF_SVG : EYE_SVG }} />
                  </div>
                  <span className="inline-err">{signupError}</span>
                </div>
                <button type="submit" className="submit-btn">CREATE ACCOUNT</button>
              </form>
            </div>

            {/* FORGOT PASSWORD PANEL */}
            <div className={`auth-panel${activeTab === 'forgot' ? ' active' : ''}`} role="tabpanel">
              <h2>Reset Password</h2>
              <p>Enter your email and we'll send a reset link.</p>
              {showForgotSuccess && <div className="forgot-success-box">Check your inbox! If that email is registered, you'll receive a reset link shortly.</div>}
              {!showForgotSuccess && (
                <form onSubmit={handleForgot}>
                  <div className="form-group">
                    <label htmlFor="f-email">Email Address</label>
                    <input id="f-email" type="email" placeholder="you@example.com" required autoComplete="email" />
                  </div>
                  <button type="submit" className="submit-btn">SEND RESET LINK</button>
                </form>
              )}
              <button type="button" className="forgot-back" onClick={() => { setActiveTab('login'); setShowForgotSuccess(false); }}>← Back to Login</button>
            </div>

            <Link to="/" className="back-link">← Back to Landing</Link>
          </div>
        </div>

        {/* RIGHT — Testimonials */}
        <div className="reviews-panel">
          <p className="reviews-heading">What Our <span>Hungry</span> Fams Say</p>
          <div className="carousel-track" id="carouselTrack" aria-live="polite" aria-atomic="true"
            ref={trackRef}
            onMouseEnter={stopAutoplay}
            onMouseLeave={() => { startAutoplay(); resetProgress(); }}>
            {REVIEWS.map((r, i) => (
              <article key={i} className={`review-card${animState[i] === 'active' ? ' active' : animState[i] === 'exit' ? ' exit' : ''}`} aria-label={`Review from ${r.name}`}>
                <span className="quote-mark" aria-hidden="true">&ldquo;</span>
                <span className="review-stars" aria-label="5 out of 5 stars">★★★★★</span>
                <p className="review-quote">{r.quote}</p>
                <div className="review-customer">
                  <div className="avatar" aria-hidden="true">{r.initial}</div>
                  <div>
                    <span className="customer-name">{r.name}</span>
                    <span className="customer-tag">{r.tag}</span>
                  </div>
                </div>
              </article>
            ))}
          </div>
          <div className="carousel-dots" role="tablist" aria-label="Review navigation">
            {REVIEWS.map((_, i) => (
              <button key={i} className={`dot${current === i ? ' active' : ''}`} role="tab" aria-selected={current === i} aria-label={`Review ${i + 1}`} onClick={() => goTo(i)} />
            ))}
          </div>
          <div className="carousel-progress" aria-hidden="true">
            <div className="carousel-progress-bar" ref={progressRef}></div>
          </div>
        </div>
      </div>
    </>
  );
}
