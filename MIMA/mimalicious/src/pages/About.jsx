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
        .about-hero { background-color: var(--red); background-image: radial-gradient(var(--red-deep) 8px, transparent 8px); background-size: 32px 32px; padding: 11rem 6% 9rem; text-align: center; color: var(--white); clip-path: ellipse(150% 100% at 50% 0%); position: relative; overflow: hidden; }
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
        .team-section { background: var(--cream); padding: 5rem 0; text-align: center; overflow: hidden; }
        .team-title { font-family: var(--font-display); color: var(--red); font-size: clamp(2.5rem, 6vw, 4rem); margin-bottom: 3.5rem; text-transform: uppercase; text-shadow: 4px 4px 0 var(--brown); letter-spacing: -0.02em; }
        
        /* Leader Row */
        .team-leader-row { display: flex; justify-content: center; padding: 0 6%; margin-bottom: 2.5rem; }
        .team-card-leader { perspective: 2000px; height: 420px; width: 100%; max-width: 380px; position: relative; }
        .leader-badge { display: inline-flex; align-items: center; gap: 0.4rem; background: var(--yellow); color: var(--brown); font-size: 0.65rem; font-weight: 900; text-transform: uppercase; letter-spacing: 0.14em; padding: 0.35rem 1rem; border-radius: 999px; border: 2.5px solid var(--brown); box-shadow: 3px 3px 0 var(--brown); margin-bottom: 0.9rem; }

        /* Members Grid */
        .team-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 2rem; max-width: 1100px; margin: 0 auto; padding: 0 6%; }
        .team-card-wrapper { perspective: 2000px; height: 380px; width: 100%; }

        .team-card-inner { width: 100%; height: 100%; position: relative; transition: transform 0.7s cubic-bezier(0.23, 1, 0.32, 1); transform-style: preserve-3d; border-radius: 24px; border: 4px solid var(--brown); }
        .team-card-wrapper:hover .team-card-inner, .team-card-leader:hover .team-card-inner { transform: translateY(-8px) rotateY(180deg); }
        .team-card-wrapper:active .team-card-inner, .team-card-leader:active .team-card-inner { transform: scale(0.96) rotateY(180deg); }
        
        .team-card-front, .team-card-back { position: absolute; top: 0; left: 0; width: 100%; height: 100%; backface-visibility: hidden; border-radius: 20px; display: flex; flex-direction: column; justify-content: center; align-items: center; padding: 2.5rem 1.5rem; text-align: center; }
        .team-card-front { background: var(--white); box-shadow: 8px 8px 0 var(--red); transition: box-shadow 0.4s ease; }
        .team-card-wrapper:hover .team-card-front, .team-card-leader:hover .team-card-front { box-shadow: 0 0 0 transparent; }
        
        .team-card-back { background: var(--red); color: var(--white); transform: rotateY(180deg); box-shadow: 8px 8px 0 var(--brown); padding: 2rem 2.5rem; }
        
        .team-avatar-wrapper { margin: 0 auto 1.2rem; width: 110px; height: 110px; border-radius: 50%; position: relative; background: var(--white); border: 4px solid var(--brown); transition: transform 200ms cubic-bezier(0.23, 1, 0.32, 1); }
        .team-card-leader .team-avatar-wrapper { width: 130px; height: 130px; }
        .team-card-wrapper:hover .team-avatar-wrapper, .team-card-leader:hover .team-avatar-wrapper { transform: scale(1.08); }
        .team-avatar-wrapper img { width: 100%; height: 100%; object-fit: cover; border-radius: 50%; }
        .avatar-blue { box-shadow: 6px 6px 0 var(--red); }
        .avatar-green { box-shadow: 6px 6px 0 var(--yellow); }
        .avatar-red { box-shadow: 6px 6px 0 var(--brown); }
        .avatar-purple { box-shadow: 6px 6px 0 var(--brown); }
        
        .team-name { font-family: var(--font-display); color: var(--red); font-size: 1.85rem; margin-bottom: 0.3rem; text-transform: uppercase; letter-spacing: -0.03em; line-height: 0.95; text-shadow: 2px 2px 0px rgba(59,26,8,0.1); }
        .team-role { color: var(--brown); font-size: 0.72rem; font-weight: 900; text-transform: uppercase; letter-spacing: 0.12em; line-height: 1.4; opacity: 0.75; margin-top: 0.3rem; }
        
        .back-desc { font-size: 0.98rem; font-weight: 500; line-height: 1.65; margin-bottom: 1.8rem; color: rgba(255,255,255,0.95); padding: 0 0.5rem; }
        .team-social { display: flex; gap: 12px; justify-content: center; }
        .team-social a { width: 44px; height: 44px; border-radius: 50%; background: var(--yellow); color: var(--brown); border: 3px solid var(--brown); display: flex; align-items: center; justify-content: center; text-decoration: none; transition: transform 160ms cubic-bezier(0.23, 1, 0.32, 1), box-shadow 160ms cubic-bezier(0.23, 1, 0.32, 1), background-color 160ms ease, color 160ms ease; box-shadow: 4px 4px 0 var(--brown); }
        .team-social a:hover { transform: translateY(-4px); box-shadow: 6px 6px 0 var(--brown); background: var(--white); color: var(--red); }
        .team-social a:active { transform: scale(0.92); box-shadow: 2px 2px 0 var(--brown); }
        
        @media(max-width:900px) {
          .team-grid { grid-template-columns: repeat(2, 1fr); }
        }
        @media(max-width:768px) { 
          .fun-stats { grid-template-columns: 1fr; } 
          .feature-card { flex-direction: column; text-align: center; } 
          .team-grid { grid-template-columns: 1fr; }
          .team-card-leader { max-width: 100%; }
        }
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

        </div>
      </section>

      <section className="team-section">
        <h2 className="team-title reveal">Meet The Team</h2>

        {/* ── Leader: King Yuan ── */}
        <div className="team-leader-row reveal">
          <div className="team-card-leader">
            <div className="team-card-inner">
              <div className="team-card-front">
                <span className="leader-badge"><i className="fa-solid fa-crown" style={{fontSize:'0.7rem'}}></i> Team Leader</span>
                <div className="team-avatar-wrapper avatar-green">
                  <img src="/images/kingyuan.jpg" alt="King Yuan Nadala"
                    onError={e => { e.target.src = `https://ui-avatars.com/api/?name=King+Yuan+Nadala&background=c0392b&color=fff`; }} />
                </div>
                <h3 className="team-name">King Yuan Nadala</h3>
                <p className="team-role">TEAM LEADER<br />& GRAPHIC DESIGNER</p>
              </div>
              <div className="team-card-back">
                <p className="back-desc">Sets direction and holds the vision. Keeps the crew aligned and the brand visually sharp across every touchpoint.</p>
                <div className="team-social">
                  <a href="https://web.facebook.com/yuanking.maquiniananadala" target="_blank" rel="noreferrer"><i className="fa-brands fa-facebook-f"></i></a>
                  <a href="mailto:kingyuannadala@gmail.com"><i className="fa-solid fa-envelope"></i></a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── 6 Members Below ── */}
        <div className="team-grid reveal-stagger">
          {[
            { img: 'charlie%20mer%20libatod.jpg', name: 'Charlie Mer Libatod', role: 'UI & UX\nDESIGN', cls: 'avatar-blue', fb: 'c0392b', fbUrl: 'https://web.facebook.com/charlie.libatod/', email: 'malinaocharlie74@gmail.com', desc: 'Shapes every pixel with intent. The one responsible for making Mimalicious feel as good as it tastes.' },
            { img: 'justin%20mike%20acupan.jpg', name: 'Justin Mike Acupan', role: 'WEB\nDOCUMENTATOR', cls: 'avatar-red', fb: 'c0392b', fbUrl: 'https://web.facebook.com/mikey.312819', email: 'justinmikeacupan@gmail.com', desc: 'Captures every decision and process in writing. The institutional memory that keeps the build reproducible.' },
            { img: 'joshua%20miguel.jpg', name: 'Joshua Miguel Acupan', role: 'WEB\nDOCUMENTATOR', cls: 'avatar-purple', fb: '8e3a1f', fbUrl: 'https://web.facebook.com/profile.php?id=100090869064404', email: 'agentmathan@gmail.com', desc: 'Ensures no feature goes unrecorded. Works alongside Justin to build a documentation trail the team can trust.' },
            { img: 'jhanell.jpg', name: 'Jhanell Bernardino', role: 'FRONTEND\nDEVELOPER', cls: 'avatar-blue', fb: 'c0392b', fbUrl: 'https://www.facebook.com/jhanellchuidianbernandino', email: 'bernandinojhanell@gmail.com', desc: 'Brings designs to life in the browser. Every interactive detail and smooth transition is her craft.' },
            { img: 'john%20louel.jpg', name: 'John Louel Enriquez', role: 'FRONTEND\nDEVELOPER', cls: 'avatar-green', fb: '10b981', fbUrl: 'https://www.facebook.com/share/1DVPE66byK/', email: 'ejhonlouel@gmail.com', desc: 'Builds robust, responsive interfaces. Turns static mockups into fast, accessible, living web pages.' },
            { img: 'mark%20lorenz.jpg', name: 'Mark Lorenz Almocera', role: 'PROJECT\nCOORDINATOR', cls: 'avatar-red', fb: 'c0392b', fbUrl: 'https://web.facebook.com/mark.almocera.359555/', email: 'l.almocera23@gmail.com', desc: 'The operational backbone. Keeps timelines tight, communication clear, and the entire project on course.' },
          ].map((m, i) => (
            <div className="team-card-wrapper" key={i}>
              <div className="team-card-inner">
                <div className="team-card-front">
                  <div className={`team-avatar-wrapper ${m.cls}`}>
                    <img src={`/images/${m.img}`} alt={m.name}
                      onError={e => { e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(m.name)}&background=${m.fb}&color=fff`; }} />
                  </div>
                  <h3 className="team-name">{m.name}</h3>
                  <p className="team-role">{m.role.split('\n').map((l, j) => <React.Fragment key={j}>{l}{j === 0 && <br />}</React.Fragment>)}</p>
                </div>
                <div className="team-card-back">
                  <p className="back-desc">{m.desc}</p>
                  <div className="team-social">
                    <a href={m.fbUrl} target="_blank" rel="noreferrer"><i className="fa-brands fa-facebook-f"></i></a>
                    {m.email && <a href={`mailto:${m.email}`}><i className="fa-solid fa-envelope"></i></a>}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <Footer />
    </>
  );
}
