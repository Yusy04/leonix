/* global React, Icon, HexChip, Avatar, Section, EmptyState */
const { useState, useMemo } = React;

function ProductGlyph({ cat }) {
  const map = { code: '{ }', web: '</>', math: 'Σ', exam: '◆', bac: 'ℝ', lang: 'Aa' };
  const colorMap = { code: 'cat-code', web: 'cat-code', math: 'cat-math', exam: 'cat-exam', bac: 'cat-bac', lang: 'cat-lang' };
  return (
    <div className="prod-glyph mono" style={{ color: `var(--${colorMap[cat]})`, borderColor: `var(--${colorMap[cat]})` + '55' }}>
      {map[cat] || '◆'}
    </div>
  );
}

function ProductCard({ p, navigate }) {
  const cat = p.cat === 'web' ? 'code' : p.cat;
  return (
    <div className="card is-interactive product-card" onClick={() => navigate('product', { slug: p.slug })}>
      <div className="product-card-head">
        <div className="row-between">
          <span className="badge" style={{ color: `var(--cat-${cat})`, borderColor: `var(--cat-${cat})` + '55' }}>
            <span className="badge-dot" style={{background:`var(--cat-${cat})`}}></span>
            {p.catLabel}
          </span>
          <span className="t-xs mono dim">{p.type === 'session' ? 'live + credits' : p.type === 'mixed' ? 'live + self-paced' : 'self-paced'}</span>
        </div>
        <div className="product-card-glyph"><ProductGlyph cat={p.cat}/></div>
      </div>
      <div className="card-body stack-4">
        <h3 style={{fontSize: 22}}>{p.name}</h3>
        <p className="t-sm muted" style={{minHeight: 40}}>{p.tagline}</p>
        <div className="product-courses">
          {p.courses.slice(0, 3).map(c => (
            <div key={c.id} className="row gap-2 t-sm">
              <Icon name={c.mode === 'self' ? 'book' : 'video'} size={12}/>
              <span style={{flex:1}}>{c.name}</span>
              <span className="t-xs mono dim">{c.modules} mod</span>
            </div>
          ))}
          {p.courses.length > 3 && <div className="t-xs mono dim">+ {p.courses.length - 3} more</div>}
        </div>
      </div>
      <div className="card-footer">
        <div className="row gap-2">
          <HexChip value={p.credits.packages[0].credits} unit={p.credits.unit} size="md"/>
          <span className="t-sm strong mono">{p.price}</span>
        </div>
        <span className="btn btn-ghost btn-sm">Open <Icon name="arrow-up-r" size={12}/></span>
      </div>
    </div>
  );
}

function Shop({ navigate, user }) {
  const [cat, setCat] = useState('all');
  const [q, setQ] = useState('');
  const [type, setType] = useState('all');

  const filtered = useMemo(() => PRODUCTS.filter(p => {
    if (cat !== 'all' && p.cat !== cat && !(cat === 'code' && p.cat === 'web')) return false;
    if (type === 'session' && p.type !== 'session') return false;
    if (type === 'self' && p.type === 'session') return false;
    if (q && !p.name.toLowerCase().includes(q.toLowerCase()) && !p.tagline.toLowerCase().includes(q.toLowerCase())) return false;
    return true;
  }), [cat, q, type]);

  return (
    <div className="container-wide">
      <div className="page-header">
        <span className="eyebrow">// shop</span>
        <h1>Browse all products</h1>
        <p className="subtitle">Each product is a credit wallet. Buy credits once, spend them on any course or live session inside that product. Some products also sell standalone self-paced courses.</p>
      </div>

      <div className="shop-toolbar">
        <div className="search" style={{flex:1, maxWidth: 380}}>
          <Icon name="search" size={14}/>
          <input placeholder="Search products…" value={q} onChange={e => setQ(e.target.value)}/>
        </div>
        <div className="tabs">
          <button className={'tab' + (type==='all'?' is-active':'')} onClick={() => setType('all')}>All formats</button>
          <button className={'tab' + (type==='session'?' is-active':'')} onClick={() => setType('session')}>Live + credits</button>
          <button className={'tab' + (type==='self'?' is-active':'')} onClick={() => setType('self')}>Has self-paced</button>
        </div>
      </div>

      <div className="row gap-2 shop-cats" style={{flexWrap:'wrap', marginTop: 16}}>
        {CATEGORIES.map(c => (
          <button key={c.id} className={'tag' + (cat===c.id?' is-active':'')} onClick={() => setCat(c.id)}>
            {c.id !== 'all' && <span className="badge-dot" style={{background:c.color, marginRight:6}}></span>}
            {c.name}
          </button>
        ))}
      </div>

      <div className="grid-3" style={{marginTop:32}}>
        {filtered.map(p => <ProductCard key={p.id} p={p} navigate={navigate}/>)}
      </div>
      {filtered.length === 0 && (
        <EmptyState glyph="∅" title="No products match your filters"
          description="Try clearing search or picking a different category."
          action={<button className="btn btn-secondary" onClick={() => { setCat('all'); setQ(''); setType('all'); }}>Reset filters</button>}/>
      )}
    </div>
  );
}

