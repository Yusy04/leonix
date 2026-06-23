/* global React, ReactDOM */
const { useState, useEffect } = React;

const PRINT_USER = {
  authed: true,
  name: 'Alex Popescu',
  initial: 'A',
  email: 'alex@leonix.dev',
  hue: 145,
  city: 'București',
  qrCode: 'LNX-Y3K9-77AX',
  level: 7, xp: 6420, xpNext: 8000, streak: 12,
  wallets: { 'cpp-mastery': 8, 'webdev-fullstack': 4, 'sat-prep': 18 },
  registeredSessionIds: ['s-001','s-004'],
};

const PAGES = [
  { page: 'home',        title: 'Home — Landing & overview' },
  { page: 'shop',        title: 'Shop — Browse credit packs & courses' },
  { page: 'product',     title: 'Product detail — Competitive C++ Mastery', params: { slug: 'cpp-mastery' } },
  { page: 'course',      title: 'Course player — In-progress lesson', params: { id: 'cpp-mastery' } },
  { page: 'calendar',    title: 'Sessions — Live calendar', },
  { page: 'dashboard',   title: 'Dashboard — Wallet & progress' },
  { page: 'qr',          title: 'QR check-in card' },
  { page: 'blog',        title: 'Blog — Articles & guides' },
  { page: 'article',     title: 'Article — Long-form read', params: { slug: 'how-credits-work' } },
  { page: 'teachers',    title: 'Teachers — Instructor directory' },
  { page: 'teacher',     title: 'Teacher profile — Individual page', params: { id: 't-1' } },
  { page: 'buddy',       title: 'Study buddy — AI tutor chat' },
  { page: 'leaderboard', title: 'Leaderboard — XP rankings' },
  { page: 'checkout',    title: 'Checkout — Purchase a credit pack', params: { slug: 'cpp-mastery' } },
  { page: 'login',       title: 'Login screen' },
  { page: 'register',    title: 'Register — 3-step onboarding' },
];

function PrintApp() {
  const navigate = () => {};

  useEffect(() => {
    document.documentElement.dataset.card = 'glass';
    document.documentElement.dataset.radius = 'rounded';
    document.documentElement.style.setProperty('--brand-hue-shift', 145);
  }, []);

  const renderPage = (p) => {
    const props = { navigate, user: PRINT_USER, ...(p.params || {}) };
    switch (p.page) {
      case 'home':        return <Home {...props}/>;
      case 'shop':        return <Shop {...props}/>;
      case 'product':     return <ProductDetail {...props} slug={p.params.slug}/>;
      case 'course':      return <Course {...props} id={p.params.id}/>;
      case 'calendar':    return <Calendar {...props}/>;
      case 'dashboard':   return <Dashboard {...props}/>;
      case 'qr':          return <QRPage {...props}/>;
      case 'blog':        return <Blog {...props}/>;
      case 'article':     return <Article {...props} slug={p.params.slug}/>;
      case 'teachers':    return <Teachers {...props}/>;
      case 'teacher':     return <TeacherProfile {...props} id={p.params.id}/>;
      case 'buddy':       return <Buddy {...props}/>;
      case 'leaderboard': return <Leaderboard {...props}/>;
      case 'checkout':    return <Checkout {...props} params={p.params}/>;
      case 'login':       return <Login navigate={navigate} onLogin={() => {}}/>;
      case 'register':    return <Register navigate={navigate} onLogin={() => {}}/>;
      default: return null;
    }
  };

  const noChromePages = new Set(['login','register']);

  return (
    <div className="print-doc">
      {/* Cover page */}
      <section className="print-cover">
        <div className="cover-grid">
          <div className="cover-mark">
            <svg width="56" height="56" viewBox="0 0 32 32" fill="none">
              <rect x="2" y="2" width="28" height="28" rx="8" stroke="currentColor" strokeWidth="1.5"/>
              <path d="M10 9V23H22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <circle cx="22" cy="9" r="2.5" fill="currentColor"/>
            </svg>
          </div>
          <div className="cover-eyebrow mono">leonix · prototype walkthrough · v0.1</div>
          <h1 className="cover-title">A credit-based learning platform for sharp minds in Bucharest.</h1>
          <p className="cover-lede">Buy credits. Spend them on live sessions, courses, and one-on-ones. This document walks through every screen of the prototype, page by page.</p>
          <div className="cover-meta">
            <div><span className="mono dim">Pages</span><div className="strong">{PAGES.length}</div></div>
            <div><span className="mono dim">Stack</span><div className="strong">React · CSS</div></div>
            <div><span className="mono dim">Date</span><div className="strong">2026</div></div>
            <div><span className="mono dim">Type</span><div className="strong">Hi-fi prototype</div></div>
          </div>
          <div className="cover-toc">
            <div className="toc-head mono dim">Contents</div>
            <ol className="toc-list">
              {PAGES.map((p, i) => (
                <li key={p.page}>
                  <span className="toc-num mono">{String(i+1).padStart(2,'0')}</span>
                  <span className="toc-title">{p.title}</span>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {PAGES.map((p, i) => (
        <section className="print-page" key={p.page + i}>
          <header className="print-page-head">
            <div className="ph-left">
              <span className="mono dim">{String(i+1).padStart(2,'0')} / {String(PAGES.length).padStart(2,'0')}</span>
              <span className="ph-title">{p.title}</span>
            </div>
            <div className="ph-right mono dim">leonix.dev/{p.page}</div>
          </header>
          <div className="print-page-body">
            {!noChromePages.has(p.page) && <TopNav route={{ page: p.page, params: p.params || {} }} navigate={navigate} user={PRINT_USER}/>}
            <main className="print-main">
              {renderPage(p)}
            </main>
            {!noChromePages.has(p.page) && <Footer navigate={navigate}/>}
          </div>
        </section>
      ))}
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById('app'));
root.render(<PrintApp/>);

// auto-print after fonts + layout are ready
(async () => {
  try {
    if (document.fonts && document.fonts.ready) await document.fonts.ready;
  } catch (e) {}
  // wait for next paint and then a beat for React to settle
  await new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r)));
  await new Promise(r => setTimeout(r, 800));
  if (!window.__skipAutoPrint) window.print();
})();
