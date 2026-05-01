import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';

const ORDER_HISTORY_KEY = 'mimaliciousOrderHistory';
const ORDER_STATUSES = ['Pending', 'Preparing', 'Ready', 'Delivered', 'Cancelled'];

function loadOrders() {
  try {
    const raw = localStorage.getItem(ORDER_HISTORY_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch { return []; }
}
function formatDate(d) { if (!d) return 'N/A'; const o = new Date(d); return isNaN(o.getTime()) ? 'N/A' : o.toLocaleString(); }
function formatPeso(v) { return '₱' + Number(v || 0).toFixed(2); }
function calculateTotal(items) { return items.reduce((s, i) => s + (Number(i.price || 0) * Number(i.quantity || i.qty || 0)), 0); }
function normalizeStatus(s) { return ORDER_STATUSES.includes(s) ? s : 'Pending'; }
function statusClass(s) { return 'status-' + normalizeStatus(s).toLowerCase(); }

export default function History() {
  const [orders, setOrders] = useState([]);
  const [openCards, setOpenCards] = useState({});
  const lastRaw = useRef(null);

  const refresh = () => {
    const raw = localStorage.getItem(ORDER_HISTORY_KEY);
    if (raw !== lastRaw.current) {
      lastRaw.current = raw;
      setOrders(loadOrders());
    }
  };

  useEffect(() => {
    refresh();
    const onStorage = (e) => { if (e.key === ORDER_HISTORY_KEY) { lastRaw.current = e.newValue; setOrders(loadOrders()); } };
    const onVis = () => { if (!document.hidden) refresh(); };
    window.addEventListener('storage', onStorage);
    document.addEventListener('visibilitychange', onVis);
    const iv = setInterval(refresh, 1200);
    return () => { window.removeEventListener('storage', onStorage); document.removeEventListener('visibilitychange', onVis); clearInterval(iv); };
  }, []);

  const cancelOrder = (idx) => {
    if (!window.confirm('Cancel this order? This cannot be undone.')) return;
    const all = loadOrders();
    if (!all[idx]) return;
    all[idx].status = 'Cancelled';
    const str = JSON.stringify(all);
    localStorage.setItem(ORDER_HISTORY_KEY, str);
    lastRaw.current = str;
    setOrders([...all]);
  };

  const toggleCard = (i) => setOpenCards(prev => ({ ...prev, [i]: !prev[i] }));

  return (
    <>
      <style>{`
        body { padding-top: 0; padding-bottom: 120px; }
        main { padding: 9rem 6% 3rem; max-width: 1100px; margin: 0 auto; }
        .history-header { margin-bottom: 2.5rem; }
        .history-header h1 { font-family: var(--font-display); font-size: clamp(2.2rem, 5vw, 3.5rem); color: var(--red); text-transform: uppercase; letter-spacing: 0.04em; }
        .history-header p { font-weight: 600; color: var(--brown-mid); margin-top: 0.4rem; }
        .orders-container { display: grid; gap: 1rem; }
        .order-card { background: var(--white); border: 3.5px solid var(--brown); border-radius: 18px; box-shadow: 7px 7px 0 var(--yellow); overflow: hidden; transition: transform 250ms var(--ease-out), box-shadow 250ms var(--ease-out); }
        .order-card:hover { transform: translateY(-3px); box-shadow: 10px 12px 0 var(--yellow); }
        .order-card-summary { padding: 1rem 1.2rem; cursor: pointer; display: grid; grid-template-columns: 1.2fr 1fr 1fr auto; gap: 0.7rem; align-items: center; background: #fffdf5; border-radius: 14px 14px 0 0; }
        .order-id { font-family: var(--font-display); font-size: 1.1rem; color: var(--red); letter-spacing: 0.04em; }
        .order-meta { font-size: 0.85rem; font-weight: 700; color: var(--brown-mid); }
        .order-value { font-weight: 800; font-size: 1rem; color: var(--brown); }
        .right-actions { display: flex; flex-direction: column; align-items: flex-end; gap: 0.4rem; }
        .status-badge { display: inline-flex; align-items: center; justify-content: center; min-width: 100px; height: 28px; border: 2px solid var(--brown); border-radius: 999px; font-size: 0.75rem; font-weight: 900; text-transform: uppercase; padding: 0 0.7rem; letter-spacing: 0.04em; }
        .card-action-btn { min-width: 100px; height: 30px; border: 2px solid var(--brown); border-radius: 10px; background: var(--cream); color: var(--brown); font-size: 0.72rem; font-weight: 900; text-transform: uppercase; cursor: pointer; font-family: var(--font-body); transition: background 180ms var(--ease-out); }
        .card-action-btn:hover { background: var(--yellow); }
        .cancel-order-btn { min-width: 100px; height: 30px; border: 2px solid var(--red); border-radius: 10px; background: #fff0f0; color: var(--red); font-size: 0.72rem; font-weight: 900; text-transform: uppercase; cursor: pointer; font-family: var(--font-body); letter-spacing: 0.03em; transition: background 180ms var(--ease-out), color 180ms var(--ease-out), transform 160ms var(--ease-out); }
        .cancel-order-btn:hover { background: var(--red); color: var(--white); transform: translateY(-1px); }
        .status-pending { background: #ffe08a; color: #4b3900; }
        .status-preparing { background: #b9e6ff; color: #003a5a; }
        .status-delivered { background: #c8f3ce; color: #154d1d; }
        .status-ready { background: #ffd6a5; color: #5a2e00; }
        .status-cancelled { background: #ffc9c9; color: #5b1717; }
        .order-items-wrap { border-top: 2px dashed rgba(59, 26, 8, 0.15); padding: 1rem 1.2rem; }
        .items-table { width: 100%; border-collapse: collapse; }
        .items-table th, .items-table td { text-align: left; padding: 0.55rem 0.4rem; border-bottom: 1px solid rgba(59, 26, 8, 0.08); }
        .items-table th { text-transform: uppercase; font-size: 0.75rem; color: var(--brown-mid); font-weight: 800; }
        .items-table td { font-size: 0.9rem; font-weight: 700; }
        .empty-state { background: var(--white); border: 3.5px solid var(--brown); border-radius: 18px; box-shadow: 7px 7px 0 var(--yellow); padding: 3rem; text-align: center; }
        .empty-state h3 { font-family: var(--font-display); font-size: 2rem; color: var(--red); margin-bottom: 0.8rem; letter-spacing: 0.04em; }
        .empty-state p { font-weight: 600; color: var(--brown-mid); margin-bottom: 1.5rem; }
        .empty-icon { font-size: 4rem; margin-bottom: 1rem; display: block; }
        @media(max-width:768px) { .order-card-summary { grid-template-columns: 1fr; } .right-actions { align-items: flex-start; } }
      `}</style>

      <Navbar />

      <main>
        <div className="history-header">
          <h1>Order History</h1>
          <p>Track every sizzling order you've placed.</p>
        </div>

        <div className="orders-container">
          {orders.length === 0 ? (
            <div className="empty-state">
              <span className="empty-icon">🍔</span>
              <h3>No Orders Yet</h3>
              <p>Your first order will show up right here. Head to the menu and get sizzling!</p>
              <Link to="/menu" className="btn-primary" style={{ display: 'inline-flex', padding: '0.8rem 2rem', fontSize: '1.1rem', textDecoration: 'none' }}>GO TO MENU</Link>
            </div>
          ) : [...orders].reverse().map((order, revIdx) => {
            const i = orders.length - 1 - revIdx;
            const items = Array.isArray(order.items) ? order.items : [];
            const itemCount = items.reduce((s, it) => s + Number(it.quantity || it.qty || 0), 0);
            const total = Number(order.total || 0) > 0 ? Number(order.total) : calculateTotal(items);
            const status = normalizeStatus(order.status);
            const isPending = status === 'Pending';
            const isOpen = openCards[i] || false;
            const codInfo = order.paymentMethod === 'COD' && (order.recipientName || order.deliveryAddress);

            return (
              <div className="order-card" key={i}>
                <div className="order-card-summary">
                  <div>
                    <div className="order-id">Order #{orders.length - i}</div>
                    <div className="order-meta">{formatDate(order.date)}</div>
                  </div>
                  <div><div className="order-meta">Items</div><div className="order-value">{itemCount}</div></div>
                  <div><div className="order-meta">Total</div><div className="order-value">{formatPeso(total)}</div></div>
                  <div className="right-actions">
                    <span className={`status-badge ${statusClass(status)}`}>{status}</span>
                    <button type="button" className="card-action-btn" onClick={() => toggleCard(i)}>
                      {isOpen ? 'Hide Items' : 'View Items'}
                    </button>
                    {isPending && <button type="button" className="cancel-order-btn" onClick={() => cancelOrder(i)}>Cancel</button>}
                  </div>
                </div>

                {isOpen && (
                  <div className="order-items-wrap">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', marginBottom: '0.8rem', flexWrap: 'wrap' }}>
                      <strong>Payment: {order.paymentMethod || 'N/A'}</strong>
                    </div>
                    {codInfo && (
                      <div style={{ fontSize: '0.83rem', fontWeight: 700, marginBottom: '0.6rem', padding: '0.5rem 0.7rem', background: 'var(--cream)', borderRadius: '8px' }}>
                        <span style={{ color: 'var(--brown-mid)' }}>Recipient:</span> {order.recipientName || 'N/A'} &nbsp;•&nbsp; <span style={{ color: 'var(--brown-mid)' }}>Address:</span> {order.deliveryAddress || 'N/A'}
                      </div>
                    )}
                    <table className="items-table">
                      <thead><tr><th>Item</th><th>Size</th><th>Qty</th><th>Price</th><th>Subtotal</th></tr></thead>
                      <tbody>
                        {items.length > 0 ? items.map((it, j) => (
                          <tr key={j}>
                            <td>{it.item || it.name || 'Unknown'}</td>
                            <td>{it.size || '-'}</td>
                            <td>{Number(it.quantity || it.qty || 0)}</td>
                            <td>{formatPeso(it.price || 0)}</td>
                            <td>{formatPeso(Number(it.price || 0) * Number(it.quantity || it.qty || 0))}</td>
                          </tr>
                        )) : <tr><td colSpan="5">No items.</td></tr>}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </main>

      <footer style={{ background: 'var(--brown)', borderTop: '4px solid var(--yellow)', padding: '2rem 6%', textAlign: 'center', position: 'fixed', bottom: 0, width: '100%', zIndex: 1 }}>
        <p style={{ fontSize: '0.82rem', fontWeight: 700, color: 'rgba(245,237,214,0.45)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
          &copy; 2026 MIMALICIOUS. ALL RIGHTS RESERVED. WAG KANG MAGPAPAGUTOM!<br />DEVELOPED BY PROGRAMIZ
        </p>
      </footer>
    </>
  );
}