function ProductDetail({ navigate, user, slug }) {
  const p = productBySlug(slug) || PRODUCTS[0];
  const balance = user.wallets[p.id] || 0;
  const productSessions = SESSIONS.filter(s => s.productId === p.id).slice(0, 6);
  const teacherList = p.teachers.map(teacherById);
  const cat = p.cat === 'web' ? 'code' : p.cat;

  return (
    <div className="container-wide">
      <div className="row gap-2 t-sm dim mono" style={{padding: '24px 0 8px'}}>
        <a onClick={() => navigate('shop')}>shop</a>
        <span>/</span>
        <span style={{color:`var(--cat-${cat})`}}>{p.catLabel}</span>
        <span>/</span>
        <span className="strong">{p.name}</span>
      </div>

      <div className="product-hero">
        <div className="stack-4">
          <span className="badge" style={{ color: `var(--cat-${cat})`, borderColor: `var(--cat-${cat})40` }}>
            <span className="badge-dot" style={{background:`var(--cat-${cat})`}}></span>
            {p.catLabel}
          </span>
          <h1 style={{fontSize:48}}>{p.name}</h1>
          <p className="t-xl muted" style={{maxWidth: 720}}>{p.tagline}</p>
          <div className="row gap-3" style={{flexWrap:'wrap', marginTop:8}}>
            <div className="row gap-2"><Icon name="users" size={14}/><span className="t-sm muted">{teacherList.length} teachers</span></div>
            <div className="row gap-2"><Icon name="book" size={14}/><span className="t-sm muted">{p.courses.length} courses · {p.courses.reduce((a,c)=>a+c.modules,0)} modules</span></div>
            <div className="row gap-2"><Icon name="video" size={14}/><span className="t-sm muted">Live + on-site sessions</span></div>
          </div>
        </div>
        <div className="card card-glow product-hero-side">
          <div className="card-body stack-4">
            <div className="t-xs mono dim uppercase">Your wallet</div>
            <div className="row gap-3">
              <HexChip value={balance} unit={p.credits.unit} size="xl"/>
              <div className="stack-2">
                <div className="strong" style={{fontSize:22}}>{balance} {p.credits.unit} credits</div>
                <div className="t-sm muted">{balance > 0 ? `Enough for ${balance} live sessions` : 'No credits — buy a pack to register'}</div>
              </div>
            </div>
            <div className="row gap-2">
              <button className="btn btn-primary btn-block" onClick={() => navigate('checkout', { product: p.id })}>
                <Icon name="plus" size={14}/> Buy credits
              </button>
            </div>
            {p.courses.some(c => c.mode === 'self') && (
              <div className="t-xs muted" style={{paddingTop:8, borderTop:'1px dashed var(--hairline)'}}>
                Or buy individual self-paced courses below — no credits required.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Pricing */}
      <Section eyebrow="// credit packs" title="Pick a credit pack" >
        <div className="grid-3">
          {p.credits.packages.map((pkg, i) => (
            <div key={i} className={'card pkg-card' + (pkg.popular ? ' is-popular' : '')}>
              {pkg.popular && <span className="pkg-pop badge is-success">Most popular</span>}
              <div className="card-body stack-4">
                <HexChip value={pkg.credits} unit={p.credits.unit} size="xl"/>
                <div className="stack-2">
                  <div className="strong mono" style={{fontSize:36}}>€{pkg.price}</div>
                  <div className="t-sm muted">{pkg.credits} credits · €{(pkg.price/pkg.credits).toFixed(2)} per session</div>
                </div>
                <ul className="pkg-bullets">
                  <li><Icon name="check" size={12}/> Use across all {p.courses.length} courses</li>
                  <li><Icon name="check" size={12}/> Online + on-site sessions</li>
                  <li><Icon name="check" size={12}/> Credits never expire</li>
                </ul>
                <button className={pkg.popular ? 'btn btn-primary btn-block' : 'btn btn-secondary btn-block'}
                        onClick={() => navigate('checkout', { product: p.id, pack: i })}>
                  Buy {pkg.credits} credits
                </button>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* Courses */}
      <Section eyebrow="// what's inside" title={`${p.courses.length} courses included`}>
        <div className="grid-2">
          {p.courses.map(c => (
            <div key={c.id} className="card is-interactive course-listing" onClick={() => navigate('course', { id: c.id })}>
              <div className="card-body stack-3">
                <div className="row-between">
                  <div className="row gap-2">
                    <div className="course-mode-icon">
                      <Icon name={c.mode === 'self' ? 'book' : 'video'} size={14}/>
                    </div>
                    <span className="t-xs mono dim uppercase">{c.mode === 'self' ? 'Self-paced' : 'Live sessions'}</span>
                  </div>
                  {c.mode === 'self' && c.standalonePrice && (
                    <span className="badge is-info">€{c.standalonePrice} standalone</span>
                  )}
                </div>
                <h4>{c.name}</h4>
                <div className="row gap-3 t-sm dim mono">
                  <span>{c.modules} modules</span>
                  {c.mode === 'live' && <span>· 1 cr / session</span>}
                </div>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* Sessions table */}
      <Section eyebrow="// upcoming live" title="Next sessions for this product"
        action={<button className="btn btn-ghost" onClick={() => navigate('calendar')}>Full calendar <Icon name="arrow-r" size={12}/></button>}>
        <div className="card">
          <table className="table">
            <thead>
              <tr><th>When</th><th>Session</th><th>Teacher</th><th>Mode</th><th>Seats</th><th></th></tr>
            </thead>
            <tbody>
              {productSessions.map(s => {
                const t = teacherById(s.teacherId);
                const full = s.registered >= s.capacity;
                return (
                  <tr key={s.id}>
                    <td><div className="strong">{relativeDay(s.startISO)}</div><div className="t-xs dim mono">{formatTime(s.startISO)}</div></td>
                    <td className="strong">{s.title}</td>
                    <td><div className="row gap-2"><Avatar initial={t.initial} hue={t.hue} size="sm"/><span className="t-sm">{t.name}</span></div></td>
                    <td><span className="status mono" style={{color: s.mode==='online'?'var(--info)':'var(--warning)'}}>{s.mode}</span></td>
                    <td className="mono">{s.registered}/{s.capacity}</td>
                    <td>
                      {balance > 0 ? (
                        <button className="btn btn-secondary btn-sm" disabled={full}>{full?'Full':'Register'}</button>
                      ) : (
                        <button className="btn btn-ghost btn-sm" onClick={() => navigate('checkout', { product: p.id })}>Need credits</button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Section>

      {/* Teachers */}
      <Section eyebrow="// taught by" title="Your teachers">
        <div className="grid-3">
          {teacherList.map(t => (
            <div key={t.id} className="card is-interactive teacher-card" onClick={() => navigate('teacher', { id: t.id })}>
              <div className="card-body row gap-3">
                <Avatar initial={t.initial} hue={t.hue} size="lg"/>
                <div className="stack-2" style={{flex:1}}>
                  <div className="strong">{t.name}</div>
                  <div className="t-xs muted">{t.expertise.join(' · ')}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* FAQ */}
      <Section eyebrow="// faq" title="Frequently asked">
        <div className="stack-3">
          {[
            { q: 'Do credits expire?', a: 'No — credits never expire. Buy a pack now and spend them whenever your schedule allows.' },
            { q: `Can I use ${p.credits.unit} credits on other products?`, a: `No. Each product has its own wallet. ${p.credits.unit} credits work only inside ${p.name}, but you can use them across all ${p.courses.length} courses inside it.` },
            { q: 'What happens if a session is full?', a: 'You can join the waitlist. We notify you instantly if a spot opens up, and credit reservation only happens once you confirm a seat.' },
            { q: 'Can I get a refund?', a: 'Within 14 days of purchase, you can request a full refund on unused credits. Sessions you already attended are non-refundable.' },
          ].map((f, i) => <FAQItem key={i} {...f}/>)}
        </div>
      </Section>
    </div>
  );
}

function FAQItem({ q, a }) {
  const [open, setOpen] = useState(false);
  return (
    <div className={'faq' + (open ? ' is-open' : '')}>
      <button className="faq-q" onClick={() => setOpen(o => !o)}>
        <span>{q}</span>
        <Icon name={open ? 'minus' : 'plus'} size={14}/>
      </button>
      {open && <div className="faq-a t-sm muted">{a}</div>}
    </div>
  );
}

Object.assign(window, { Shop, ProductDetail });
