/* global React, Icon, Avatar, Section */
const { useState } = React;

function BlogCard({ post, navigate, large }) {
  const t = teacherById(post.author);
  return (
    <div className={'card is-interactive blog-card' + (large ? ' is-large' : '')} onClick={() => navigate('article', { slug: post.slug })}>
      <div className="blog-cover" style={{
        background: `linear-gradient(135deg, oklch(0.4 0.13 ${post.cover}), oklch(0.18 0.06 ${(post.cover+40)%360}))`,
      }}>
        <div className="blog-cover-grid"></div>
        <div className="blog-cover-glyph mono">{post.cat[0]}{post.cat[1]}</div>
      </div>
      <div className="card-body stack-3">
        <div className="row gap-2 t-xs mono dim">
          <span style={{color:`oklch(0.7 0.13 ${post.cover})`}}>{post.cat}</span>
          <span>·</span>
          <span>{formatDate(post.dateISO, { month:'short', day:'numeric' })}</span>
          <span>·</span>
          <span>{post.readMin} min</span>
        </div>
        <h3 style={{fontSize: large ? 24 : 18}}>{post.title}</h3>
        <p className="t-sm muted">{post.excerpt}</p>
        <div className="row gap-2 t-xs dim" style={{marginTop:4}}>
          <Avatar initial={t.initial} hue={t.hue} size="sm"/>
          <span>{t.name}</span>
        </div>
      </div>
    </div>
  );
}

function Blog({ navigate }) {
  const [tag, setTag] = useState('all');
  const cats = ['all', ...new Set(BLOG_POSTS.map(p => p.cat))];
  const filtered = tag === 'all' ? BLOG_POSTS : BLOG_POSTS.filter(p => p.cat === tag);
  const featured = filtered.find(p => p.featured) || filtered[0];
  const rest = filtered.filter(p => p.id !== featured.id);

  return (
    <div className="container-wide">
      <div className="page-header">
        <span className="eyebrow-slash">// Blog</span>
        <h1>Tutorials, deep dives &amp; student stories</h1>
        <p className="subtitle">Written by our teachers and top students. Long-form, opinionated, code-heavy.</p>
      </div>

      <div className="row gap-2" style={{flexWrap:'wrap', marginBottom: 24}}>
        {cats.map(t => (
          <button key={t} className={'tag' + (tag===t?' is-active':'')} onClick={() => setTag(t)}>
            {t === 'all' ? 'All topics' : t}
          </button>
        ))}
      </div>

      {featured && (
        <div className="card is-interactive blog-feature" onClick={() => navigate('article', { slug: featured.slug })}>
          <div className="blog-cover" style={{
            background: `linear-gradient(135deg, oklch(0.4 0.13 ${featured.cover}), oklch(0.18 0.06 ${(featured.cover+40)%360}))`,
            height: 280
          }}>
            <div className="blog-cover-grid"></div>
            <div className="blog-cover-glyph mono" style={{fontSize:96}}>{featured.cat[0]}{featured.cat[1]}</div>
          </div>
          <div className="card-body stack-3">
            <div className="t-xs mono dim uppercase">Featured · {featured.cat}</div>
            <h2>{featured.title}</h2>
            <p className="t-lg muted">{featured.excerpt}</p>
            <div className="row gap-2 t-sm dim">
              <Avatar initial={teacherById(featured.author).initial} hue={teacherById(featured.author).hue} size="sm"/>
              <span>{teacherById(featured.author).name}</span><span>·</span>
              <span>{formatDate(featured.dateISO,{month:'short',day:'numeric',year:'numeric'})}</span><span>·</span>
              <span>{featured.readMin} min</span>
            </div>
          </div>
        </div>
      )}

      <div className="grid-3" style={{marginTop:32}}>
        {rest.map(p => <BlogCard key={p.id} post={p} navigate={navigate}/>)}
      </div>
    </div>
  );
}

