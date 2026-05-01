import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function About() {
  const navigate = useNavigate();

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
        .about-hero { background: var(--red); background-image: radial-gradient(circle, rgba(0,0,0,0.18) 1px, transparent 1px); background-size: 26px 26px; padding: 11rem 6% 9rem; text-align: center; color: var(--white); clip-path: ellipse(150% 100% at 50% 0%); position: relative; overflow: hidden; }
        .about-hero h2 { font-family: var(--font-display); font-size: clamp(3rem,8vw,5.5rem); text-transform: uppercase; text-shadow: 5px 5px 0 var(--brown); line-height: 0.92; color: var(--white); }
        .about-section { padding: 0 6% 4rem; }
        .about-container { max-width: 900px; width: 100%; margin: -5rem auto 0; position: relative; z-index: 5; }
        .intro-text { background: var(--white); padding: 2.5rem; border-radius: 24px; border: 4px solid var(--brown); box-shadow: 10px 10px 0 var(--yellow); margin-bottom: 3rem; text-align: center; }
        .intro-text p { font-size: 1.2rem; font-weight: 600; line-height: 1.7; color: var(--brown); }
        .mima-manifesto { background: var(--brown); color: var(--white); padding: 2.5rem; border-radius: 24px; margin-bottom: 3rem; border: 4px solid var(--yellow); }
        .manifesto-title { font-family: var(--font-display); color: var(--yellow); font-size: 2.2rem; margin-bottom: 0.8rem; text-transform: uppercase; letter-spacing: 0.04em; }
        .mima-manifesto > p { font-weight: 600; color: rgba(245,237,214,0.85); margin-bottom: 1rem; }
        .mima-manifesto ul { list-style: none; }
        .mima-manifesto li { margin-bottom: 0.9rem; font-weight: 600; font-size: 1rem; display: flex; gap: 10px; align-items: flex-start; color: var(--cream); line-height: 1.5; }
        .mima-manifesto li::before { content: "✓"; color: var(--yellow); font-weight: 900; flex-shrink: 0; margin-top: 2px; }
        .feature-grid { display: flex; flex-direction: column; gap: 1.5rem; width: 100%; }
        .feature-card { background: var(--white); padding: 2rem; border-radius: 22px; border: 4px solid var(--brown); box-shadow: 7px 7px 0 var(--red); display: flex; align-items: center; gap: 2rem; transition: transform 250ms var(--ease-out), box-shadow 250ms var(--ease-out); }
        .feature-card:hover { transform: scale(1.02) rotate(0.5deg); box-shadow: 10px 10px 0 var(--red); }
        .feature-icon { font-size: 2.8rem; background: var(--cream); width: 80px; height: 80px; display: flex; align-items: center; justify-content: center; border-radius: 18px; border: 3px solid var(--brown); flex-shrink: 0; }
        .feature-card h3 { font-family: var(--font-display); color: var(--red); font-size: 1.6rem; margin-bottom: 0.4rem; text-transform: uppercase; letter-spacing: 0.03em; }
        .feature-card p { font-size: 1rem; font-weight: 600; color: var(--brown); line-height: 1.5; }
        .fun-stats { display: grid; grid-template-columns: repeat(3,1fr); gap: 1rem; margin: 3rem 0; }
        .stat-box { background: var(--yellow); border: 3.5px solid var(--brown); padding: 1.5rem; border-radius: 18px; box-shadow: 5px 5px 0 var(--brown); text-align: center; }
        .stat-box h4 { font-family: var(--font-display); font-size: 2.2rem; color: var(--red); }
        .stat-box span { font-weight: 800; font-size: 0.78rem; text-transform: uppercase; color: var(--brown); letter-spacing: 0.06em; }
        .about-image-wrapper { width: 100%; border-radius: 28px; overflow: hidden; margin-top: 2rem; border: 7px solid var(--white); box-shadow: 0 20px 40px rgba(59,26,8,0.15); }
        .about-image-wrapper img { width: 100%; height: 420px; object-fit: cover; display: block; }
        .team-section { background: var(--cream); padding: 5rem 6%; text-align: center; }
        .team-title { font-family: var(--font-display); color: var(--red); font-size: clamp(2.5rem, 6vw, 3.5rem); margin-bottom: 3rem; text-transform: uppercase; text-shadow: 4px 4px 0 var(--brown); }
        .team-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 1.8rem; max-width: 1200px; margin: 0 auto; }
        .team-card { background: var(--white); border: 4px solid var(--brown); box-shadow: 8px 8px 0 var(--red); border-radius: 20px; padding: 2.5rem 1.5rem; text-align: center; transition: transform 250ms var(--ease-out), box-shadow 250ms var(--ease-out); }
        .team-card:hover { transform: scale(1.02) rotate(-1deg); box-shadow: 12px 12px 0 var(--red); }
        .team-avatar-wrapper { margin: 0 auto 1.5rem; width: 100px; height: 100px; border-radius: 50%; position: relative; background: var(--white); border: 4px solid var(--brown); }
        .team-avatar-wrapper img { width: 100%; height: 100%; object-fit: cover; border-radius: 50%; }
        .avatar-blue { box-shadow: 6px 6px 0 var(--red); }
        .avatar-green { box-shadow: 6px 6px 0 var(--yellow); }
        .avatar-red { box-shadow: 6px 6px 0 var(--red-deep); }
        .avatar-purple { box-shadow: 6px 6px 0 var(--brown); }
        .team-name { font-family: var(--font-display); color: var(--red); font-size: 1.5rem; margin-bottom: 0.5rem; text-transform: uppercase; letter-spacing: 0.03em; line-height: 1.1; }
        .team-role { color: var(--brown); font-size: 0.8rem; font-weight: 800; text-transform: uppercase; letter-spacing: 0.05em; line-height: 1.4; margin-bottom: 1.5rem; }
        .team-social { display: flex; gap: 10px; justify-content: center; }
        .team-social a { width: 38px; height: 38px; border-radius: 50%; background: var(--yellow); color: var(--brown); border: 3px solid var(--brown); display: flex; align-items: center; justify-content: center; text-decoration: none; transition: all 200ms ease; box-shadow: 3px 3px 0 var(--brown); }
        .team-social a:hover { transform: translateY(-3px); box-shadow: 5px 5px 0 var(--brown); background: var(--red); color: var(--white); }
        @media(max-width:768px) { .fun-stats { grid-template-columns: 1fr; } .feature-card { flex-direction: column; text-align: center; } }
      `}</style>

      <Navbar />

      <section className="about-hero">
        <span className="eyebrow">The Mimalicious Manifesto</span>
        <h2>More Than<br />Just Meat</h2>
        <div className="scroll-indicator" style={{ position: 'relative', bottom: 'auto', left: 'auto', transform: 'none', marginTop: '2rem', display: 'inline-flex' }}
          onClick={() => document.querySelector('.about-section')?.scrollIntoView({ behavior: 'smooth' })}>
          <span></span><span></span><span></span>
        </div>
      </section>

      <section className="about-section">
        <div className="about-container">
          <div className="intro-text reveal">
            <p>Mimalicious isn't just a burger joint — it's a revolution against boring food. We started with a simple question: <b>"Why settle for a burger that looks like it gave up on life?"</b> We're here to give your tastebuds a wake-up call with sizzle, spice, and stacks that defy gravity.</p>
          </div>

          <div className="mima-manifesto reveal">
            <h3 className="manifesto-title">The Mima Commandments</h3>
            <p>We live by a strict code of burger-conduct to ensure every bite is legendary:</p>
            <ul>
              <li><b>The Golden Ratio:</b> Every patty must be juice-to-bun perfect. No dry bites allowed.</li>
              <li><b>Fresh Over Frozen:</b> If it's been in a freezer longer than a polar bear, we don't serve it.</li>
              <li><b>The Cheese Rule:</b> If it doesn't stretch, it's not doing its job.</li>
              <li><b>Zero Regrets:</b> Eat it like you mean it. We don't do small portions here.</li>
            </ul>
          </div>

          <div className="feature-grid reveal-stagger">
            <div className="feature-card">
              <div className="feature-icon">🍔</div>
              <div>
                <h3>No Assembly Lines</h3>
                <p>We don't do pre-made heat-lamps. Every Mimalicious masterpiece is built the moment you hit "Order." We cook for people, not for statistics.</p>
              </div>
            </div>
            <div className="feature-card">
              <div className="feature-icon">👑</div>
              <div>
                <h3>The Community Crown</h3>
                <p>Mimalicious was born in a neighborhood kitchen, and we haven't forgotten our roots. We're local, we're loud, and we're proud to be your go-to spot.</p>
              </div>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🧪</div>
              <div>
                <h3>The Flavor Lab</h3>
                <p>Our Secret Sauce was perfected through 4,000 "tasting sessions." Yes, we ate a lot of burgers for "science." You're welcome.</p>
              </div>
            </div>
          </div>

          <div className="fun-stats reveal-stagger">
            <div className="stat-box"><h4>100%</h4><span>Anger Management (Via Burgers)</span></div>
            <div className="stat-box"><h4>0</h4><span>Empty Stomachs Allowed</span></div>
            <div className="stat-box"><h4>∞</h4><span>Levels of Cheesiness</span></div>
          </div>

          <div className="about-image-wrapper reveal">
            <img src="/images/landing.jpg" alt="The Mimalicious Grill" />
          </div>
        </div>
      </section>

      <section className="team-section">
        <h2 className="team-title reveal">Meet The Team</h2>
        <div className="team-grid reveal-stagger">
          {[
            { img: 'charlie.png', name: 'Charlie Mer Libatod', role: 'BACKEND LOGIC\n& PYTHON', cls: 'avatar-blue', fb: '6366f1' },
            { img: 'mark.png', name: 'Mark Lorenz Almocera', role: 'PROJECT COORDINATION\n& OOP DESIGN', cls: 'avatar-green', fb: '10b981' },
            { img: 'jhanell.png', name: 'Jhanell Bernardino', role: 'FRONTEND & UI/UX\n(HTML, CSS, JS)', cls: 'avatar-red', fb: 'ef4444' },
            { img: 'louel.png', name: 'John Louel Enriquez', role: 'DATABASE DESIGN\n& SYSTEM INTEGRATION', cls: 'avatar-purple', fb: 'a855f7' },
          ].map((m, i) => (
            <div className="team-card" key={i}>
              <div className={`team-avatar-wrapper ${m.cls}`}>
                <img src={`/images/${m.img}`} alt={m.name} onError={e => { e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(m.name)}&background=${m.fb}&color=fff`; }} />
              </div>
              <h3 className="team-name">{m.name}</h3>
              <p className="team-role">{m.role.split('\n').map((l, j) => <React.Fragment key={j}>{l}{j === 0 && <br />}</React.Fragment>)}</p>
              <div className="team-social">
                <a href="#"><i className="fa-brands fa-facebook-f"></i></a>
                <a href="#"><i className="fa-solid fa-envelope"></i></a>
              </div>
            </div>
          ))}
        </div>
      </section>

      <Footer />
    </>
  );
}
