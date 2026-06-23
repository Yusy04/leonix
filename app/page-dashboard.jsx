/* global React, Icon, Avatar, HexChip, ProgressRing, Section */
const { useState } = React;

function Dashboard({ navigate, user }) {
  const myCourses = [
    { id:'cpp-algo', name:'Algorithms & complexity', product:'cpp-mastery', progress: 42, next: 'Two pointers — Sliding window' },
    { id:'web-react', name:'React from scratch',     product:'webdev-fullstack', progress: 18, next: 'useState deep dive' },
  ];
  const upcomingMine = SESSIONS.filter(s => user.registeredSessionIds.includes(s.id));
  const recommended = SESSIONS.filter(s => user.wallets[s.productId] > 0 && !user.registeredSessionIds.includes(s.id)).slice(0, 3);

  return (
    <div className="container-wide">
      <div className="page-header">
        <span className="eyebrow">// dashboard</span>
        <div className="row-between" style={{flexWrap:'wrap', gap:16}}>
          <div className="stack-2">
            <h1>Welcome back, {user.name.split(' ')[0]}</h1>
            <p className="subtitle">{user.streak}-day streak · level {user.level} · {user.xp.toLocaleString()} XP</p>
          </div>
          <div className="row gap-3">
            <button className="btn btn-secondary" onClick={() => navigate('buddy')}><Icon name="sparkle" size={14}/> AI buddy</button>
            <button className="btn btn-primary" onClick={() => navigate('qr')}><Icon name="qr" size={14}/> My QR</button>
          </div>
        </div>
      </div>

      <div className="dash-grid">
        <div className="stack-6" style={{minWidth:0}}>
          {/* Continue learning */}
          <Section eyebrow="// continue learning" title="Pick up where you left off">
            <div className="stack-3">
              {myCourses.map(c => {
                const p = productById(c.product);
                return (
                  <div key={c.id} className="card is-interactive cont-row" onClick={() => navigate('course', { id: c.id })}>
                    <ProgressRing percent={c.progress} size={56}/>
                    <div className="stack-2" style={{flex:1, minWidth:0}}>
                      <div className="t-xs mono dim uppercase">{p.name}</div>
                      <div className="strong" style={{fontSize:18}}>{c.name}</div>
                      <div className="t-sm muted">Next: {c.next}</div>
                    </div>
                    <button className="btn btn-primary btn-sm">Continue <Icon name="arrow-r" size={12}/></button>
                  </div>
                );
              })}
            </div>
          </Section>

          {/* Upcoming sessions */}
          <Section eyebrow="// my sessions" title="Coming up"
            action={<button className="btn btn-ghost btn-sm" onClick={() => navigate('calendar')}>Full calendar</button>}>
            <div className="card">
              {upcomingMine.length === 0 && <div className="card-body muted">No registered sessions yet.</div>}
              {upcomingMine.map(s => {
                const p = productById(s.productId); const t = teacherById(s.teacherId);
                return (
                  <div key={s.id} className="upcoming-row">
                    <div className="upcoming-date">
                      <div className="t-xs mono dim uppercase">{formatDay(s.startISO)}</div>
                      <div className="strong mono" style={{fontSize:24}}>{new Date(s.startISO).getDate().toString().padStart(2,'0')}</div>
                      <div className="t-xs mono dim">{formatTime(s.startISO)}</div>
                    </div>
                    <div className="upcoming-body">
                      <div className="row gap-2"><span className="badge is-success">Registered</span></div>
                      <div className="strong" style={{marginTop:6}}>{s.title}</div>
                      <div className="row gap-2 t-xs dim mono"><Avatar initial={t.initial} hue={t.hue} size="sm"/><span>{t.name}</span><span>·</span><span>{s.mode}</span></div>
                    </div>
                    <button className="btn btn-secondary btn-sm">{s.mode === 'online' ? 'Join Zoom' : 'View QR'}</button>
                  </div>
                );
              })}
            </div>
          </Section>

          {/* Pending homework */}
          <Section eyebrow="// pending" title="Homework & quizzes">
            <div className="card card-body">
              <div className="hw-list">
                <div className="hw-row">
                  <div className="hw-status"><span className="status is-soon mono" style={{fontSize:10}}>3D</span></div>
                  <div className="stack-2" style={{flex:1}}>
                    <div className="strong">Homework: 5 problems · two pointers</div>
                    <div className="t-xs dim mono">cpp-algo · m3 · due in 3 days</div>
                  </div>
                  <button className="btn btn-secondary btn-sm" onClick={() => navigate('course', { id:'cpp-algo' })}>Solve</button>
                </div>
                <div className="hw-row">
                  <div className="hw-status"><span className="status is-soon mono" style={{fontSize:10}}>5D</span></div>
                  <div className="stack-2" style={{flex:1}}>
                    <div className="strong">Quiz: SAT Math algebra fundamentals</div>
                    <div className="t-xs dim mono">sat-math · due in 5 days</div>
                  </div>
                  <button className="btn btn-secondary btn-sm">Start</button>
                </div>
              </div>
            </div>
          </Section>
        </div>

        {/* Sidebar */}
        <aside className="dash-side stack-6">
          <div className="card card-body stack-4">
            <div className="t-xs mono dim uppercase">My credit wallets</div>
            <div className="stack-3">
              {Object.entries(user.wallets).map(([pid, bal]) => {
                const p = productById(pid);
                return (
                  <div key={pid} className="wallet" onClick={() => navigate('product', { slug: p.slug })} style={{cursor:'pointer'}}>
                    <HexChip value={bal} unit={p.credits.unit} size="md"/>
                    <div className="wallet-meta">
                      <div className="wallet-name">{p.name}</div>
                      <div className="wallet-bal">{bal} {p.credits.unit} credits</div>
                    </div>
                    <Icon name="arrow-r" size={12}/>
                  </div>
                );
              })}
            </div>
            <button className="btn btn-secondary btn-block btn-sm" onClick={() => navigate('shop')}><Icon name="plus" size={12}/> Buy more credits</button>
          </div>

          <div className="card card-body stack-3">
            <div className="row-between"><div className="t-xs mono dim uppercase">XP this week</div><span className="brand-fg t-xs mono">+ 320</span></div>
            <div className="strong" style={{fontSize:32}} className="mono">{user.xp.toLocaleString()}</div>
            <div className="progress is-thick"><div className="progress-bar" style={{width: `${user.xp/user.xpNext*100}%`}}/></div>
            <div className="t-xs dim mono">{user.xpNext - user.xp} XP to level {user.level + 1}</div>
            <button className="btn btn-ghost btn-sm" onClick={() => navigate('leaderboard')}><Icon name="trophy" size={12}/> Leaderboard</button>
          </div>

          <div className="card card-body stack-3">
            <div className="t-xs mono dim uppercase">Recommended</div>
            {recommended.map(s => {
              const p = productById(s.productId);
              return (
                <div key={s.id} className="reco-row" onClick={() => navigate('calendar')}>
                  <div className="strong t-sm">{s.title}</div>
                  <div className="t-xs dim mono">{relativeDay(s.startISO)} · {formatTime(s.startISO)} · {p.name}</div>
                </div>
              );
            })}
          </div>
        </aside>
      </div>
    </div>
  );
}