function Article({ navigate, slug }) {
  const post = BLOG_POSTS.find(p => p.slug === slug) || BLOG_POSTS[0];
  const author = teacherById(post.author);
  return (
    <div className="container-narrow article">
      <div className="row gap-2 t-sm dim mono" style={{padding:'24px 0'}}>
        <a onClick={() => navigate('blog')}>← back to blog</a>
      </div>
      <div className="stack-4">
        <div className="t-xs mono dim uppercase" style={{color:`oklch(0.7 0.13 ${post.cover})`}}>{post.cat}</div>
        <h1 className="article-title">{post.title}</h1>
        <p className="t-xl muted">{post.excerpt}</p>
        <div className="row gap-3 t-sm dim" style={{padding:'8px 0', borderTop:'1px solid var(--hairline)', borderBottom:'1px solid var(--hairline)'}}>
          <Avatar initial={author.initial} hue={author.hue} size="md"/>
          <div className="stack-2">
            <span className="strong" style={{color:'var(--fg)'}}>{author.name}</span>
            <span className="t-xs mono">{formatDate(post.dateISO,{month:'long',day:'numeric',year:'numeric'})} · {post.readMin} min read</span>
          </div>
        </div>
      </div>
      <div className="article-body stack-4">
        <p className="t-lg" style={{fontSize:20, lineHeight:1.7}}>
          When students hit a wall in algorithms, it's almost never because the syntax tripped them up. It's because they don't have a mental model for the technique they're trying to apply.
        </p>
        <p>
          Take two pointers. On paper it's a four-line trick — two indices, one moves left-to-right, the other right-to-left, you stop when they meet. In practice, students stare at the problem statement for twenty minutes wondering whether two pointers even applies here.
        </p>
        <h2>The signal you're looking for</h2>
        <p>
          A two-pointer solution is hiding behind any of these clues: the input is sorted (or sortable), you're asked for a pair / triplet, you want the longest or shortest contiguous something. When you see them, your default move should be to reach for two pointers before brute force.
        </p>
        <pre className="code-block mono">
{`int l = 0, r = n - 1;
while (l < r) {
    if (cond(l, r)) return {l, r};
    if (move_left(l, r)) l++;
    else                 r--;
}`}
        </pre>
        <p>
          The key insight: each iteration moves exactly one pointer. Total work is O(n), not O(n²). That's the entire payoff.
        </p>
        <h2>How we teach it at leonix</h2>
        <p>
          Every cohort starts with the same five problems. Pair sum. Container with most water. Three sum. Trapping rain water. Minimum window substring. The first three click in the live session. The last two are homework — they're the ones that prove you actually understood the technique versus just copying the pattern.
        </p>
        <div className="callout">
          <Icon name="sparkle" size={14}/>
          <div className="stack-2">
            <strong>Try it yourself</strong>
            <p className="t-sm muted">Algorithms & Complexity, module 3, has all five problems with auto-graded tests and Andrei's video walkthroughs.</p>
          </div>
        </div>
        <p>
          Want to keep going? The next lesson covers sliding window — the same idea but with both pointers moving in the same direction. The handoff between the two patterns is where most students stall, and we cover it in the live session that runs every other Tuesday.
        </p>
      </div>
      <div className="article-footer">
        <button className="btn btn-secondary"><Icon name="arrow-l" size={12}/> Previous</button>
        <button className="btn btn-secondary">Next <Icon name="arrow-r" size={12}/></button>
      </div>
    </div>
  );
}

