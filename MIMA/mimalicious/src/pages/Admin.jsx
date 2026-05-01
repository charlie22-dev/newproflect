import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const ORDER_HISTORY_KEY = 'mimaliciousOrderHistory';
const ADMIN_KEY = 'mimaAdminLoggedIn';
const ADMIN_PASSWORD = 'admin2026';
const ORDER_STATUSES = ['Pending', 'Preparing', 'Ready', 'Delivered', 'Cancelled'];

function loadOrders() {
  try { const r = localStorage.getItem(ORDER_HISTORY_KEY); const p = r ? JSON.parse(r) : []; return Array.isArray(p) ? p : []; } catch { return []; }
}
function formatDate(d) { if (!d) return 'N/A'; const o = new Date(d); return isNaN(o.getTime()) ? 'N/A' : o.toLocaleString(); }
function formatPeso(v) { return '₱' + Number(v || 0).toFixed(2); }
function normalizeStatus(s) { return ORDER_STATUSES.includes(s) ? s : 'Pending'; }
function statusClass(s) { return 'status-' + normalizeStatus(s).toLowerCase(); }

export default function Admin() {
  const [authed, setAuthed] = useState(localStorage.getItem(ADMIN_KEY) === 'true');
  const [pw, setPw] = useState('');
  const [err, setErr] = useState('');
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    if (authed) {
      setOrders(loadOrders());
      const onStorage = (e) => { if (e.key === ORDER_HISTORY_KEY) setOrders(loadOrders()); };
      window.addEventListener('storage', onStorage);
      return () => window.removeEventListener('storage', onStorage);
    }
  }, [authed]);

  const handleLogin = (e) => {
    e.preventDefault();
    if (pw === ADMIN_PASSWORD) {
      localStorage.setItem(ADMIN_KEY, 'true');
      setAuthed(true);
      setErr('');
    } else {
      setErr('Incorrect password. Try again.');
      setPw('');
    }
  };

  const adminLogout = () => {
    localStorage.removeItem(ADMIN_KEY);
    setAuthed(false);
    setPw('');
  };

  const updateStatus = (i, val) => {
    const all = loadOrders();
    if (!all[i]) return;
    all[i].status = normalizeStatus(val);
    localStorage.setItem(ORDER_HISTORY_KEY, JSON.stringify(all));
    setOrders([...all]);
  };

  if (!authed) return (
    <>
      <style>{`
        body { padding-top: 0; min-height: 100dvh; background: #1a0a02; }
        .admin-login-screen { min-height: 100dvh; display: flex; align-items: center; justify-content: center; padding: 2rem; background: #1a0a02; background-image: radial-gradient(circle, rgba(245,166,35,0.07) 1px, transparent 1px); background-size: 28px 28px; }
        .admin-login-card { background: var(--white); border-radius: 28px; padding: 3rem 2.5rem; border: 4px solid var(--yellow); box-shadow: 10px 10px 0 var(--brown), 0 40px 80px rgba(0,0,0,0.4); width: 100%; max-width: 420px; text-align: center; animation: card-enter 350ms var(--ease-out) both; }
        @keyframes card-enter { from { opacity:0; transform:translateY(20px) scale(0.97); } to { opacity:1; transform:none; } }
        .admin-login-card h2 { font-family: var(--font-display); font-size: 1.8rem; color: var(--red); margin-bottom: 0.3rem; letter-spacing: 0.04em; }
        .admin-login-card p { font-weight: 600; color: var(--brown-mid); font-size: 0.88rem; margin-bottom: 2rem; }
        .admin-err { color: var(--red); font-weight: 700; font-size: 0.82rem; margin-top: 0.5rem; min-height: 1.2rem; }
        .submit-btn { background: var(--red); color: var(--white); border: 3px solid var(--brown); padding: 1rem; width: 100%; border-radius: 50px; font-family: var(--font-display); font-size: 1.2rem; letter-spacing: 0.06em; cursor: pointer; margin-top: 0.8rem; transition: background 200ms, transform 160ms, box-shadow 200ms; box-shadow: 0 5px 0 var(--red-deep); }
        .submit-btn:hover { background: var(--yellow); color: var(--brown); transform: translateY(-2px); }
        .back-link { display: block; text-align: center; margin-top: 1.5rem; color: var(--brown-mid); font-weight: 700; font-size: 0.88rem; text-decoration: none; }
        .back-link:hover { color: var(--red); }
      `}</style>
      <div className="admin-login-screen">
        <div className="admin-login-card">
          <Link to="/" className="logo" style={{ fontSize: '2.2rem', display: 'block', marginBottom: '0.4rem' }}>MIMALICIOUS</Link>
          <h2>Admin Access</h2>
          <p>Enter the admin password to continue</p>
          <form onSubmit={handleLogin}>
            <div className="form-group" style={{ textAlign: 'left' }}>
              <label htmlFor="adminPw">Password</label>
              <input type="password" id="adminPw" value={pw} onChange={e => setPw(e.target.value)} placeholder="••••••••" required autoComplete="current-password" />
            </div>
            <button type="submit" className="submit-btn" id="admin-login-btn">ENTER DASHBOARD</button>
            <div className="admin-err">{err}</div>
          </form>
          <Link to="/home" className="back-link">← Back to Site</Link>
        </div>
      </div>
    </>
  );

  return (
    <>
      <style>{`
        body { padding-top: 0; min-height: 100dvh; background: #1a0a02; }
        .admin-wrap { display: flex; flex-direction: column; min-height: 100dvh; }
        .admin-topbar { background: var(--brown); border-bottom: 4px solid var(--yellow); padding: 1rem 5%; display: flex; align-items: center; justify-content: space-between; position: sticky; top: 0; z-index: 100; }
        .admin-badge { background: var(--red); color: var(--white); font-family: var(--font-display); font-size: 0.75rem; padding: 0.25rem 0.8rem; border-radius: 50px; letter-spacing: 0.08em; border: 2px solid var(--yellow); margin-left: 0.7rem; }
        .admin-main { flex: 1; padding: 2.5rem 5%; max-width: 1300px; margin: 0 auto; width: 100%; }
        .admin-heading { font-family: var(--font-display); font-size: clamp(2rem, 4vw, 3rem); color: var(--yellow); text-transform: uppercase; letter-spacing: 0.04em; text-shadow: 3px 3px 0 rgba(0,0,0,0.4); margin-bottom: 0.4rem; }
        .admin-sub { font-weight: 700; color: rgba(245,237,214,0.55); margin-bottom: 2rem; font-size: 0.9rem; }
        .admin-orders { display: grid; gap: 1.2rem; }
        .admin-order-card { background: var(--white); border: 3.5px solid var(--brown); border-radius: 18px; box-shadow: 6px 6px 0 var(--yellow); overflow: hidden; transition: transform 220ms var(--ease-out), box-shadow 220ms var(--ease-out); }
        .admin-order-card:hover { transform: translateY(-3px); box-shadow: 9px 11px 0 var(--yellow); }
        .admin-card-head { display: grid; grid-template-columns: 1fr 1fr 1fr auto; gap: 0.8rem; align-items: center; padding: 1rem 1.3rem; background: #fffdf5; border-bottom: 1.5px dashed rgba(59,26,8,0.12); }
        .admin-order-id { font-family: var(--font-display); font-size: 1.1rem; color: var(--red); }
        .admin-meta { font-size: 0.82rem; font-weight: 700; color: var(--brown-mid); }
        .admin-val { font-weight: 800; font-size: 1rem; color: var(--brown); }
        .status-badge { display:inline-flex; align-items:center; justify-content:center; min-width:100px; height:28px; border:2px solid var(--brown); border-radius:999px; font-size:0.75rem; font-weight:900; text-transform:uppercase; padding:0 0.7rem; letter-spacing:0.04em; }
        .status-pending { background:#ffe08a; color:#4b3900; } .status-preparing { background:#b9e6ff; color:#003a5a; } .status-ready { background:#ffd6a5; color:#5a2e00; } .status-delivered { background:#c8f3ce; color:#154d1d; } .status-cancelled { background:#ffc9c9; color:#5b1717; }
        .admin-card-body { padding: 1rem 1.3rem; }
        .admin-info-row { display: flex; flex-wrap: wrap; gap: 1rem; margin-bottom: 0.8rem; font-size: 0.85rem; font-weight: 700; }
        .admin-info-row span { color: var(--brown-mid); }
        .admin-status-row { display: flex; align-items: center; gap: 0.8rem; margin-bottom: 1rem; flex-wrap: wrap; }
        .admin-status-label { font-weight: 800; font-size: 0.82rem; text-transform: uppercase; letter-spacing: 0.06em; color: var(--brown); }
        .admin-status-select { height: 34px; border: 2.5px solid var(--brown); border-radius: 10px; background: var(--white); font-weight: 800; color: var(--brown); padding: 0 0.6rem; font-family: var(--font-body); font-size: 0.88rem; cursor: pointer; transition: border-color 160ms var(--ease-out); }
        .items-table { width: 100%; border-collapse: collapse; font-size: 0.88rem; }
        .items-table th, .items-table td { text-align: left; padding: 0.5rem 0.4rem; border-bottom: 1px solid rgba(59,26,8,0.08); }
        .items-table th { text-transform: uppercase; font-size: 0.72rem; color: var(--brown-mid); font-weight: 800; letter-spacing: 0.04em; }
        .items-table td { font-weight: 700; }
        .admin-empty { text-align: center; padding: 4rem 2rem; color: var(--yellow); }
        .admin-empty h3 { font-family: var(--font-display); font-size: 2rem; margin-bottom: 0.8rem; }
        .nav-button { display:inline-flex; align-items:center; justify-content:center; text-decoration:none; background:var(--yellow); color:var(--brown); padding:0 1.4rem; border-radius:50px; border:2.5px solid var(--brown); box-shadow:4px 4px 0 var(--brown); font-family:var(--font-display); font-size:0.95rem; letter-spacing:0.06em; height:40px; cursor:pointer; }
        @media (max-width: 700px) { .admin-card-head { grid-template-columns: 1fr 1fr; } }
      `}</style>

      <div className="admin-wrap">
        <header className="admin-topbar">
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Link to="/home" className="logo" style={{ fontSize: '1.6rem' }}>MIMALICIOUS</Link>
            <span className="admin-badge">ADMIN</span>
          </div>
          <button className="nav-button" onClick={adminLogout} id="admin-logout-btn">LOGOUT</button>
        </header>

        <main className="admin-main">
          <h1 className="admin-heading">Order Dashboard</h1>
          <p className="admin-sub">View and manage all customer orders. Updates reflect immediately on the Order History page.</p>
          <div className="admin-orders">
            {orders.length === 0 ? (
              <div className="admin-empty"><h3>No Orders Yet</h3><p>Orders placed from the menu will appear here.</p></div>
            ) : [...orders].reverse().map((o, revIdx) => {
              const i = orders.length - 1 - revIdx;
              const items = Array.isArray(o.items) ? o.items : [];
              const status = normalizeStatus(o.status);
              const total = Number(o.total || 0);
              const itemCount = items.reduce((s, it) => s + Number(it.quantity || it.qty || 0), 0);
              const codDetails = o.paymentMethod === 'COD';

              return (
                <div className="admin-order-card" key={i}>
                  <div className="admin-card-head">
                    <div><div className="admin-order-id">Order #{orders.length - i}</div><div className="admin-meta">{formatDate(o.date)}</div></div>
                    <div><div className="admin-meta">Items</div><div className="admin-val">{itemCount}</div></div>
                    <div><div className="admin-meta">Total</div><div className="admin-val">{formatPeso(total)}</div></div>
                    <span className={`status-badge ${statusClass(status)}`}>{status}</span>
                  </div>
                  <div className="admin-card-body">
                    <div className="admin-info-row">
                      <div><span>Payment:</span> {o.paymentMethod || 'N/A'}</div>
                      {codDetails && <><div><span>Recipient:</span> {o.recipientName || 'N/A'}</div><div><span>Address:</span> {o.deliveryAddress || 'N/A'}</div></>}
                    </div>
                    <div className="admin-status-row">
                      <span className="admin-status-label">Update Status:</span>
                      <select className="admin-status-select" value={status} onChange={e => updateStatus(i, e.target.value)}>
                        {ORDER_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </div>
                    <table className="items-table">
                      <thead><tr><th>Item</th><th>Size</th><th>Qty</th><th>Price</th><th>Subtotal</th></tr></thead>
                      <tbody>
                        {items.length > 0 ? items.map((it, j) => {
                          const q = Number(it.quantity || it.qty || 0);
                          return <tr key={j}><td>{it.item || it.name || '?'}</td><td>{it.size || '-'}</td><td>{q}</td><td>{formatPeso(it.price || 0)}</td><td>{formatPeso((it.price || 0) * q)}</td></tr>;
                        }) : <tr><td colSpan="5">No items.</td></tr>}
                      </tbody>
                    </table>
                  </div>
                </div>
              );
            })}
          </div>
        </main>
      </div>
    </>
  );
}
