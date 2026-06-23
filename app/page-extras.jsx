/* global React, Icon, Avatar, HexChip, ProgressRing, Section */
const { useState, useEffect, useRef } = React;

function Buddy({ navigate, user }) {
  const [messages, setMessages] = useState([
    { role: 'assistant', text: "Hey Alex — I'm your study buddy. I can see you're 30% through Two Pointers in cpp-algo. Want to try a warm-up problem, review a concept, or get unstuck on the homework?" },
  ]);
  const [draft, setDraft] = useState('');
  const [busy, setBusy] = useState(false);

  const send = async (text) => {
    if (!text.trim() || busy) return;
    setMessages(m => [...m, { role:'user', text }]);
    setDraft('');
    setBusy(true);
    try {
      const reply = await window.claude.complete({
        messages: [
          { role: 'user', content:
            `You are leonix's AI study buddy. The student is in C++ algorithms, currently learning two-pointers (30% progress). Be encouraging, concrete, code-light. Reply in 2-4 short paragraphs max. Question: ${text}` }
        ]
      });
      setMessages(m => [...m, { role:'assistant', text: reply }]);
    } catch(e) {
      setMessages(m => [...m, { role:'assistant', text: "I can't reach my brain right now — try again in a moment." }]);
    }
    setBusy(false);
  };

  const suggestions = [
    "Explain two-pointers like I'm 10",
    "Give me a warm-up problem",
    "What's the difference between two-pointer and sliding window?",
    "Quiz me on time complexity",
  ];

  return (
    <div className="container-narrow buddy-page">
      <div className="page-header">
        <div className="row gap-3">
          <div className="buddy-orb"><Icon name="sparkle" size={20}/></div>
          <div className="stack-2">
            <span className="eyebrow">// AI study buddy</span>
            <h1>Stuck? Let's work through it.</h1>
          </div>
        </div>
        <p className="subtitle">Knows your course, your progress, and your past mistakes. Free for all leonix students.</p>
      </div>

      <div className="card buddy-thread">
        <div className="buddy-msgs">
          {messages.map((m, i) => (
            <div key={i} className={'buddy-msg buddy-msg-' + m.role}>
              {m.role === 'assistant' && <div className="buddy-avatar"><Icon name="sparkle" size={12}/></div>}
              <div className="buddy-bubble">{m.text}</div>
            </div>
          ))}
          {busy && <div className="buddy-msg buddy-msg-assistant"><div className="buddy-avatar"><Icon name="sparkle" size={12}/></div><div className="buddy-bubble"><span className="typing"><span/><span/><span/></span></div></div>}
        </div>
        <div className="buddy-suggestions">
          {suggestions.map(s => <button key={s} className="tag" onClick={() => send(s)}>{s}</button>)}
        </div>
        <form className="buddy-input" onSubmit={e => { e.preventDefault(); send(draft); }}>
          <input className="input" placeholder="Ask anything about your course…" value={draft} onChange={e => setDraft(e.target.value)}/>
          <button className="btn btn-primary" disabled={!draft.trim() || busy}><Icon name="send" size={14}/></button>
        </form>
      </div>
    </div>
  );
}