function Teachers({ navigate }) {
  return (
    <div className="container-wide">
      <div className="page-header">
        <span className="eyebrow">// teaching team</span>
        <h1>Meet your teachers</h1>
        <p className="subtitle">Engineers, mathematicians and exam coaches who've actually built and shipped — now teaching the next cohort.</p>
      </div>
      <div className="grid-3">
        {TEACHERS.map(t => (
          <div key={t.id} className="card is-interactive teacher-card" onClick={() => navigate('teacher', { id: t.id })}>
            <div className="card-body stack-4">
              <Avatar initial={t.initial} hue={t.hue} size="xl"/>
              <div className="stack-2">
                <h3>{t.name}</h3>
                <div className="t-sm muted">{t.title}</div>
              </div>
              <p className="t-sm muted">{t.bio}</p>
              <div className="row gap-1" style={{flexWrap:'wrap'}}>
                {t.expertise.map(e => <span key={e} className="tag">{e}</span>)}
              </div>
              <div className="row gap-3 t-xs mono dim" style={{paddingTop:8, borderTop:'1px dashed var(--hairline)'}}>
                <span><Icon name="star" size={10}/> {t.rating}</span>
                <span>{t.sessions} sessions</span>
                <span>{t.students} students</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function TeacherProfile({ navigate, id }) {
  const t = teacherById(id) || TEACHERS[0];
  const upcoming = SESSIONS.filter(s => s.teacherId === t.id).slice(0, 5);
  return (
    <div className="container-wide">
      <div className="row gap-2 t-sm dim mono" style={{padding:'24px 0'}}>
        <a onClick={() => navigate('teachers')}>← all teachers</a>
      </div>
      <div className="teacher-hero">
        <Avatar initial={t.initial} hue={t.hue} size="2xl"/>
        <div className="stack-3">
          <span className="eyebrow">// teacher</span>
          <h1 style={{fontSize:42}}>{t.name}</h1>
          <div className="t-lg muted">{t.title}</div>
          <div className="row gap-3" style={{flexWrap:'wrap'}}>
            {t.expertise.map(e => <span key={e} className="tag">{e}</span>)}
          </div>
          <div className="row gap-4 t-sm mono dim" style={{paddingTop:8, borderTop:'1px dashed var(--hairline)'}}>
            <span><Icon name="star" size={12}/> {t.rating} · top 1%</span>
            <span>{t.sessions} sessions</span>
            <span>{t.students} students</span>
          </div>
        </div>
      </div>
      <Section eyebrow="// about" title="Background"><p className="t-lg">{t.bio}</p></Section>
      <Section eyebrow="// upcoming" title="Next sessions">
        <div className="card">
          {upcoming.map(s => (
            <div key={s.id} className="upcoming-row">
              <div className="upcoming-date">
                <div className="t-xs mono dim uppercase">{formatDay(s.startISO)}</div>
                <div className="strong mono" style={{fontSize:24}}>{new Date(s.startISO).getDate().toString().padStart(2,'0')}</div>
                <div className="t-xs mono dim">{formatTime(s.startISO)}</div>
              </div>
              <div className="upcoming-body"><div className="strong">{s.title}</div><div className="t-xs dim mono">{productById(s.productId).name} · {s.mode}</div></div>
              <button className="btn btn-secondary btn-sm">View</button>
            </div>
          ))}
        </div>
      </Section>
    </div>
  );
}

function Login({ navigate, onLogin }) {
  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-side">
          <div className="logo-mark"><span className="mono brand-fg">{'{'}</span><span className="mono">leonix</span><span className="mono brand-fg">{'}'}</span></div>
          <h2 style={{marginTop:32}}>Welcome back.</h2>
          <p className="muted t-md">Pick up where you left off — your progress, credits and registered sessions are waiting.</p>
          <div className="auth-quotes">
            <blockquote>"Three months in, my SAT math jumped 180 points. The live sessions are unreal."</blockquote>
            <cite className="t-xs mono dim">— Andrei P., 12th grade, București</cite>
          </div>
        </div>
        <form className="auth-form stack-4" onSubmit={e => { e.preventDefault(); onLogin(); }}>
          <span className="eyebrow">// log in</span>
          <h1>Sign in to leonix</h1>
          <div className="field"><label>Email</label><input className="input" type="email" defaultValue="alex@leonix.dev"/></div>
          <div className="field"><label>Password</label><input className="input" type="password" defaultValue="••••••••"/></div>
          <div className="row-between">
            <label className="row gap-2 t-sm"><input type="checkbox" defaultChecked/> Remember me</label>
            <a className="t-sm">Forgot password?</a>
          </div>
          <button className="btn btn-primary btn-block btn-lg" type="submit">Sign in <Icon name="arrow-r" size={12}/></button>
          <div className="auth-divider"><span>or</span></div>
          <div className="row gap-2">
            <button type="button" className="btn btn-secondary btn-block">Google</button>
            <button type="button" className="btn btn-secondary btn-block">GitHub</button>
          </div>
          <div className="t-sm dim" style={{textAlign:'center', marginTop:8}}>
            New here? <a onClick={() => navigate('register')}>Create an account</a>
          </div>
        </form>
      </div>
    </div>
  );
}

function Register({ navigate, onLogin }) {
  const [step, setStep] = useState(0);
  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-side">
          <div className="logo-mark"><span className="mono brand-fg">{'{'}</span><span className="mono">leonix</span><span className="mono brand-fg">{'}'}</span></div>
          <h2 style={{marginTop:32}}>Start in 3 steps.</h2>
          <ol className="auth-steps">
            <li className={step>=0?'is-active':''}><span className="step-n mono">01</span> Account basics</li>
            <li className={step>=1?'is-active':''}><span className="step-n mono">02</span> Your goals</li>
            <li className={step>=2?'is-active':''}><span className="step-n mono">03</span> First product</li>
          </ol>
        </div>
        <div className="auth-form stack-4">
          <span className="eyebrow">// step 0{step+1} of 03</span>
          {step === 0 && <>
            <h1>Create account</h1>
            <div className="field"><label>Full name</label><input className="input" defaultValue="Ana Popescu"/></div>
            <div className="field"><label>Email</label><input className="input" defaultValue="ana@example.com"/></div>
            <div className="field"><label>Password</label><input className="input" type="password" defaultValue="••••••••"/></div>
            <button className="btn btn-primary btn-block btn-lg" onClick={() => setStep(1)}>Continue <Icon name="arrow-r" size={12}/></button>
          </>}
          {step === 1 && <>
            <h1>What are you here for?</h1>
            <p className="t-sm muted">We'll personalize your home page. You can pick more than one.</p>
            <div className="grid-2 stack-3">
              {[
                { glyph:'{}', name:'Programming' },
                { glyph:'∑', name:'Math olympiad' },
                { glyph:'◆', name:'Bacalaureat' },
                { glyph:'◇', name:'SAT prep' },
                { glyph:'</>', name:'Web dev' },
                { glyph:'Aa', name:'Languages' },
              ].map(g => (
                <label key={g.name} className="goal-card">
                  <input type="checkbox"/>
                  <span className="goal-glyph mono">{g.glyph}</span>
                  <span className="strong">{g.name}</span>
                </label>
              ))}
            </div>
            <div className="row gap-2"><button className="btn btn-secondary" onClick={() => setStep(0)}>Back</button><button className="btn btn-primary btn-block" onClick={() => setStep(2)}>Continue</button></div>
          </>}
          {step === 2 && <>
            <h1>Pick your first product</h1>
            <p className="t-sm muted">You can buy credits later. This just sets up your home page.</p>
            <div className="stack-3">
              {PRODUCTS.slice(0,3).map(p => (
                <label key={p.id} className="prod-pick">
                  <input type="radio" name="prod" defaultChecked={p===PRODUCTS[0]}/>
                  <div className="stack-2"><div className="strong">{p.name}</div><div className="t-xs muted">{p.tagline}</div></div>
                </label>
              ))}
            </div>
            <div className="row gap-2"><button className="btn btn-secondary" onClick={() => setStep(1)}>Back</button><button className="btn btn-primary btn-block" onClick={onLogin}>Finish setup</button></div>
          </>}
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { Blog, Article, Teachers, TeacherProfile, Login, Register });
