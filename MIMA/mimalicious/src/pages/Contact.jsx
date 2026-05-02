import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function Contact() {
  const [status, setStatus] = useState('');

  useEffect(() => {
    const obs = new IntersectionObserver(entries => entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('animate-in'); obs.unobserve(e.target); }
    }), { threshold: 0.12 });
    document.querySelectorAll('.reveal, .reveal-stagger').forEach(el => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setStatus('sending');
    const form = e.target;
    const data = new FormData(form);
    
    try {
      const response = await fetch(form.action, {
        method: form.method,
        body: data,
        headers: { 'Accept': 'application/json' }
      });
      if (response.ok) {
        setStatus('success');
        form.reset();
        setTimeout(() => setStatus(''), 5000);
      } else {
        setStatus('error');
      }
    } catch (error) {
      setStatus('error');
    }
  };

  return (
    <>
      <style>{`
        body { padding-top: 0; }
        .contact-section { padding: 9rem 6% 4rem; min-height: 80dvh; display: flex; align-items: center; justify-content: center; background: var(--red); background-image: radial-gradient(circle, rgba(0,0,0,0.16) 1px, transparent 1px); background-size: 26px 26px; }
        .contact-container { background: var(--white); width: 100%; max-width: 1100px; border-radius: 32px; display: flex; overflow: hidden; flex-wrap: wrap; border: 4px solid var(--brown); box-shadow: 12px 12px 0 var(--yellow); }
        .contact-info { flex: 1; min-width: 300px; background: var(--yellow); padding: 3.5rem; position: relative; border-right: 4px dashed var(--red); }
        .contact-info h2 { font-family: var(--font-display); font-size: clamp(2.5rem,5vw,3.5rem); margin-bottom: 0.8rem; color: var(--brown); text-transform: uppercase; line-height: 0.92; }
        .contact-info > p { font-size: 1.1rem; font-weight: 700; line-height: 1.4; margin-bottom: 2.5rem; color: var(--red); }
        .info-item { margin-bottom: 1.8rem; padding-bottom: 1rem; border-bottom: 2px solid rgba(0,0,0,0.07); }
        .info-item:last-child { border: none; margin-bottom: 0; }
        .info-label { font-family: var(--font-display); color: var(--brown); font-size: 1.1rem; text-transform: uppercase; letter-spacing: 0.06em; margin-bottom: 0.4rem; display: block; }
        .info-value { background: var(--brown); color: var(--cream); display: inline-block; padding: 0.4rem 1rem; border-radius: 8px; text-decoration: none; font-size: 1rem; font-weight: 700; margin-top: 0.3rem; transition: background 200ms var(--ease-out); }
        .info-value:hover { background: var(--red); }
        .contact-form-side { flex: 1.5; min-width: 320px; padding: 3.5rem; background: var(--white); }
        .contact-form-side h3 { font-family: var(--font-display); font-size: 2.2rem; color: var(--red); margin-bottom: 2rem; text-transform: uppercase; text-align: center; letter-spacing: 0.04em; }
        .submit-btn { background: var(--red); color: var(--white); border: 3px solid var(--brown); padding: 1.2rem; font-size: 1.4rem; border-radius: 50px; cursor: pointer; width: 100%; margin-top: 1rem; font-family: var(--font-display); letter-spacing: 0.06em; transition: background 200ms var(--ease-out), color 200ms var(--ease-out), transform 160ms var(--ease-out), box-shadow 200ms var(--ease-out); box-shadow: 0 5px 0 var(--red-deep); }
        .submit-btn:hover { background: var(--yellow); color: var(--brown); transform: translateY(-2px); box-shadow: 0 8px 0 var(--yellow-deep), 0 4px 20px rgba(245,166,35,0.4); }
        .submit-btn:active { transform: scale(0.97); box-shadow: 0 2px 0 var(--red-deep); }
        .success-msg { background: #e8f7ed; border: 2px solid #2d8c4e; border-radius: 12px; padding: 1rem; font-weight: 700; color: #154d1d; margin-top: 1rem; text-align: center; }
        @media(max-width:768px) { .contact-info { border-right: none; border-bottom: 4px dashed var(--red); } }
      `}</style>

      <Navbar />

      <section className="contact-section">
        <div className="contact-container reveal">
          <div className="contact-info">
            <h2>Talk to<br />Mima</h2>
            <p>Whether it's feedback or a giant party order, we're ready to flip it!</p>
            <div className="info-item">
              <span className="info-label"><i className="fa-solid fa-location-dot" style={{ color: 'var(--red)', marginRight: '6px' }}></i>Find the Grill</span>
              <div className="info-value">123 Burger Lane, Food City</div>
            </div>
            <div className="info-item">
              <span className="info-label"><i className="fa-solid fa-phone" style={{ color: 'var(--red)', marginRight: '6px' }}></i>Hot Line</span>
              <a href="tel:85333333" className="info-value">8-533-3333</a>
            </div>
            <div className="info-item">
              <span className="info-label"><i className="fa-solid fa-envelope" style={{ color: 'var(--red)', marginRight: '6px' }}></i>Burger Mail</span>
              <a href="mailto:service@mima.com.ph" className="info-value">service@mima.com.ph</a>
            </div>
          </div>

          <div className="contact-form-side">
            <h3>Drop a Message</h3>
            <form action="https://formspree.io/f/xwvngydg" method="POST" onSubmit={handleFormSubmit}>
              <div className="form-group">
                <label>Your Name</label>
                <input type="text" name="name" placeholder="Hungry Customer #1" required />
              </div>
              <div className="form-group">
                <label>Email Address</label>
                <input type="email" name="email" placeholder="Mimalicious@email.com" required />
              </div>
              <div className="form-group">
                <label>Special Requests / Feedback</label>
                <textarea name="message" placeholder="Tell us what's on your mind..." style={{ minHeight: '120px' }} required></textarea>
              </div>
              <button className="submit-btn" type="submit" id="contact-send-btn" disabled={status === 'sending'}>
                {status === 'sending' ? 'SENDING...' : <>SEND IT <i className="fa-solid fa-paper-plane"></i></>}
              </button>
              
              {status === 'success' && <div className="success-msg">Message received! We'll get back to you soon. 🍔</div>}
              {status === 'error' && <div className="success-msg" style={{background: '#fde8e8', color: '#c0392b', borderColor: '#c0392b'}}>Oops! Something went wrong. Try again.</div>}
            </form>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
