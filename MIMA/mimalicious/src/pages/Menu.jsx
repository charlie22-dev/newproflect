import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import './Menu.css';

/* ── Data ─────────────────────────────────────────────── */
const PRICE_MAP = {
  "Mima-namnam Deluxe":150,"Mima-mazing Bite":190,"Mima-sarap Supreme":220,
  "Mima Classic":70,"The Big Mima":150,"Mima Sweet Heat":150,"Mima Loaded Stack":150,
  "Mima Ultimate Melt":150,"Mima BBQ BLAST":100,"Mima Cheesy Overload":110,
  "Mima Crunchy Stack":110,"Mima Fire Crunch":149,"Mima Smoky Melt":149,
  "Mima Zing Stack":149,"Mima Pepper Blast":149,
  "MIMA CLASSIC CRISP FRIES":50,"MIMA CHEESY MELT FRIES":50,"MIMA GARLIC PARM FRIES":50,
  "MIMA SWEET HEAT FRIES":50,"MIMA BBQ SMOKE FRIES":50,"MIMA CHILI CHEESE FRIES":50,
  "COKE":40,"SPRITE":40,"ROYAL":40,"SPRING WATER":30,"LEMONADE":45,"ICED TEA":45
};
const SIZE_CONFIG = {
  fries:[{label:"Regular",add:0},{label:"Medium",add:20},{label:"Large",add:40}],
  drinks:[{label:"S",add:0},{label:"M",add:20},{label:"L",add:30}],
  juice:[{label:"S",add:0},{label:"M",add:20},{label:"L",add:30}]
};
const ADDON_PRICES = {"None":0,"Add lettuce":10,"Add onions":10,"Add mayo":15};
const ORDER_HISTORY_KEY = "mimaliciousOrderHistory";

const BURGERS = [
  {img:"classic.png",name:"MIMA CLASSIC",desc:"The OG. 100% Beef, secret sauce, total satisfaction.",price:70,key:"Mima Classic"},
  {img:"Big.png",name:"THE BIG MIMA",desc:"Stacked high with double beef and triple the attitude.",price:150,key:"The Big Mima"},
  {img:"Heat.png",name:"MIMA SWEET HEAT",desc:"Sweet and spicy flavor with a fiery kick.",price:150,key:"Mima Sweet Heat"},
  {img:"Loaded.png",name:"MIMA LOADED STACK",desc:"Packed with beef, cheese, and extra toppings.",price:150,key:"Mima Loaded Stack"},
  {img:"melt.png",name:"MIMA ULTIMATE MELT",desc:"Rich, juicy burger with perfectly melted cheese.",price:150,key:"Mima Ultimate Melt"},
  {img:"bbq.png",name:"MIMA BBQ BLAST",desc:"Smoky BBQ beef with caramelized onions.",price:100,key:"Mima BBQ BLAST"},
  {img:"cheesy.png",name:"MIMA CHEESY OVERLOAD",desc:"Loaded with gooey, melted cheese layers.",price:110,key:"Mima Cheesy Overload"},
  {img:"crunchy.png",name:"MIMA CRUNCHY STACK",desc:"Crispy chicken and fresh veggies in every bite.",price:110,key:"Mima Crunchy Stack"},
  {img:"fire-removebg-preview.png",name:"MIMA FIRE CRUNCH",desc:"Crispy chicken with a spicy crunch.",price:149,key:"Mima Fire Crunch"},
  {img:"smokey.png",name:"MIMA SMOKY MELT",desc:"Beef with smoky sauce and melted cheese.",price:149,key:"Mima Smoky Melt"},
  {img:"zing.png",name:"MIMA ZING STACK",desc:"Tangy, juicy layers with a zesty bite.",price:149,key:"Mima Zing Stack"},
  {img:"peper.png",name:"MIMA PEPPER BLAST",desc:"Peppery beef with bold, rich flavor.",price:149,key:"Mima Pepper Blast"},
];
const FRIES = [
  {img:"1.png",name:"MIMA CLASSIC CRISP FRIES",desc:"Golden, thin-cut fries with light salt seasoning.",price:50},
  {img:"cheese.png",name:"MIMA CHEESY MELT FRIES",desc:"Fries loaded with rich melted cheese sauce.",price:50},
  {img:"garlic.png",name:"MIMA GARLIC PARM FRIES",desc:"Crispy fries in garlic butter and parmesan.",price:50},
  {img:"sour.png",name:"MIMA SWEET HEAT FRIES",desc:"Sweet glaze and spicy chili powder kick.",price:50},
  {img:"chili.png",name:"MIMA BBQ SMOKE FRIES",desc:"Fries coated with smoky barbecue seasoning.",price:50},
  {img:"last.png",name:"MIMA CHILI CHEESE FRIES",desc:"Spicy chili sauce and melted cheese topping.",price:50},
];
const DRINKS = [
  {img:"coke.png",name:"COKE",desc:"Sweet, dark soda with caffeine.",price:40,cat:"drinks"},
  {img:"sprite.png",name:"SPRITE",desc:"Lemon-lime soda, caffeine-free.",price:40,cat:"drinks"},
  {img:"royal.png",name:"ROYAL",desc:"Sweet, fruity soda (usually orange).",price:40,cat:"drinks"},
  {img:"springwater.png",name:"SPRING WATER",desc:"Natural, non-carbonated drinking water.",price:30,cat:"other"},
  {img:"Lemon.png",name:"LEMONADE",desc:"Icy cold refreshment to put out the fire.",price:45,cat:"juice"},
  {img:"Tea.png",name:"ICED TEA",desc:"Chilled tea, slightly sweet and refreshing.",price:45,cat:"juice"},
];
const DEALS = [
  {img:"deluxe.png",tag:"DELUXE",name:"Mima-namnam Deluxe",desc:"Savory beef, bacon, and fresh toppings.",price:150},
  {img:"bite.png",tag:"BITE",name:"Mima-mazing Bite",desc:"Juicy beef, crispy bacon, cheesy goodness.",price:190},
  {img:"supreme.png",tag:"SUPREME",name:"Mima-sarap Supreme",desc:"Beef + fried chicken with rich sauces.",price:220},
];