function Leaderboard({ navigate, user }) {
  const [scope, setScope] = useState('global');
  const [period, setPeriod] = useState('week');
  const data = [
    { rank:1, name:'Andrei P.', xp: 12480, hue: 200, you: false, badge:'∞' },
    { rank:2, name:'Maria S.',  xp: 11920, hue: 320, you: false, badge:'★' },
    { rank:3, name:'Vlad I.',   xp: 10310, hue:  80, you: false, badge:'★' },
    { rank:4, name:'Ana C.',    xp:  9870, hue: 280, you: false, badge:'' },
    { rank:5, name:'Mihai R.',  xp:  9540, hue: 140, you: false, badge:'' },
    { rank:6, name:'Alex Popescu', xp: user.xp, hue: 145, you: true,  badge:'' },
    { rank:7, name:'Diana V.',  xp:  4120, hue:  10, you: false, badge:'' },
    { rank:8, name:'Cristi B.', xp:  3960, hue: 160, you: false, badge:'' },
  ];
  return (
    <div className="container-narrow">
      <div className="page-header">
        <span className="eyebrow">// leaderboard</span>
        <h1>Where you stand</h1>
        <p className="subtitle">XP from completed lessons, attended sessions, and homework graded. Resets weekly.</p>
      </div>
      <div className="row gap-3" style={{marginBottom: 16, flexWrap:'wrap'}}>
        <div className="tabs">
          <button className={'tab' + (scope==='global'?' is-active':'')} onClick={() => setScope('global')}>Global</button>
          <button className={'tab' + (scope==='product'?' is-active':'')} onClick={() => setScope('product')}>cpp-mastery</button>
          <button className={'tab' + (scope==='friends'?' is-active':'')} onClick={() => setScope('friends')}>Friends</button>
        </div>
        <div className="tabs">
          <button className={'tab' + (period==='week'?' is-active':'')} onClick={() => setPeriod('week')}>Week</button>
          <button className={'tab' + (period==='month'?' is-active':'')} onClick={() => setPeriod('month')}>Month</button>
          <button className={'tab' + (period==='all'?' is-active':'')} onClick={() => setPeriod('all')}>All time</button>
        </div>
      </div>

      <div className="podium">
        {[data[1], data[0], data[2]].map((p, i) => {
          const cls = ['silver','gold','bronze'][i];
          const heights = [120, 160, 100];
          return (
            <div key={p.rank} className={'podium-col podium-' + cls}>
              <Avatar initial={p.name[0]} hue={p.hue} size="lg"/>
              <div className="strong">{p.name}</div>
              <div className="t-xs mono dim">{p.xp.toLocaleString()} XP</div>
              <div className="podium-block" style={{height: heights[i]}}>
                <span className="mono podium-rank">{p.rank}</span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="card">
        <table className="table">
          <thead><tr><th style={{width:60}}>#</th><th>Student</th><th>XP</th><th>Streak</th><th>Sessions</th></tr></thead>
          <tbody>
            {data.map(p => (
              <tr key={p.rank} className={p.you ? 'is-you' : ''}>
                <td className="mono strong">{p.rank}</td>
                <td><div className="row gap-2"><Avatar initial={p.name[0]} hue={p.hue} size="sm"/><span>{p.name} {p.badge && <span className="brand-fg mono">{p.badge}</span>}{p.you && <span className="badge is-success" style={{marginLeft:6}}>you</span>}</span></div></td>
                <td className="mono">{p.xp.toLocaleString()}</td>
                <td className="mono">{12 - p.rank}d</td>
                <td className="mono">{40 - p.rank * 3}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Checkout({ navigate, user, params }) {
  const product = productById(params?.product || 'cpp-mastery') || PRODUCTS[0];
  const [packIdx, setPackIdx] = useState(params?.pack ?? 1);
  const pack = product.credits.packages[packIdx];
  return (
    <div className="container-narrow">
      <div className="row gap-2 t-sm dim mono" style={{padding:'24px 0'}}>
        <a onClick={() => navigate('product', { slug: product.slug })}>← back to {product.name}</a>
      </div>
      <div className="page-header"><span className="eyebrow">// checkout</span><h1>Buy credits</h1></div>
      <div className="checkout-grid">
        <div className="stack-6">
          <div className="card card-body stack-3">
            <div className="t-xs mono dim uppercase">1 · choose pack</div>
            <div className="stack-3">
              {product.credits.packages.map((p, i) => (
                <label key={i} className={'pack-row' + (packIdx===i?' is-active':'')}>
                  <input type="radio" checked={packIdx===i} onChange={() => setPackIdx(i)}/>
                  <HexChip value={p.credits} unit={product.credits.unit} size="md"/>
                  <div className="stack-2" style={{flex:1}}>
                    <div className="strong">{p.credits} credits {p.popular && <span className="badge is-success">most popular</span>}</div>
                    <div className="t-xs muted">€{(p.price/p.credits).toFixed(2)} per session · never expires</div>
                  </div>
                  <div className="strong mono" style={{fontSize:20}}>€{p.price}</div>
                </label>
              ))}
            </div>
          </div>
          <div className="card card-body stack-3">
            <div className="t-xs mono dim uppercase">2 · payment</div>
            <div className="tabs">
              <button className="tab is-active">Card</button>
              <button className="tab">PayPal</button>
              <button className="tab">SEPA</button>
            </div>
            <div className="field"><label>Card number</label><input className="input mono" defaultValue="4242 4242 4242 4242"/></div>
            <div className="row gap-3">
              <div className="field" style={{flex:1}}><label>Expiry</label><input className="input mono" defaultValue="12 / 28"/></div>
              <div className="field" style={{flex:1}}><label>CVC</label><input className="input mono" defaultValue="•••"/></div>
            </div>
            <div className="field"><label>Name on card</label><input className="input" defaultValue={user.name}/></div>
          </div>
        </div>
        <div className="card card-body stack-4 checkout-summary">
          <div className="t-xs mono dim uppercase">Order summary</div>
          <div className="stack-2"><div className="strong">{product.name}</div><div className="t-xs muted">{pack.credits} {product.credits.unit} credits</div></div>
          <div className="hr"></div>
          <div className="row-between"><span className="muted t-sm">Subtotal</span><span className="mono">€{pack.price.toFixed(2)}</span></div>
          <div className="row-between"><span className="muted t-sm">VAT (19%)</span><span className="mono">€{(pack.price*0.19).toFixed(2)}</span></div>
          <div className="hr"></div>
          <div className="row-between"><span className="strong">Total</span><span className="mono strong" style={{fontSize:22}}>€{(pack.price*1.19).toFixed(2)}</span></div>
          <button className="btn btn-primary btn-block btn-lg" onClick={() => navigate('dashboard')}>Pay €{(pack.price*1.19).toFixed(2)} <Icon name="arrow-r" size={12}/></button>
          <div className="t-xs muted" style={{textAlign:'center'}}>Secure payment via Stripe · 14-day refund window</div>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { Buddy, Leaderboard, Checkout });
