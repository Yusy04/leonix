/* global React, Icon, Avatar, HexChip, ProgressRing, Section, Modal */
const { useState, useMemo } = React;

function Course({ navigate, user, id }) {
  const course = COURSE_CONTENT[id] || COURSE_CONTENT['cpp-algo'];
  const product = productById(course.productId);
  const teacher = teacherById(course.teacher);
  const totalLessons = course.modules.reduce((a,m) => a + m.lessons.length, 0);
  const doneLessons = course.modules.reduce((a,m) => a + m.lessons.filter(l => l.status === 'done').length, 0);
  const progress = Math.round(doneLessons / totalLessons * 100);

  const [activeLesson, setActiveLesson] = useState(() => {
    for (const m of course.modules) for (const l of m.lessons) if (l.status === 'in-progress') return l;
    return course.modules[0].lessons[0];
  });
  const [activeModule, setActiveModule] = useState(() => course.modules.find(m => m.lessons.some(l => l.id === (activeLesson?.id))) || course.modules[0]);

  return (
    <div className="course-page">
      <div className="container-wide course-head">
        <div className="row gap-2 t-sm dim mono">
          <a onClick={() => navigate('shop')}>shop</a><span>/</span>
          <a onClick={() => navigate('product', { slug: product.slug })}>{product.name}</a><span>/</span>
          <span className="strong">{course.name}</span>
        </div>
        <div className="row-between" style={{flexWrap:'wrap', gap:16, marginTop:16}}>
          <div className="stack-3">
            <span className="eyebrow">// course</span>
            <h1 style={{fontSize: 40}}>{course.name}</h1>
            <div className="row gap-3" style={{flexWrap:'wrap'}}>
              <div className="row gap-2"><Avatar initial={teacher.initial} hue={teacher.hue} size="sm"/><span className="t-sm muted">{teacher.name}</span></div>
              <span className="badge"><span className="badge-dot bg-cat-code"></span>{product.catLabel}</span>
              <span className="t-sm muted mono">{course.modules.length} modules · {totalLessons} lessons</span>
            </div>
          </div>
          <div className="card card-pad" style={{display:'flex', alignItems:'center', gap: 16, minWidth: 280}}>
            <ProgressRing percent={progress} size={64}/>
            <div className="stack-2">
              <div className="t-xs mono dim uppercase">Your progress</div>
              <div className="strong">{doneLessons} of {totalLessons} lessons</div>
              <div className="t-xs muted">{progress}% complete</div>
            </div>
          </div>
        </div>
      </div>

      <div className="container-wide course-layout">
        {/* Sidebar */}
        <aside className="course-sidebar">
          <div className="t-xs mono dim uppercase" style={{padding:'16px 18px 8px'}}>Modules</div>
          <div className="modules-list">
            {course.modules.map((m, i) => (
              <div key={m.id} className={'module-block' + (m.status === 'locked' ? ' is-locked' : '')}>
                <div className="module-head">
                  <div className="module-num mono">{i+1 < 10 ? '0'+(i+1) : i+1}</div>
                  <div className="stack-2" style={{flex:1, minWidth:0}}>
                    <div className="strong">{m.title}</div>
                    <div className="t-xs dim mono">{m.lessons.length} lessons</div>
                  </div>
                  {m.status === 'done' && <div className="status is-live"><Icon name="check" size={11}/></div>}
                  {m.status === 'in-progress' && <span className="status is-soon">on</span>}
                  {m.status === 'locked' && <Icon name="lock" size={12}/>}
                </div>
                <div className="lessons-list">
                  {m.lessons.map(l => (
                    <button key={l.id}
                      className={'lesson-row' + (activeLesson?.id === l.id ? ' is-active' : '') + (l.status==='locked'?' is-locked':'')}
                      onClick={() => l.status !== 'locked' && (setActiveLesson(l), setActiveModule(m))}>
                      <span className="lesson-ico">
                        {l.status === 'done' ? <Icon name="check" size={11}/> :
                         l.status === 'locked' ? <Icon name="lock" size={11}/> :
                         l.type === 'quiz' ? <Icon name="flag" size={11}/> :
                         l.type === 'homework' ? <Icon name="doc" size={11}/> :
                         <Icon name="play" size={11}/>}
                      </span>
                      <span className="lesson-title" style={{flex:1}}>{l.title}</span>
                      <span className="t-xs mono dim">{l.durationMin}m</span>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </aside>

        {/* Main */}
        <main className="course-main">
          <LessonView lesson={activeLesson} module={activeModule} course={course} teacher={teacher} navigate={navigate}/>
        </main>
      </div>
    </div>
  );
}

function LessonView({ lesson, module, course, teacher, navigate }) {
  if (!lesson) return null;
  if (lesson.type === 'quiz')     return <QuizView lesson={lesson}/>;
  if (lesson.type === 'homework') return <HomeworkView lesson={lesson}/>;
  if (lesson.status === 'locked') return <LockedView course={course}/>;
  return <LessonContent lesson={lesson} module={module} course={course} teacher={teacher} navigate={navigate}/>;
}

function LessonContent({ lesson, module, course, teacher, navigate }) {
  return (
    <div className="lesson-content stack-6 fade-in">
      <div className="t-xs mono dim uppercase">Module {module.title} · Lesson</div>
      <h2>{lesson.title}</h2>

      {/* Video placeholder */}
      <div className="lesson-video">
        <div className="video-poster">
          <div className="video-grid"></div>
          <button className="video-play"><Icon name="play" size={20}/></button>
          <div className="video-meta mono t-xs">
            <span>cpp-algo · two-pointers.mp4</span>
            <span>{lesson.durationMin}:00</span>
          </div>
        </div>
      </div>

      <div className="lesson-tabs">
        <div className="tabs-underline">
          <button className="tab is-active">Notes</button>
          <button className="tab">Resources</button>
          <button className="tab">Discussion</button>
          <button className="tab">Transcript</button>
        </div>
      </div>

      <div className="lesson-body stack-4">
        <p className="t-lg">
          The two-pointer technique is a way to iterate through a sequence using two indices that move toward each other (or in the same direction at different speeds), drastically reducing what looks like an O(n²) brute force into O(n).
        </p>
        <h3>The pattern in C++</h3>
        <pre className="code-block mono">
{`// Find pair with given sum in a sorted array
int l = 0, r = n - 1;
while (l < r) {
    int s = a[l] + a[r];
    if (s == target) return {l, r};
    if (s < target)  l++;
    else             r--;
}
return {-1, -1};`}
        </pre>
        <p className="t-md muted">
          Notice how each iteration moves at least one pointer. Total work: O(n). The trick is that the array is sorted — sortedness gives you a monotone signal that tells you which pointer to move.
        </p>
        <div className="callout">
          <Icon name="sparkle" size={14}/>
          <div className="stack-2">
            <strong>When to reach for two pointers</strong>
            <p className="t-sm muted">Sorted (or sortable) input · pair / triplet sums · longest substring · meeting in the middle.</p>
          </div>
        </div>
      </div>

      <div className="lesson-footer">
        <button className="btn btn-secondary"><Icon name="arrow-l" size={12}/> Previous lesson</button>
        <button className="btn btn-primary">Mark complete & continue <Icon name="arrow-r" size={12}/></button>
      </div>
    </div>
  );
}

function QuizView({ lesson }) {
  const [picked, setPicked] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const correct = 1;
  const options = [
    { label: 'O(n²)', why: 'Brute force without two pointers.' },
    { label: 'O(n)',  why: 'Each pointer moves at most n times.' },
    { label: 'O(n log n)', why: 'That\'s sorting.' },
    { label: 'O(log n)', why: 'Two pointers visits each element.' },
  ];
  return (
    <div className="lesson-content stack-6 fade-in">
      <div className="t-xs mono dim uppercase">Quiz · {lesson.durationMin} min</div>
      <h2>{lesson.title}</h2>
      <div className="quiz-card">
        <div className="quiz-q t-xl">What is the time complexity of the two-pointer pattern on a sorted array of n elements?</div>
        <div className="quiz-options">
          {options.map((opt, i) => (
            <button key={i}
              className={'quiz-opt' +
                (picked === i ? ' is-picked' : '') +
                (submitted && i === correct ? ' is-correct' : '') +
                (submitted && picked === i && i !== correct ? ' is-wrong' : '')}
              onClick={() => !submitted && setPicked(i)}>
              <span className="quiz-letter mono">{String.fromCharCode(65+i)}</span>
              <span style={{flex:1}}>{opt.label}</span>
              {submitted && i === correct && <Icon name="check" size={14}/>}
            </button>
          ))}
        </div>
        {submitted && (
          <div className={'banner ' + (picked === correct ? 'is-success' : 'is-warning')}>
            <Icon name={picked === correct ? 'check' : 'sparkle'} size={14}/>
            <span>
              {picked === correct
                ? 'Correct — exactly. Each pointer advances at most n times, so total work is linear.'
                : `Not quite. ${options[correct].why} Try the next quiz to lock it in.`}
            </span>
          </div>
        )}
        <div className="row gap-3" style={{justifyContent:'flex-end'}}>
          {submitted ? <button className="btn btn-primary">Continue <Icon name="arrow-r" size={12}/></button>
                     : <button className="btn btn-primary" disabled={picked==null} onClick={() => setSubmitted(true)}>Submit answer</button>}
        </div>
      </div>
    </div>
  );
}

function HomeworkView({ lesson }) {
  return (
    <div className="lesson-content stack-6 fade-in">
      <div className="row gap-2">
        <span className="t-xs mono dim uppercase">Homework</span>
        {lesson.dueIn && <span className="badge is-warning">Due in {lesson.dueIn}</span>}
      </div>
      <h2>{lesson.title}</h2>
      <p className="t-lg muted">Solve all 5 problems and submit your code. Andrei reviews each solution and leaves comments within 48 hours.</p>
      <div className="hw-list">
        {[
          { id: 'p1', title: 'Sliding Window — Max Sum K', diff: 'easy', pts: 6, status: 'done' },
          { id: 'p2', title: 'Two Pointers — Pair Sum',     diff: 'easy', pts: 6, status: 'done' },
          { id: 'p3', title: 'Longest Substring K Distinct', diff: 'medium', pts: 10, status: 'in-progress' },
          { id: 'p4', title: 'Minimum Window Substring',     diff: 'hard', pts: 12, status: 'todo' },
          { id: 'p5', title: 'Subarray Sum = Target',        diff: 'medium', pts: 10, status: 'todo' },
        ].map(p => (
          <div key={p.id} className="hw-row">
            <div className="hw-status">
              {p.status === 'done' ? <Icon name="check" size={12}/> :
               p.status === 'in-progress' ? <span className="status is-soon mono" style={{fontSize:10}}>WIP</span> :
               <span className="t-xs mono dim">·</span>}
            </div>
            <div className="stack-2" style={{flex:1}}>
              <div className="strong">{p.title}</div>
              <div className="row gap-2 t-xs mono dim">
                <span className={'tag tag-diff diff-' + p.diff}>{p.diff}</span>
                <span>{p.pts} points</span>
              </div>
            </div>
            <button className="btn btn-secondary btn-sm">{p.status === 'done' ? 'View' : 'Solve'}</button>
          </div>
        ))}
      </div>
      <div className="row gap-3" style={{justifyContent:'flex-end'}}>
        <button className="btn btn-ghost">Save draft</button>
        <button className="btn btn-primary">Submit all 5 <Icon name="send" size={12}/></button>
      </div>
    </div>
  );
}

function LockedView({ course }) {
  return (
    <div className="lesson-content stack-6 fade-in" style={{textAlign:'center', alignItems:'center'}}>
      <div style={{margin:'40px auto'}} className="empty-state">
        <div className="glyph"><Icon name="lock" size={24}/></div>
        <h3>Module locked</h3>
        <p>Complete the previous module to unlock this content. Each module builds on the last so the difficulty curve stays smooth.</p>
      </div>
    </div>
  );
}

Object.assign(window, { Course });