/* ── Helpers ───────────────────────────────────────────── */
function buildKey(name, size, addons) {
  let k = name;
  if (size) k += "||" + size;
  if (Array.isArray(addons) && addons.length > 0 && !addons.includes("None")) {
    k += "||" + [...addons].sort().join(", ");
  } else if (typeof addons === "string" && addons !== "None") {
    k += "||" + addons;
  }
  return k;
}

/* ── UI Components ──────────────────────────────────────── */
function MenuItemCard({ img, name, desc, price, onAdd }) {
  return (
    <div className="menu-item reveal">
      <img src={"/images/" + img} alt={name} style={{width:"100%",height:"160px",objectFit:"contain"}} />
      <h3>{name}</h3>
      <p style={{fontSize:".9rem",fontWeight:600,color:"var(--brown-mid)",margin:".4rem 0 .8rem",lineHeight:1.4}}>{desc}</p>
      <div className="price">&#8369;{price}</div>
      <button className="add-btn" onClick={onAdd}></button>
    </div>
  );
}

/* ── Component ─────────────────────────────────────────── */
export default function Menu() {
  const [category, setCategory] = useState("burgers");
  const [cart, setCart] = useState({});
  const [selected, setSelected] = useState(new Set());
  const [cartOpen, setCartOpen] = useState(false);
  const [payOpen, setPayOpen] = useState(false);
  const [sizeModal, setSizeModal] = useState({ open:false, name:"", price:0, cat:"fries", choice:"", editKey: null });
  const [addonModal, setAddonModal] = useState({ open:false, name:"", price:0, addons:[], editKey: null });
  const [payMethod, setPayMethod] = useState("COD");
  const [recipient, setRecipient] = useState("");
  const [address, setAddress] = useState("");
  const [recipientErr, setRecipientErr] = useState(false);
  const [addressErr, setAddressErr] = useState(false);
  const [shake, setShake] = useState(false);
  const [toasts, setToasts] = useState([]);

  function addToast(msg) {
    const id = Date.now() + Math.random();
    setToasts(prev => [...prev, { id, msg }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3000);
  }

  /* Scroll Reveal */
  useEffect(() => {
    const obs = new IntersectionObserver(entries =>
      entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add("animate-in"); obs.unobserve(e.target); } }),
      { threshold: 0.1 }
    );
    document.querySelectorAll(".reveal, .reveal-stagger").forEach(el => obs.observe(el));
    return () => obs.disconnect();
  }, [category]);

  /* ── Cart helpers ──────────────────────────────────────── */
  const cartKeys = Object.keys(cart);
  const totalItems = cartKeys.reduce((s, k) => s + cart[k].qty, 0);
  const selTotal = cartKeys.filter(k => selected.has(k)).reduce((s, k) => s + cart[k].price * cart[k].qty, 0);
  const allSel = cartKeys.length > 0 && cartKeys.every(k => selected.has(k));
  const someSel = cartKeys.some(k => selected.has(k));

  function addToCart(name, price, size, addons, catg, replaceKey = null, keepQty = 1) {
    const ap = Number(price);
    const key = buildKey(name, size || null, addons || null);
    
    setCart(prev => {
      const next = {...prev};
      
      // If editing an item, remove the old key if it changed
      if (replaceKey && replaceKey !== key) {
        delete next[replaceKey];
      }
      
      if (next[key]) {
        next[key] = {...next[key], qty: next[key].qty + (replaceKey ? keepQty : 1)};
      } else {
        const addonStr = Array.isArray(addons) ? (addons.length ? [...addons].sort().join(", ") : "None") : (addons || "None");
        next[key] = {item: name, price: ap, qty: keepQty, size: size||null, addon: addonStr, category: catg||"other"};
      }
      return next;
    });
    
    setSelected(prev => {
      const ns = new Set([...prev]);
      if (replaceKey) ns.delete(replaceKey);
      ns.add(key);
      return ns;
    });

    addToast(replaceKey ? `Updated ${name} in Cart` : `Added ${name} to Cart`);
  }

  function changeQty(key, delta) {
    setCart(prev => {
      const next = {...prev};
      if (!next[key]) return next;
      const newQty = next[key].qty + delta;
      if (newQty <= 0) {
        delete next[key];
        setSelected(ps => { const ns = new Set(ps); ns.delete(key); return ns; });
      } else {
        next[key] = {...next[key], qty: newQty};
      }
      return next;
    });
  }

  function toggleAll(checked) {
    setSelected(checked ? new Set(cartKeys) : new Set());
  }

  function toggleItem(key, checked) {
    setSelected(prev => { const ns = new Set(prev); if (checked) ns.add(key); else ns.delete(key); return ns; });
  }

  /* ── Size modal ─────────────────────────────────────────── */
  function openSize(name, price, cat) {
    const opts = SIZE_CONFIG[cat] || SIZE_CONFIG.fries;
    setSizeModal({ open:true, name, price: Number(price), cat, choice: opts[0].label, editKey: null });
  }

  function confirmSize() {
    const opts = SIZE_CONFIG[sizeModal.cat] || SIZE_CONFIG.fries;
    const opt = opts.find(o => o.label === sizeModal.choice) || opts[0];
    const oldQty = sizeModal.editKey && cart[sizeModal.editKey] ? cart[sizeModal.editKey].qty : 1;
    addToCart(sizeModal.name, sizeModal.price + opt.add, sizeModal.choice, null, sizeModal.cat, sizeModal.editKey, oldQty);
    setSizeModal(s => ({...s, open:false}));
  }

  /* -- Addon modal -- */
  function openAddon(name, price) {
    setAddonModal({ open: true, name, price: Number(price), addons: [], editKey: null });
  }

  function confirmAddon() {
    const extraCost = addonModal.addons.reduce((sum, a) => sum + (ADDON_PRICES[a] || 0), 0);
    const finalPrice = addonModal.price + extraCost;
    const oldQty = addonModal.editKey && cart[addonModal.editKey] ? cart[addonModal.editKey].qty : 1;
    addToCart(addonModal.name, finalPrice, null, addonModal.addons, "burger", addonModal.editKey, oldQty);
    setAddonModal(a => ({ ...a, open: false }));
  }

  function toggleAddon(val) {
    setAddonModal(prev => {
      if (val === "None") return { ...prev, addons: [] };
      let newAddons = [...prev.addons];
      if (newAddons.includes(val)) {
        newAddons = newAddons.filter(a => a !== val);
      } else {
        newAddons.push(val);
      }
      return { ...prev, addons: newAddons };
    });
  }

  /* ── Edit Cart Item ──────────────────────────────────────── */
  function editCartItem(k) {
    const it = cart[k];
    const basePrice = PRICE_MAP[it.item] || it.price;
    if (["fries", "drinks", "juice"].includes(it.category)) {
      setSizeModal({ open:true, name: it.item, price: basePrice, cat: it.category, choice: it.size || SIZE_CONFIG[it.category][0].label, editKey: k });
    } else {
      const currentAddons = it.addon && it.addon !== "None" ? it.addon.split(", ") : [];
      setAddonModal({ open:true, name: it.item, price: basePrice, addons: currentAddons, editKey: k });
    }
  }

  /* ── Checkout ────────────────────────────────────────────── */
  function processCheckout() {
    const checked = cartKeys.filter(k => selected.has(k));
    if (checked.length === 0) { addToast("Select at least one item to checkout!"); return; }
    setCartOpen(false);
    setPayOpen(true);
  }

  function closePayment() { setPayOpen(false); }

  function confirmOrder() {
    if (payMethod === "COD") {
      const re = !recipient.trim();
      const ae = !address.trim();
      setRecipientErr(re);
      setAddressErr(ae);
      if (re || ae) {
        setShake(true);
        setTimeout(() => setShake(false), 420);
        return;
      }
    }
    const checked = cartKeys.filter(k => selected.has(k));
    const items = checked.map(k => ({
      item: cart[k].item, quantity: cart[k].qty, price: cart[k].price,
      size: cart[k].size || null, addon: cart[k].addon || "None"
    }));
    if (!items.length) return;
    let saved = [];
    try { const raw = localStorage.getItem(ORDER_HISTORY_KEY); saved = raw ? JSON.parse(raw) : []; if (!Array.isArray(saved)) saved = []; } catch { saved = []; }
    saved.push({
      date: new Date().toISOString(), total: selTotal, status: "Pending",
      paymentMethod: payMethod, recipientName: payMethod === "COD" ? recipient.trim() : "",
      deliveryAddress: payMethod === "COD" ? address.trim() : "", items
    });
    localStorage.setItem(ORDER_HISTORY_KEY, JSON.stringify(saved));
    setCart(prev => { const next = {...prev}; checked.forEach(k => delete next[k]); return next; });
    setSelected(new Set());
    setPayOpen(false);
    addToast("Order confirmed via " + payMethod + "! Grilling in progress...");
  }

  const checkedKeys = cartKeys.filter(k => selected.has(k));

  return (
    <>
      <Navbar cartCount={totalItems} onCartToggle={() => setCartOpen(!cartOpen)} />

      {/* ── HERO ── */}
      <section className="menu-hero">
        <div className="hero-title">
          <h1>The Flavor Of Deliciousness</h1>
          <p>Choose your weapon. Slay your hunger.</p>
        </div>
        <div className="scroll-indicator"
          onClick={() => document.getElementById("order-here").scrollIntoView({behavior:"smooth"})}
          style={{position:"relative",bottom:"auto",left:"auto",transform:"none",marginTop:"1.5rem",display:"inline-flex"}}>
          <span></span><span></span><span></span>
        </div>
      </section>

      {/* ── SIZZLING DEALS ── */}
      <section className="deals-section" id="order-here">
        <h2 className="section-title reveal">Today's <span>Sizzling</span> Hits</h2>
        <div className="deals-grid reveal-stagger">
          {DEALS.map((d, i) => (
            <div className="deal-card" key={i}>
              <div className="deal-tag">{d.tag}</div>
              <img src={"/images/" + d.img} alt={d.name} style={{width:"100%",height:"280px",objectFit:"cover",borderRadius:"16px",marginBottom:"1rem"}} />
              <h3>{d.name}</h3>
              <p>{d.desc}</p>
              <div className="price">&#8369;{d.price}</div>
              <button className="add-btn" onClick={() => addToCart(d.name, d.price, null, null, "burger")}></button>
            </div>
          ))}
        </div>
      </section>

      {/* ── CATEGORY TABS ── */}
      <section className="menu-categories">
        <div className={"category-card" + (category==="burgers" ? " active" : "")} onClick={() => setCategory("burgers")}>BURGERS</div>
        <div className={"category-card" + (category==="fries" ? " active" : "")} onClick={() => setCategory("fries")}>SIDES</div>
        <div className={"category-card" + (category==="drinks" ? " active" : "")} onClick={() => setCategory("drinks")}>DRINKS</div>
      </section>

      {/* ── MENU ITEMS ── */}
      <section className="sub-menu-container">
        <div className={"sub-menu" + (category==="burgers" ? " active" : "")}>
          {BURGERS.map((b, i) => (
            <MenuItemCard key={i} img={b.img} name={b.name} desc={b.desc} price={b.price}
              onAdd={() => openAddon(b.key, b.price)} />
          ))}
        </div>
        <div className={"sub-menu" + (category==="fries" ? " active" : "")}>
          {FRIES.map((f, i) => (
            <MenuItemCard key={i} img={f.img} name={f.name} desc={f.desc} price={f.price}
              onAdd={() => openSize(f.name, f.price, "fries")} />
          ))}
        </div>
        <div className={"sub-menu" + (category==="drinks" ? " active" : "")}>
          {DRINKS.map((d, i) => (
            <MenuItemCard key={i} img={d.img} name={d.name} desc={d.desc} price={d.price}
              onAdd={() => d.cat === "other" ? addToCart(d.name, d.price, null, null, "other") : openSize(d.name, d.price, d.cat)} />
          ))}
        </div>
      </section>

      {/* ── SIZE MODAL ── */}
      <div className={"size-overlay" + (sizeModal.open ? " active" : "")} onClick={() => setSizeModal(s => ({...s, open:false}))}>
        <div className="size-modal" onClick={e => e.stopPropagation()}>
          <div className="size-modal-header">
            <span>{sizeModal.editKey ? "Edit Size" : (sizeModal.cat === "drinks" || sizeModal.cat === "juice" ? "Choose Size for Drinks" : "Choose Size for Fries")}</span>
            <button className="size-close" onClick={() => setSizeModal(s => ({...s, open:false}))}>&times;</button>
          </div>
          <div className="size-modal-body">
            <div className="size-prompt">Select a size:</div>
            {(SIZE_CONFIG[sizeModal.cat] || SIZE_CONFIG.fries).map((o, i) => (
              <label key={i} className={"size-option" + (sizeModal.choice === o.label ? " active" : "")}>
                <input type="radio" name="size-option" value={o.label}
                  checked={sizeModal.choice === o.label}
                  onChange={() => setSizeModal(s => ({...s, choice:o.label}))} />
                <strong>{o.label}</strong>
                <span className="size-price">&#8369;{sizeModal.price + o.add}</span>
              </label>
            ))}
          </div>
          <div className="size-modal-actions">
            <button className="size-confirm" onClick={confirmSize}>{sizeModal.editKey ? "Update Cart" : "Add to Cart"}</button>
          </div>
        </div>
      </div>

      {/* ── ADDON MODAL ── */}
      <div className={"size-overlay" + (addonModal.open ? " active" : "")} onClick={() => setAddonModal(a => ({...a, open:false}))}>
        <div className="size-modal" onClick={e => e.stopPropagation()}>
          <div className="size-modal-header">
            <span>{addonModal.editKey ? "Edit Add-ons" : "Add Ingredients"}</span>
            <button className="size-close" onClick={() => setAddonModal(a => ({...a, open:false}))}>&times;</button>
          </div>
          <div className="size-modal-body">
            <div className="size-prompt">Select add-ons:</div>
            {Object.entries(ADDON_PRICES).map(([k, v]) => {
              const isChecked = k === "None" ? addonModal.addons.length === 0 : addonModal.addons.includes(k);
              return (
                <label key={k} className={"size-option" + (isChecked ? " active" : "")}>
                  <input type="checkbox" name="addon-option" value={k}
                    checked={isChecked}
                    onChange={() => toggleAddon(k)} />
                  <strong>{k}</strong>
                  {v !== 0 && <span className="size-price">+{v}</span>}
                </label>
              );
            })}
          </div>
          <div className="size-modal-actions">
            <button className="size-confirm" onClick={confirmAddon}>{addonModal.editKey ? "Update Cart" : "Add to Cart"}</button>
          </div>
        </div>
      </div>

      {/* ── BACKDROP ── */}
      <div className={"backdrop" + (cartOpen || payOpen ? " active" : "")} onClick={() => { setCartOpen(false); setPayOpen(false); }}></div>

      {/* ── CART DRAWER ── */}
      <div className={"cart-overlay" + (cartOpen ? " open" : "")}>
        <div className="cart-header">
          <h2>YOUR TRAY</h2>
          <button className="close-cart" onClick={() => setCartOpen(false)}>&times;</button>
        </div>
        <label className="cart-select-bar">
          <input type="checkbox" checked={allSel}
            ref={el => { if (el) el.indeterminate = !allSel && someSel; }}
            onChange={e => toggleAll(e.target.checked)} />
          <span>{allSel ? "Deselect All" : "Select All"}</span>
        </label>
        <div className="cart-items-scroll">
          {cartKeys.length === 0 ? (
            <div style={{textAlign:"center",padding:"2rem 1rem",fontWeight:700,color:"var(--brown-mid)",opacity:0.6}}>Your tray is empty!</div>
          ) : cartKeys.map(k => {
            const it = cart[k];
            const isSel = selected.has(k);
            const extras = [];
            if (it.size) extras.push("Size: " + it.size);
            if (it.addon && it.addon !== "None") extras.push("+ " + it.addon);
            const isCat = ["fries","drinks","juice"].includes(it.category);
            const basePrice = PRICE_MAP[it.item] || it.price;
            return (
              <div key={k} className={"cart-item-row " + (isSel ? "selected" : "unselected")}>
                <input type="checkbox" className="cart-item-cb" checked={isSel} onChange={e => toggleItem(k, e.target.checked)} />
                <div className="cart-item-info">
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
                    <strong className={"cart-item-name " + (isSel ? "sel" : "unsel")}>{it.item}</strong>
                    {(it.size || it.category === "burger") && (
                      <button className="edit-item-btn" onClick={() => editCartItem(k)} aria-label="Edit item">
                        <i className="fa-solid fa-pen"></i> Edit
                      </button>
                    )}
                  </div>
                  {extras.length > 0 && <><small className="cart-item-extras">{extras.join(" | ")}</small></>}
                  <br />
                  <span className={"cart-item-price " + (isSel ? "sel" : "unsel")}>&#8369;{it.price}</span>
                </div>
                <div className="qty-control">
                  <button className="qty-btn" onClick={() => changeQty(k, -1)}>-</button>
                  <span className="qty-value">{it.qty}</span>
                  {isCat
                    ? <button className="qty-btn" onClick={() => openSize(it.item, basePrice, it.category)}>+</button>
                    : <button className="qty-btn" onClick={() => changeQty(k, 1)}>+</button>
                  }
                </div>
              </div>
            );
          })}
        </div>
        <div className="cart-footer">
          <div style={{display:"flex",justifyContent:"space-between",fontFamily:"var(--font-display)",fontSize:"1.4rem",marginBottom:"0.8rem"}}>
            <span>SELECTED:</span><span>&#8369;{selTotal}</span>
          </div>
          <button className="checkout-btn" onClick={processCheckout}>CHECKOUT NOW</button>
        </div>
      </div>

      {/* ── PAYMENT DRAWER ── */}
      <div className={"payment-overlay" + (payOpen ? " open" : "")}>
        <div className="cart-header">
          <h2 style={{fontFamily:"var(--font-display)",fontSize:"1.3rem",letterSpacing:".04em"}}>CHECKOUT &amp; PAYMENT</h2>
          <button className="close-cart" onClick={closePayment}>&times;</button>
        </div>
        <div className="payment-scroll">
          <h3 style={{marginBottom:"10px",fontSize:"1.1rem",fontWeight:800,textTransform:"uppercase"}}>Order Summary</h3>
          <div className="order-summary-box">
            {checkedKeys.map(k => {
              const it = cart[k];
              const extras = [];
              if (it.size) extras.push(it.size);
              if (it.addon && it.addon !== "None") extras.push(it.addon);
              return (
                <div className="summary-item" key={k}>
                  <span>{it.qty}x {it.item}{extras.length ? " (" + extras.join(", ") + ")" : ""}</span>
                  <span>&#8369;{it.price * it.qty}</span>
                </div>
              );
            })}
          </div>
          <h3 style={{marginBottom:"12px",fontSize:"1.1rem",fontWeight:800,textTransform:"uppercase"}}>Payment Method</h3>
          <div className="payment-option" onClick={() => setPayMethod("COD")}>
            <input type="radio" name="pay-method" checked={payMethod === "COD"} onChange={() => setPayMethod("COD")} />
            <label>Cash on Delivery (COD) <i className="fa-solid fa-money-bill-1-wave" style={{color:"#2d8c4e"}}></i></label>
          </div>

          {/* COD Delivery fields */}
          <div className={"cod-fields-wrap" + (payMethod === "COD" ? " visible" : "") + (shake ? " shake-anim" : "")}>
            <div className="cod-fields-wrap-inner">
              <h4>&#128663; Delivery Details</h4>
              <div className={"delivery-field" + (recipientErr ? " error" : "")}>
                <label htmlFor="cod-recipient">Recipient Name <span style={{color:"var(--red)"}}>*</span></label>
                <input id="cod-recipient" type="text" placeholder="e.g. Juan dela Cruz"
                  value={recipient} onChange={e => setRecipient(e.target.value)} autoComplete="name" />
                <div className="field-error-msg">Please enter the recipient name.</div>
              </div>
              <div className={"delivery-field" + (addressErr ? " error" : "")}>
                <label htmlFor="cod-address">Delivery Address <span style={{color:"var(--red)"}}>*</span></label>
                <textarea id="cod-address" rows="2" placeholder="House/Unit No., Street, Barangay, City"
                  value={address} onChange={e => setAddress(e.target.value)}></textarea>
                <div className="field-error-msg">Please enter a delivery address.</div>
              </div>
            </div>
          </div>
        </div>
        <div className="cart-footer">
          <div style={{display:"flex",justifyContent:"space-between",fontFamily:"var(--font-display)",fontSize:"1.6rem",marginBottom:"0.8rem",color:"var(--red)"}}>
            <span>TOTAL:</span><span>&#8369;{selTotal}</span>
          </div>
          <button className="checkout-btn" onClick={confirmOrder}>PLACE ORDER</button>
        </div>
      </div>

      <div className="footer-bar">&copy; 2026 MIMALICIOUS. ALL RIGHTS RESERVED. WAG KANG MAGPAPAGUTOM! &mdash; DEVELOPED BY PROGRAMIZ</div>
      <Footer />

      {/* ── TOAST CONTAINER ── */}
      <div className="toast-container">
        {toasts.map(t => (
          <div key={t.id} className="mima-toast" onClick={() => setToasts(prev => prev.filter(x => x.id !== t.id))}>
            <i className="fa-solid fa-burger" style={{color: "var(--red)"}}></i>
            <span>{t.msg}</span>
          </div>
        ))}
      </div>
    </>
  );
}
