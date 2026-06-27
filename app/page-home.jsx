/* global React, Icon, Avatar, Section */
const { useState, useEffect, useMemo } = React;

function Home({ navigate, user }) {
  return (
    <div className="home-v2">
      <Hero navigate={navigate}/>
      <SelfLearning navigate={navigate}/>
      <LiveSessions navigate={navigate} user={user}/>
      <Mentors navigate={navigate}/>
      <ProblemArchive navigate={navigate}/>
      <GetStarted navigate={navigate}/>
      <Community navigate={navigate}/>
    </div>
  );
}

/* ---------------- 1 · HERO ---------------- */
function Hero({ navigate }) {
  const feats = [
    { icon: 'book',    label: 'Self Learning Online Courses', route: 'shop' },
    { icon: 'sparkle', label: 'Problem Archive — AI Support Agent for self-training', route: 'archive' },
    { icon: 'users',   label: 'Find Mentors and be part of the community', route: 'teachers' },
  ];
  return (
    <section className="hero2">
      <div className="container-wide hero2-inner">
        <div className="hero2-copy">
          <span className="eyebrow-slash fade-in">v0.52 — Autumn 2026 release</span>
          <h1 className="hero2-title fade-in delay-1">
            Learn programming, algorithmics and AI software development
            <span className="hero2-title-accent"> through our platform:</span>
          </h1>
          <div className="hero2-feats fade-in delay-2">
            {feats.map((f, i) => (
              <div key={i} className="hud hud-row" onClick={() => navigate(f.route)}>
                <span className="hud-corners"></span>
                <span className="hud-ico"><Icon name={f.icon} size={24}/></span>
                <span className="hud-divider"></span>
                <span className="hud-label">{f.label}</span>
                <span className="hud-chev"><Icon name="chev-r" size={18}/></span>
              </div>
            ))}
          </div>
        </div>

        <div className="hero2-visual fade-in delay-2">
          <img src="assets/mascots/hero-cat.png" className="mascot hero2-cat" alt="" width="462" height="263"/>
          <img src="assets/mascots/cat-paws-tail.png" className="mascot hero2-paws" alt="" width="394" height="184"/>
          <div className="term hero2-term">
            <div className="term-bar">
              <span className="term-dots"><i style={{background:'#f06464'}}></i><i style={{background:'#f5b461'}}></i><i style={{background:'#54e817'}}></i></span>
              <span className="t-xs dim mono">~/leonix-live-session — cpp-algo</span>
              <span className="status is-live mono" style={{fontSize:11, color:'var(--brand-400)'}}>LIVE</span>
            </div>
            <div className="term-body">
              <div className="tl"><span className="g">$</span> leonix register --session "Greedy &amp; Sliding Window"</div>
              <div className="tl dim">- seat reserved : 7 / 10 students</div>
              <div className="tl dim">- joining <span className="g">online</span> course at 18:00...</div>
              <div className="tl">&nbsp;</div>
              <div className="tl"><span className="g">$</span> leonix progress --course cpp-algo</div>
              <div className="tl">&nbsp;</div>
              <div className="term-prog"><span className="dim">m1 &gt; Asymptotic complexity</span><span className="g">100%</span></div>
              <div className="term-prog"><span className="dim">m2 &gt; Greedy algorithms</span><span className="g">100%</span></div>
              <div className="term-prog"><span style={{color:'var(--fg-strong)'}}>m3 &gt; Two pointers</span><span className="amber">30%</span></div>
              <div className="term-prog"><span className="dim">m4 &gt; Divide &amp; conquer</span><span className="dim">locked</span></div>
              <div className="tl">&nbsp;</div>
              <div className="tl"><span className="g">$</span> leonix <span className="g">suggest</span> --problems</div>
              <div className="tl dim">- updated personalized list</div>
              <div className="tl dim">- type ./start-training for self-training module</div>
              <div className="tl"><span className="g">$</span> <span className="term-cursor"></span></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------------- 2 · SELF-LEARNING ---------------- */
function SelfLearning({ navigate }) {
  const courses = [
    { cat: 'PROGRAMMING', glyph: '{ }', title: 'Introduction to C++', desc: 'Learn programming languages starting with C++.', tags: ['Functions', 'STL', 'OOP'], slug: 'competitive-cpp' },
    { cat: 'WEB DEV', glyph: '</>', title: 'Full-Stack Web Development', desc: 'Learn modern web development step by step, from HTML foundations to deployed full-stack apps.', tags: ['HTML, CSS & semantics', 'Modern JavaScript', 'React: from scratch'], slug: 'webdev-fullstack' },
    { cat: 'ALGORITHMICS', glyph: 'Σ', title: 'Introduction in Algorithmics', desc: 'Learn core algorithms and problem solving techniques.', tags: ['Binary Search', 'Backtracking', 'Quick Sort'], slug: 'new-sat' },
  ];
  return (
    <section className="container-wide sect">
      <div className="self-grid">
        <div className="self-left">
          <span className="eyebrow-slash">// Self - learning online courses</span>
          <h2 className="self-title">Start your first self - learning online course in small steps</h2>
          <div className="self-mascot-wrap">
            <div className="mascot-radar"></div>
            <img src="assets/mascots/tiger-glasses.png" className="mascot self-mascot" alt="" width="540" height="538"/>
          </div>
        </div>
        <div className="self-right">
          {courses.map((c, i) => (
            <div key={i} className="hud course-hud" onClick={() => navigate('product', { slug: c.slug })}>
              <span className="hud-corners"></span>
              <div className="course-hud-top">
                <span className="course-badge mono">● {c.cat}</span>
                <div className="course-glyph mono">{c.glyph}</div>
              </div>
              <h3 className="course-hud-title">{c.title}</h3>
              <p className="course-hud-desc">{c.desc}</p>
              <div className="course-hud-foot">
                <div className="course-chips">
                  {c.tags.map(t => <span key={t} className="chip">{t}</span>)}
                </div>
                <span className="more-link">more <Icon name="arrow-r" size={15}/></span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------- 3 · LIVE SESSIONS ---------------- */
function LiveSessions({ navigate, user }) {
  const sessions = SESSIONS.slice(0, 4);
  return (
    <section className="container-wide sect live-sect">
      <div className="row-between live-head" style={{flexWrap:'wrap', gap:16}}>
        <div className="stack-3">
          <span className="eyebrow-slash">// Work live with a mentor</span>
          <h2>Upcoming Live Sessions</h2>
        </div>
        <button className="btn btn-glow btn-lg" onClick={() => navigate('calendar')}>
          <Icon name="calendar" size={16}/> Full Calendar <Icon name="arrow-r" size={14}/>
        </button>
      </div>

      <div className="live-wrap">
        <img src="assets/mascots/tiger-buff.png" className="mascot live-mascot" alt="" width="387" height="633"/>
        <div className="hud live-card">
          <span className="hud-corners"></span>
          {sessions.map((s, i) => {
            const t = teacherById(s.teacherId);
            const p = productById(s.productId);
            const cat = p.cat === 'web' ? 'code' : p.cat;
            const full = s.registered >= s.capacity;
            return (
              <div key={s.id} className="live-row">
                <div className="live-date">
                  <div className="t-xs mono dim uppercase">{formatDay(s.startISO)}</div>
                  <div className="live-day mono">{new Date(s.startISO).getDate().toString().padStart(2,'0')}</div>
                  <div className="t-xs mono dim">{formatTime(s.startISO)}</div>
                </div>
                <div className="live-body">
                  <div className="row gap-3" style={{flexWrap:'wrap'}}>
                    <span className="live-tag mono" style={{color:`var(--cat-${cat})`}}>● {p.name.toUpperCase()}</span>
                    <span className="live-mode mono"><span className="live-mode-dot" style={{background:'var(--cat-math)'}}></span>{s.mode === 'online' ? 'ONLINE' : 'ON-SITE'}</span>
                  </div>
                  <div className="live-title">{s.title}</div>
                  <div className="row gap-2 t-sm dim">
                    <span className="live-tavatar" style={{background:`linear-gradient(135deg, oklch(0.55 0.13 ${t.hue}), oklch(0.3 0.08 ${(t.hue+40)%360}))`}}>{t.initial}</span>
                    <span>{t.name}</span><span>·</span>
                    <Icon name="clock" size={12}/><span>{s.durationMin} min</span>
                  </div>
                </div>
                <div className="live-tail">
                  <div className="t-sm mono dim">{s.registered}/{s.capacity} seats</div>
                  <button className="btn btn-glow btn-sm" disabled={full} onClick={() => navigate('calendar')}>{full ? 'Full' : 'Register'}</button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <div className="live-cta">
        <button className="btn btn-glow btn-lg" onClick={() => navigate('shop')}>
          <Icon name="users" size={16}/> See all Live Courses <Icon name="arrow-r" size={14}/>
        </button>
      </div>
    </section>
  );
}

/* ---------------- 4 · MENTORS ---------------- */
function Mentors({ navigate }) {
  const mentors = ['t-andrei', 't-mihai', 't-ioana', 't-david'].map(teacherById);
  return (
    <section className="container-wide sect mentors-sect">
      <img src="assets/mascots/lion-head.png" className="mascot mentors-lion" alt="" width="490" height="327"/>
      <div className="row-between mentors-head" style={{flexWrap:'wrap', gap:16}}>
        <div className="stack-3">
          <span className="eyebrow-slash">// Mentors</span>
          <h2 className="mentors-title">Explore our Mentors</h2>
        </div>
        <button className="btn btn-glow btn-lg" onClick={() => navigate('teachers')}>All teachers <Icon name="arrow-r" size={14}/></button>
      </div>
      <div className="mentors-grid">
        {mentors.map(t => (
          <div key={t.id} className="mentor-card" onClick={() => navigate('teacher', { id: t.id })}>
            <div className="mentor-ava">
              <img src={t.avatar} alt={t.name}/>
            </div>
            <h3 className="mentor-name">{t.name}</h3>
            <div className="mentor-tags">
              {t.expertise.map(e => <span key={e} className="mentor-tag">{e}</span>)}
            </div>
            <button className="btn btn-glow btn-sm mentor-btn">read more</button>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ---------------- 5 · PROBLEM ARCHIVE ---------------- */
function ProblemArchive({ navigate }) {
  const cards = [
    { icon: 'trophy',    title: 'Olympiad\nProblems' },
    { icon: 'briefcase', title: 'Interview\nProblems' },
    { icon: 'doc',       title: 'Romanian\nBaccalaureate Tests' },
    { icon: 'brain',     title: 'CS Knowledge\nQuizzes' },
  ];
  const stats = [
    { icon: 'target', num: '10K+', label: 'Problems' },
    { icon: 'chart',  num: '25+',  label: 'Categories' },
    { icon: 'users',  num: '50K+', label: 'Active Learners' },
  ];
  return (
    <section className="container-wide sect">
      <div className="hud archive-panel is-glow">
        <span className="hud-corners"></span>
        <div className="archive-left">
          <span className="eyebrow-slash">// Problem Archive</span>
          <h2 className="archive-title">Explore our<br/>Problem Archive</h2>
          <p className="archive-desc">
            Sharpen your skills with a curated collection of challenges across competitive programming and computer science.
            Use the AI self-training tool to optimize your working schedule.
          </p>
          <div className="archive-cards">
            {cards.map((c, i) => (
              <div key={i} className="hud archive-card" onClick={() => navigate('archive')}>
                <span className="hud-corners"></span>
                <span className="archive-card-ico"><Icon name={c.icon} size={26}/></span>
                <span className="archive-card-title">{c.title.split('\n').map((l,j,arr) => <React.Fragment key={j}>{l}{j < arr.length-1 ? <br/> : null}</React.Fragment>)}</span>
                <span className="archive-card-chev"><Icon name="arrow-r" size={18}/></span>
              </div>
            ))}
          </div>
          <div className="hud archive-tagline">
            <span className="hud-corners"></span>
            <span className="archive-paw"><Icon name="paw" size={22}/></span>
            <div className="stack-2" style={{flex:1}}>
              <span className="mono" style={{color:'var(--brand-400)', fontSize:14}}>Thousands of problems. Endless growth.</span>
              <span className="t-sm dim mono">Track progress, solve smarter, level up.</span>
            </div>
            <button className="btn btn-glow archive-grow-btn">LEARN. CONNECT. GROW.</button>
          </div>
        </div>
        <div className="archive-right">
          <img src="assets/mascots/panther-metal.png" className="mascot archive-panther" alt="" width="656" height="616"/>
          <div className="archive-stats">
            {stats.map((s, i) => (
              <div key={i} className="archive-stat">
                <span className="archive-stat-ico"><Icon name={s.icon} size={22}/></span>
                <div className="stack-2">
                  <span className="archive-stat-num mono">{s.num}</span>
                  <span className="t-xs dim">{s.label}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------------- 6 · GET STARTED ---------------- */
function GetStarted({ navigate }) {
  return (
    <section className="container-wide sect">
      <div className="hud getstarted is-glow">
        <span className="hud-corners"></span>
        <div className="getstarted-copy">
          <span className="eyebrow-slash">// Get started</span>
          <h2 className="getstarted-title">Your next milestone is <span className="hero2-title-accent">one account away</span></h2>
          <p className="getstarted-desc">Register on our platform, start your self-learning and self-training journey or find a mentor who can challenge your dreams.</p>
          <div className="row gap-3" style={{flexWrap:'wrap'}}>
            <button className="btn btn-glow btn-lg getstarted-btn" onClick={() => navigate('login')}>
              <Icon name="arrow-l" size={16}/> Login
            </button>
            <button className="btn btn-glow btn-lg getstarted-btn" onClick={() => navigate('register')}>
              <Icon name="user" size={16}/> Register
            </button>
          </div>
        </div>
        <div className="getstarted-art">
          <img src="assets/mascots/paw-print.png" alt="" className="getstarted-paw"/>
        </div>
      </div>
    </section>
  );
}

/* ---------------- 7 · COMMUNITY ---------------- */
function Community({ navigate }) {
  const socials = [
    { name: 'Facebook',  cta: 'Follow us', color: '#1877F2', icon: <path d="M22 12a10 10 0 1 0-11.6 9.9v-7H7.9V12h2.5V9.8c0-2.5 1.5-3.9 3.8-3.9 1.1 0 2.2.2 2.2.2v2.5h-1.2c-1.2 0-1.6.75-1.6 1.5V12h2.7l-.4 2.9h-2.3v7A10 10 0 0 0 22 12z" fill="#1877F2"/> },
    { name: 'Instagram', cta: 'Follow us', grad: true, icon: <><defs><linearGradient id="ig" x1="0" y1="1" x2="1" y2="0"><stop offset="0" stopColor="#FEDA75"/><stop offset="0.4" stopColor="#FA7E1E"/><stop offset="0.7" stopColor="#D62976"/><stop offset="1" stopColor="#962FBF"/></linearGradient></defs><rect x="2.5" y="2.5" width="19" height="19" rx="5.5" fill="url(#ig)"/><circle cx="12" cy="12" r="4.2" fill="none" stroke="#fff" strokeWidth="1.7"/><circle cx="17.2" cy="6.8" r="1.2" fill="#fff"/></> },
    { name: 'TikTok',    cta: 'Follow us', color: '#fff', icon: <path d="M16.5 3c.3 2.2 1.6 3.6 3.5 3.8v2.6c-1.3.1-2.5-.3-3.5-1v6.1c0 3.4-2.7 5.5-5.6 4.8C8 20.8 6.4 18.4 7 15.9c.5-2.1 2.4-3.5 4.6-3.3v2.7c-.4-.1-.8-.1-1.2 0-1 .3-1.6 1.2-1.4 2.2.2 1.2 1.5 1.8 2.6 1.3.8-.4 1.1-1.1 1.1-2V3h3.8z" fill="#fff"/> },
    { name: 'Discord',   cta: 'Join us',   color: '#5865F2', icon: <path d="M19.5 5.5A16 16 0 0 0 15.5 4l-.3.5a13 13 0 0 1 3.5 1.7 13 13 0 0 0-11.4 0A13 13 0 0 1 10.8 4.5L10.5 4A16 16 0 0 0 6.5 5.5C4 9.2 3.3 12.8 3.6 16.4A16 16 0 0 0 8.5 19l.6-1a10 10 0 0 1-1.7-.8l.4-.3a11 11 0 0 0 9.4 0l.4.3a10 10 0 0 1-1.7.8l.6 1a16 16 0 0 0 4.9-2.6c.4-4.2-.6-7.8-2.9-11.1zM9.5 14.3c-.8 0-1.4-.7-1.4-1.6s.6-1.6 1.4-1.6 1.5.7 1.4 1.6c0 .9-.6 1.6-1.4 1.6zm5 0c-.8 0-1.4-.7-1.4-1.6s.6-1.6 1.4-1.6 1.5.7 1.4 1.6c0 .9-.6 1.6-1.4 1.6z" fill="#5865F2"/> },
  ];
  return (
    <section className="container-wide sect community-sect">
      <div className="hud community-panel">
        <span className="hud-corners"></span>
        <div className="community-left">
          <span className="eyebrow-slash">// Join our community</span>
          <h2 className="community-title">Join our community</h2>
          <p className="community-desc">Follow Leonix, connect with other learners, and stay close to the community.</p>
          <div className="social-grid">
            {socials.map((s, i) => (
              <a key={i} className="hud social-card">
                <span className="hud-corners"></span>
                <span className="social-ico"><svg width="34" height="34" viewBox="0 0 24 24">{s.icon}</svg></span>
                <div className="stack-2">
                  <span className="social-name">{s.name}</span>
                  <span className="social-cta">{s.cta} <Icon name="arrow-r" size={13}/></span>
                </div>
              </a>
            ))}
          </div>
          <div className="hud contact-card is-glow">
            <span className="hud-corners"></span>
            <div className="contact-head"><Icon name="message" size={18}/> <span className="strong" style={{color:'var(--brand-400)', fontWeight:700, fontSize:18}}>Contact</span></div>
            <div className="contact-rows">
              <span className="contact-row"><Icon name="message" size={15}/> Office@leonix.info</span>
              <span className="contact-divider"></span>
              <span className="contact-row"><Icon name="bell" size={15}/> +40722533025</span>
            </div>
          </div>
          <div className="community-console">
            <span className="community-paw"><Icon name="paw" size={20}/></span>
            <div className="mono t-sm">
              <div><span style={{color:'var(--brand-400)'}}>console</span>.log(<span style={{color:'var(--brand-300)'}}>"Welcome to the Leonix Community"</span>);</div>
              <div className="dim">// Learn. Connect. Grow.</div>
            </div>
          </div>
        </div>
        <div className="community-right">
          <img src="assets/mascots/robot-cat.png" alt="" className="community-robot"/>
        </div>
      </div>
    </section>
  );
}

Object.assign(window, { Home });