function QRPage({ navigate, user }) {
  const nextPhys = SESSIONS.find(s => s.mode === 'physical');
  return (
    <div className="container">
      <div className="qr-page">
        <div className="page-header" style={{padding:'40px 0 16px'}}>
          <span className="eyebrow">// physical attendance</span>
          <h1>Your check-in QR</h1>
          <p className="subtitle">Show this code at the door to be marked present. Brightness will auto-max when you open this page from a session reminder.</p>
        </div>
        <div className="qr-card">
          <div className="qr-code-wrap">
            <FakeQR seed={user.qrCode}/>
          </div>
          <div className="qr-side stack-4">
            <div>
              <div className="t-xs mono dim uppercase">Code</div>
              <div className="strong mono" style={{fontSize:18, letterSpacing:'0.08em'}}>{user.qrCode}</div>
            </div>
            <div>
              <div className="t-xs mono dim uppercase">Student</div>
              <div className="strong">{user.name}</div>
              <div className="t-sm dim mono">{user.email}</div>
            </div>
            <div>
              <div className="t-xs mono dim uppercase">City</div>
              <div className="strong">{user.city}</div>
            </div>
            {nextPhys && (
              <div className="banner">
                <Icon name="pin" size={14}/>
                <div className="stack-2" style={{flex:1}}>
                  <div className="strong t-sm">{nextPhys.title}</div>
                  <div className="t-xs dim mono">{relativeDay(nextPhys.startISO)} · {formatTime(nextPhys.startISO)} · {nextPhys.location}</div>
                </div>
              </div>
            )}
            <button className="btn btn-secondary btn-block">Download QR</button>
          </div>
        </div>
      </div>
    </div>
  );
}

function FakeQR({ seed }) {
  // generate deterministic 25x25 grid
  const size = 25;
  let h = 0; for (let i=0;i<seed.length;i++) h = (h*31 + seed.charCodeAt(i)) >>> 0;
  const cells = [];
  for (let y=0;y<size;y++) for (let x=0;x<size;x++) {
    h = (h * 16807) % 2147483647;
    const fill = (h % 100) < 48;
    // finder patterns
    const inFinder = (x<7&&y<7) || (x>=size-7&&y<7) || (x<7&&y>=size-7);
    const finderRing = inFinder && (
      (x===0||x===6||y===0||y===6 ||
       (x===size-1)||(x===size-7)||(y===size-7)||(y===size-1)) ||
      ((x>=2&&x<=4&&y>=2&&y<=4) || (x>=size-5&&x<=size-3&&y>=2&&y<=4) || (x>=2&&x<=4&&y>=size-5&&y<=size-3))
    );
    cells.push({x,y, on: inFinder ? finderRing : fill});
  }
  return (
    <svg viewBox={`0 0 ${size} ${size}`} className="qr-svg" shapeRendering="crispEdges">
      <rect width={size} height={size} fill="#0a0e0c"/>
      {cells.filter(c => c.on).map((c,i) => (
        <rect key={i} x={c.x} y={c.y} width="1" height="1" fill="url(#qrgrad)"/>
      ))}
      <defs>
        <linearGradient id="qrgrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#aee0af"/>
          <stop offset="1" stopColor="#71c873"/>
        </linearGradient>
      </defs>
    </svg>
  );
}

Object.assign(window, { Dashboard, QRPage });
