/* global React, Icon, Avatar, HexChip, Section, Modal, EmptyState */
const { useState, useMemo } = React;

function Calendar({ navigate, user }) {
  const [view, setView] = useState('week'); // week | list
  const [filterMode, setFilterMode] = useState('all');
  const [filterCat, setFilterCat] = useState('all');
  const [activeSession, setActiveSession] = useState(null);
  const [weekOffset, setWeekOffset] = useState(0);

  const now = new Date(); now.setHours(0,0,0,0);
  const weekStart = new Date(now);
  // Start week on Monday
  const dow = now.getDay() === 0 ? 6 : now.getDay() - 1;
  weekStart.setDate(weekStart.getDate() - dow + weekOffset * 7);
  const days = Array.from({length: 7}, (_, i) => {
    const d = new Date(weekStart); d.setDate(d.getDate() + i); return d;
  });

  const filtered = SESSIONS.filter(s => {
    if (filterMode !== 'all' && s.mode !== filterMode) return false;
    if (filterCat !== 'all') {
      const p = productById(s.productId);
      const cat = p.cat === 'web' ? 'code' : p.cat;
      if (cat !== filterCat) return false;
    }
    return true;
  });

  const byDay = days.map(d => ({
    date: d,
    sessions: filtered.filter(s => dayKey(s.startISO) === dayKey(d.toISOString())),
  }));

  return (
    <div className="container-wide">
      <div className="page-header">
        <span className="eyebrow">// global calendar</span>
        <h1>All upcoming sessions</h1>
        <p className="subtitle">Every live session across every product. Sessions you have credits for show in green; locked ones need a credit pack first.</p>
      </div>

      <div className="cal-toolbar">
        <div className="row gap-3" style={{flexWrap:'wrap'}}>
          <div className="tabs">
            <button className={'tab' + (view==='week'?' is-active':'')} onClick={() => setView('week')}>Week</button>
            <button className={'tab' + (view==='list'?' is-active':'')} onClick={() => setView('list')}>List</button>
          </div>
          <div className="tabs">
            <button className={'tab' + (filterMode==='all'?' is-active':'')} onClick={() => setFilterMode('all')}>All</button>
            <button className={'tab' + (filterMode==='online'?' is-active':'')} onClick={() => setFilterMode('online')}>Online</button>
            <button className={'tab' + (filterMode==='physical'?' is-active':'')} onClick={() => setFilterMode('physical')}>On-site</button>
          </div>
        </div>
        {view === 'week' && (
          <div className="row gap-2">
            <button className="btn btn-secondary btn-sm" onClick={() => setWeekOffset(o => o-1)}><Icon name="arrow-l" size={12}/></button>
            <span className="t-sm mono dim" style={{minWidth: 180, textAlign:'center'}}>
              {formatDate(days[0].toISOString(), {month:'short', day:'numeric'})} – {formatDate(days[6].toISOString(), {month:'short', day:'numeric'})}
            </span>
            <button className="btn btn-secondary btn-sm" onClick={() => setWeekOffset(o => o+1)}><Icon name="arrow-r" size={12}/></button>
            <button className="btn btn-ghost btn-sm" onClick={() => setWeekOffset(0)}>Today</button>
          </div>
        )}
      </div>
      <div className="row gap-2 shop-cats" style={{flexWrap:'wrap', marginTop:12}}>
        {CATEGORIES.map(c => (
          <button key={c.id} className={'tag' + (filterCat===c.id?' is-active':'')} onClick={() => setFilterCat(c.id)}>
            {c.id !== 'all' && <span className="badge-dot" style={{background:c.color, marginRight:6}}></span>}
            {c.name}
          </button>
        ))}
      </div>

      {view === 'week' ? (
        <div className="cal-week">
          {byDay.map((d, i) => (
            <div key={i} className="cal-day">
              <div className="cal-day-head">
                <div className="t-xs mono dim uppercase">{d.date.toLocaleDateString('en-US',{weekday:'short'})}</div>
                <div className={'cal-day-num mono' + (d.date.getTime() === now.getTime() ? ' is-today' : '')}>
                  {d.date.getDate().toString().padStart(2,'0')}
                </div>
              </div>
              <div className="cal-day-body">
                {d.sessions.length === 0 && <div className="t-xs dim mono" style={{textAlign:'center', padding:'20px 0'}}>—</div>}
                {d.sessions.map(s => {
                  const p = productById(s.productId);
                  const cat = p.cat === 'web' ? 'code' : p.cat;
                  const balance = user.wallets[s.productId] || 0;
                  const canRegister = balance > 0;
                  const isRegistered = user.registeredSessionIds.includes(s.id);
                  const full = s.registered >= s.capacity;
                  return (
                    <button key={s.id} className={'cal-event ' + (isRegistered?'is-registered ':'') + (canRegister?'has-credits ':'') + (full?'is-full ':'')}
                      onClick={() => setActiveSession(s)}
                      style={{ '--cat-c': `var(--cat-${cat})` }}>
                      <div className="cal-evt-time mono t-xs">{formatTime(s.startISO)}</div>
                      <div className="cal-evt-title">{s.title}</div>
                      <div className="cal-evt-meta t-xs">
                        <span className="mono dim">{p.credits.unit}</span>
                        <span className="dim">·</span>
                        <span className="mono dim">{s.mode === 'online' ? '◷' : '◉'} {s.registered}/{s.capacity}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <CalendarList sessions={filtered.slice(0, 30)} user={user} onPick={setActiveSession} navigate={navigate}/>
      )}

      <div className="cal-legend">
        <span className="row gap-2"><span className="cal-leg-dot" style={{background:'var(--brand-500)'}}></span> You're registered</span>
        <span className="row gap-2"><span className="cal-leg-dot" style={{background:'rgba(113,200,115,0.4)'}}></span> You have credits — can register</span>
        <span className="row gap-2"><span className="cal-leg-dot" style={{background:'rgba(255,255,255,0.1)'}}></span> Need credits</span>
        <span className="row gap-2"><span className="cal-leg-dot" style={{background:'var(--danger)'}}></span> Full</span>
      </div>

      {activeSession && <SessionModal session={activeSession} user={user} onClose={() => setActiveSession(null)} navigate={navigate}/>}
    </div>
  );
}

function CalendarList({ sessions, user, onPick }) {
  // group by day
  const byDay = {};
  sessions.forEach(s => { const k = dayKey(s.startISO); (byDay[k] = byDay[k] || []).push(s); });
  return (
    <div className="stack-6" style={{marginTop: 24}}>
      {Object.entries(byDay).map(([k, list]) => (
        <div key={k} className="stack-3">
          <div className="row gap-3">
            <h3 style={{fontSize:18}}>{relativeDay(list[0].startISO)}</h3>
            <span className="t-xs mono dim">{formatDate(list[0].startISO, { weekday:'long', month:'short', day:'numeric' })}</span>
          </div>
          <div className="card">
            {list.map((s, i) => {
              const p = productById(s.productId);
              const t = teacherById(s.teacherId);
              const cat = p.cat === 'web' ? 'code' : p.cat;
              const balance = user.wallets[s.productId] || 0;
              const isRegistered = user.registeredSessionIds.includes(s.id);
              return (
                <button key={s.id} className="cal-list-row" onClick={() => onPick(s)}>
                  <div className="mono t-sm" style={{minWidth: 60}}>{formatTime(s.startISO)}</div>
                  <span className="badge-dot" style={{background:`var(--cat-${cat})`}}></span>
                  <div className="stack-2" style={{flex:1, minWidth:0}}>
                    <div className="strong">{s.title}</div>
                    <div className="t-xs dim mono">{p.name} · {t.name}</div>
                  </div>
                  <span className="status mono" style={{color: s.mode==='online'?'var(--info)':'var(--warning)', fontSize:10}}>{s.mode}</span>
                  {isRegistered ? <span className="badge is-success">Registered</span>
                                 : balance > 0 ? <span className="badge is-success">{balance} cr</span>
                                                : <span className="badge is-locked"><Icon name="lock" size={10}/> need credits</span>}
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}

function SessionModal({ session, user, onClose, navigate }) {
  const p = productById(session.productId);
  const t = teacherById(session.teacherId);
  const cat = p.cat === 'web' ? 'code' : p.cat;
  const balance = user.wallets[session.productId] || 0;
  const isRegistered = user.registeredSessionIds.includes(session.id);
  const full = session.registered >= session.capacity;

  return (
    <Modal open={true} onClose={onClose}>
      <div className="card-header" style={{borderBottom:'1px solid var(--hairline)'}}>
        <div className="row gap-2">
          <span className="badge" style={{ color: `var(--cat-${cat})`, borderColor: `var(--cat-${cat})40` }}>
            <span className="badge-dot" style={{background:`var(--cat-${cat})`}}></span>
            {p.name}
          </span>
          <span className="status mono" style={{color: session.mode==='online'?'var(--info)':'var(--warning)'}}>{session.mode}</span>
        </div>
        <button className="btn btn-ghost btn-icon btn-sm" onClick={onClose}><Icon name="close" size={14}/></button>
      </div>
      <div className="card-body stack-6">
        <div>
          <div className="t-xs mono dim uppercase">{relativeDay(session.startISO)} · {formatTime(session.startISO)} · {session.durationMin} min</div>
          <h2 style={{fontSize: 28, marginTop:8}}>{session.title}</h2>
        </div>
        <p className="t-md muted">A focused {session.durationMin}-minute live workshop with active practice. Cameras optional, questions encouraged. Recording is sent to all attendees within 24 hours.</p>

        <div className="session-meta">
          <div><div className="t-xs dim mono uppercase">Teacher</div><div className="row gap-2"><Avatar initial={t.initial} hue={t.hue} size="sm"/><span className="t-sm strong">{t.name}</span></div></div>
          <div><div className="t-xs dim mono uppercase">{session.mode === 'online' ? 'Where' : 'Location'}</div>
               <div className="t-sm strong row gap-2"><Icon name={session.mode==='online'?'video':'pin'} size={12}/>{session.mode === 'online' ? 'Zoom · link sent 30 min before' : session.location}</div></div>
          <div><div className="t-xs dim mono uppercase">Cost</div>
               <div className="row gap-2"><HexChip value={1} unit={p.credits.unit}/><span className="t-sm strong">1 {p.credits.unit} credit</span></div></div>
          <div><div className="t-xs dim mono uppercase">Seats</div><div className="t-sm strong mono">{session.registered} / {session.capacity}</div></div>
        </div>

        {isRegistered ? (
          <div className="banner is-success">
            <Icon name="check" size={14}/>
            <span>You're registered for this session. We'll send a reminder 1 hour before.</span>
          </div>
        ) : balance > 0 ? (
          <div className="stack-3">
            <div className="banner is-success">
              <Icon name="wallet" size={14}/>
              <span>You have <strong>{balance} {p.credits.unit}</strong> credits — enough for {balance} sessions.</span>
            </div>
            <button className="btn btn-primary btn-lg btn-block" disabled={full}>
              {full ? 'Session is full — join waitlist' : 'Register · spend 1 credit'}
            </button>
          </div>
        ) : (
          <div className="stack-3">
            <div className="banner is-warning">
              <Icon name="lock" size={14}/>
              <span>You don't have any {p.credits.unit} credits yet. Buy a pack to register.</span>
            </div>
            <button className="btn btn-primary btn-lg btn-block" onClick={() => navigate('checkout', { product: p.id })}>
              Buy {p.credits.unit} credits
            </button>
          </div>
        )}
      </div>
    </Modal>
  );
}

Object.assign(window, { Calendar });
