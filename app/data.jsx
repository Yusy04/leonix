/* global React */
// Leonix — Mock data
const { useState, useMemo, useEffect, useRef, createContext, useContext, useCallback } = React;

const CATEGORIES = [
  { id: 'all',  name: 'All products', color: 'var(--fg-muted)' },
  { id: 'code', name: 'Programming',   color: 'var(--cat-code)' },
  { id: 'web',  name: 'Web dev',       color: 'var(--cat-code)' },
  { id: 'math', name: 'Math & SAT',    color: 'var(--cat-math)' },
  { id: 'lang', name: 'Languages',     color: 'var(--cat-lang)' },
  { id: 'exam', name: 'Olimpiads',     color: 'var(--cat-exam)' },
  { id: 'bac',  name: 'Bacalaureat',   color: 'var(--cat-bac)'  },
];

// Products — mix of EN/RO names from the actual shop
const PRODUCTS = [
  {
    id: 'cpp-mastery',
    slug: 'competitive-cpp',
    name: 'Competitive C++ Mastery',
    cat: 'code', catLabel: 'Programming',
    type: 'session',  // session-based with credits
    tagline: 'Master algorithms, data structures and contest tricks for IOI, ACM and OJI.',
    price: 'from 39 €',
    credits: { unit: 'CPP', perSession: 1, packages: [
      { credits: 4,  price: 39, perCredit: 9.75 },
      { credits: 12, price: 99, perCredit: 8.25, popular: true },
      { credits: 32, price: 239, perCredit: 7.47 },
    ]},
    courses: [
      { id: 'cpp-algo', name: 'Algorithms & complexity', modules: 8, mode: 'live' },
      { id: 'cpp-ds',   name: 'Advanced data structures', modules: 6, mode: 'live' },
      { id: 'cpp-grph', name: 'Graphs & DP',              modules: 7, mode: 'live' },
      { id: 'cpp-cont', name: 'Contest archive',          modules: 12, mode: 'self', standalonePrice: 79 },
    ],
    teachers: ['t-andrei', 't-mihai'],
    icon: 'code',
  },
  {
    id: 'webdev-fullstack',
    slug: 'webdev-fullstack',
    name: 'Full-Stack Web Development',
    cat: 'web', catLabel: 'Web dev',
    type: 'mixed',
    tagline: 'From HTML to deployed full-stack apps. React, Node, Postgres, the works.',
    price: 'from 49 €',
    credits: { unit: 'WEB', perSession: 1, packages: [
      { credits: 6,  price: 49 },
      { credits: 16, price: 119, popular: true },
      { credits: 40, price: 269 },
    ]},
    courses: [
      { id: 'web-html', name: 'HTML, CSS & semantics',     modules: 5, mode: 'self', standalonePrice: 29 },
      { id: 'web-js',   name: 'Modern JavaScript',         modules: 8, mode: 'live' },
      { id: 'web-react',name: 'React from scratch',        modules: 10, mode: 'live' },
      { id: 'web-node', name: 'Node, APIs & databases',    modules: 9, mode: 'live' },
    ],
    teachers: ['t-ioana', 't-david'],
    icon: 'web',
  },
  {
    id: 'sat-prep',
    slug: 'new-sat',
    name: 'New SAT — Math + English',
    cat: 'math', catLabel: 'Math & SAT',
    type: 'session',
    tagline: 'Score 1500+ with structured practice across the digital SAT format.',
    price: 'from 59 €',
    credits: { unit: 'SAT', perSession: 1, packages: [
      { credits: 6,  price: 59 },
      { credits: 18, price: 149, popular: true },
      { credits: 48, price: 339 },
    ]},
    courses: [
      { id: 'sat-math', name: 'SAT Math',    modules: 10, mode: 'live' },
      { id: 'sat-eng',  name: 'SAT English', modules: 8,  mode: 'live' },
      { id: 'sat-mock', name: 'Mock tests',  modules: 6,  mode: 'self', standalonePrice: 39 },
    ],
    teachers: ['t-elena', 't-radu'],
    icon: 'sigma',
  },
  {
    id: 'bac-mate',
    slug: 'bacalaureat-matematic',
    name: 'Bacalaureat Matematică',
    cat: 'bac', catLabel: 'Bacalaureat',
    type: 'session',
    tagline: 'Pregătire completă pentru subiectul de matematică, M1 și M2.',
    price: 'from 35 €',
    credits: { unit: 'BAC', perSession: 1, packages: [
      { credits: 6,  price: 35 },
      { credits: 16, price: 89,  popular: true },
      { credits: 36, price: 189 },
    ]},
    courses: [
      { id: 'bac-m1', name: 'Matematică M1', modules: 12, mode: 'live' },
      { id: 'bac-m2', name: 'Matematică M2', modules: 10, mode: 'live' },
    ],
    teachers: ['t-elena'],
    icon: 'sigma',
  },
  {
    id: 'ielts',
    slug: 'ielts',
    name: 'IELTS Academic 7.5+',
    cat: 'lang', catLabel: 'Languages',
    type: 'mixed',
    tagline: 'Speaking, writing, listening and reading drilled to band 7.5+.',
    price: 'from 45 €',
    credits: { unit: 'IELTS', perSession: 1, packages: [
      { credits: 6,  price: 45 },
      { credits: 16, price: 109, popular: true },
      { credits: 40, price: 249 },
    ]},
    courses: [
      { id: 'ielts-speak', name: 'Speaking & pronunciation', modules: 6, mode: 'live' },
      { id: 'ielts-write', name: 'Academic writing',          modules: 8, mode: 'live' },
      { id: 'ielts-mock',  name: 'Full mock papers',          modules: 4, mode: 'self', standalonePrice: 35 },
    ],
    teachers: ['t-ioana'],
    icon: 'lang',
  },
  {
    id: 'ompt',
    slug: 'ompt',
    name: 'OMPT — Olimpiad de programare',
    cat: 'exam', catLabel: 'Olimpiads',
    type: 'session',
    tagline: 'Antrenament intensiv pentru olimpiada națională de programare.',
    price: 'from 55 €',
    credits: { unit: 'OMPT', perSession: 1, packages: [
      { credits: 6,  price: 55 },
      { credits: 18, price: 139, popular: true },
      { credits: 40, price: 279 },
    ]},
    courses: [
      { id: 'ompt-a', name: 'OMPT A — Începători',  modules: 8,  mode: 'live' },
      { id: 'ompt-b', name: 'OMPT B — Intermediari', modules: 10, mode: 'live' },
      { id: 'ompt-c', name: 'OMPT C — Avansați',     modules: 12, mode: 'live' },
    ],
    teachers: ['t-mihai', 't-andrei'],
    icon: 'code',
  },
  {
    id: 'igcse',
    slug: 'cambridge-igcse',
    name: 'Cambridge IGCSE',
    cat: 'exam', catLabel: 'Cambridge',
    type: 'session',
    tagline: 'IGCSE preparation for math, physics, chemistry and computer science.',
    price: 'from 69 €',
    credits: { unit: 'IGCSE', perSession: 1, packages: [
      { credits: 6,  price: 69 },
      { credits: 18, price: 179, popular: true },
      { credits: 48, price: 399 },
    ]},
    courses: [
      { id: 'igcse-math', name: 'Mathematics 0580',   modules: 10, mode: 'live' },
      { id: 'igcse-cs',   name: 'Computer Science 0478', modules: 8, mode: 'live' },
    ],
    teachers: ['t-david', 't-radu'],
    icon: 'sigma',
  },
  {
    id: 'toefl',
    slug: 'toefl',
    name: 'TOEFL iBT 100+',
    cat: 'lang', catLabel: 'Languages',
    type: 'mixed',
    tagline: 'Score 100+ on TOEFL iBT with American academic English drills.',
    price: 'from 39 €',
    credits: { unit: 'TOEFL', perSession: 1, packages: [
      { credits: 6,  price: 39 },
      { credits: 16, price: 99,  popular: true },
      { credits: 40, price: 229 },
    ]},
    courses: [
      { id: 'toefl-int', name: 'Integrated tasks',  modules: 6, mode: 'live' },
      { id: 'toefl-mock',name: 'Mock TOEFL papers', modules: 5, mode: 'self', standalonePrice: 29 },
    ],
    teachers: ['t-ioana'],
    icon: 'lang',
  },
];

const TEACHERS = [
  { id: 't-andrei', name: 'Andrei Popescu',  initial: 'AP', avatar: 'assets/mascots/mentor-cat.png', expertise: ['Algorithms', 'C++', 'IOI'], bio: 'IOI 2014 silver medalist. Coaches the Romanian national team. 8 years teaching competitive programming to kids and teens.', taught: ['cpp-mastery', 'ompt'], hue: 145, sessions: 142, rating: 4.97 },
  { id: 't-mihai',  name: 'Mihai Stoica',    initial: 'MS', avatar: 'assets/mascots/mentor-tiger.png', expertise: ['Graphs', 'DP', 'Contests'], bio: 'ACM ICPC World Finals contestant. Builds the contest archive at leonix and runs the Graphs & DP cohort.', taught: ['cpp-mastery', 'ompt'], hue: 175, sessions: 98, rating: 4.94 },
  { id: 't-ioana',  name: 'Ioana Marin',     initial: 'IM', avatar: 'assets/mascots/mentor-lion.png', expertise: ['React', 'TypeScript', 'IELTS'], bio: 'Senior frontend engineer turned teacher. Cambridge CELTA certified. Teaches both modern React and IELTS speaking.', taught: ['webdev-fullstack', 'ielts', 'toefl'], hue: 95, sessions: 211, rating: 4.99 },
  { id: 't-david',  name: 'David Chen',      initial: 'DC', avatar: 'assets/mascots/mentor-panther.png', expertise: ['Node.js', 'Databases', 'Cambridge'], bio: 'Ex-startup CTO. Teaches the backend track on the Full-Stack programme and Cambridge IGCSE Computer Science.', taught: ['webdev-fullstack', 'igcse'], hue: 200, sessions: 87, rating: 4.91 },
  { id: 't-elena',  name: 'Elena Dumitrescu', initial: 'ED', avatar: 'assets/mascots/mentor-cat.png', expertise: ['SAT Math', 'Bacalaureat', 'Geometry'], bio: 'PhD in pure mathematics. Helped 400+ students score 700+ on SAT Math and 9.5+ on Bacalaureat.', taught: ['sat-prep', 'bac-mate'], hue: 320, sessions: 256, rating: 4.98 },
  { id: 't-radu',   name: 'Radu Ionescu',    initial: 'RI', avatar: 'assets/mascots/mentor-tiger.png', expertise: ['SAT English', 'IGCSE', 'Reading'], bio: 'Oxford English literature graduate. Teaches the verbal & reading sections across SAT, IGCSE and A-Levels.', taught: ['sat-prep', 'igcse'], hue: 35, sessions: 167, rating: 4.93 },
];

TEACHERS.forEach(t => {
  t.title = t.expertise.slice(0,2).join(' · ') + ' mentor';
  t.students = Math.round(t.sessions * 6.4);
});

const teacherById = (id) => TEACHERS.find(t => t.id === id);
const productById = (id) => PRODUCTS.find(p => p.id === id);
const productBySlug = (s) => PRODUCTS.find(p => p.slug === s) || PRODUCTS.find(p => p.id === s);

// Sessions — generate over the next ~21 days
function makeSessions() {
  const out = [];
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  const startMs = now.getTime();
  const sessionTpls = [
    { product: 'cpp-mastery', course: 'cpp-algo', title: 'Greedy & Sliding Window', teacher: 't-andrei', mode: 'online', cap: 30, dur: 90 },
    { product: 'cpp-mastery', course: 'cpp-ds',   title: 'Segment Trees Deep Dive', teacher: 't-mihai',  mode: 'online', cap: 30, dur: 90 },
    { product: 'cpp-mastery', course: 'cpp-grph', title: 'BFS, DFS & shortest paths', teacher: 't-andrei', mode: 'online', cap: 30, dur: 90 },
    { product: 'webdev-fullstack', course: 'web-react', title: 'React Hooks in production', teacher: 't-ioana', mode: 'online', cap: 25, dur: 90 },
    { product: 'webdev-fullstack', course: 'web-node',  title: 'Designing REST APIs', teacher: 't-david',     mode: 'online', cap: 25, dur: 90 },
    { product: 'webdev-fullstack', course: 'web-js',    title: 'Async, Promises & event loop', teacher: 't-ioana', mode: 'online', cap: 25, dur: 90 },
    { product: 'sat-prep',     course: 'sat-math', title: 'Heart of Algebra — drill', teacher: 't-elena', mode: 'online', cap: 20, dur: 75 },
    { product: 'sat-prep',     course: 'sat-eng',  title: 'Reading: detail questions', teacher: 't-radu',  mode: 'physical', loc: 'Bucharest HQ — Room 3', cap: 12, dur: 75 },
    { product: 'bac-mate',     course: 'bac-m1',   title: 'Funcții și limite — exerciții', teacher: 't-elena', mode: 'physical', loc: 'Cluj — Studioul B', cap: 14, dur: 90 },
    { product: 'bac-mate',     course: 'bac-m2',   title: 'Sisteme și determinanți', teacher: 't-elena', mode: 'online', cap: 20, dur: 90 },
    { product: 'ielts',        course: 'ielts-speak', title: 'Speaking part 2: long turn', teacher: 't-ioana', mode: 'online', cap: 8, dur: 60 },
    { product: 'ielts',        course: 'ielts-write', title: 'Task 2: argument essays', teacher: 't-ioana', mode: 'online', cap: 12, dur: 75 },
    { product: 'ompt',         course: 'ompt-c',   title: 'Hard DP problems', teacher: 't-mihai', mode: 'online', cap: 25, dur: 90 },
    { product: 'igcse',        course: 'igcse-math', title: 'Trigonometry workshop', teacher: 't-david', mode: 'physical', loc: 'București — Aula 1', cap: 16, dur: 90 },
    { product: 'toefl',        course: 'toefl-int', title: 'Integrated speaking task', teacher: 't-ioana', mode: 'online', cap: 10, dur: 60 },
  ];

  let id = 1000;
  for (let day = 0; day < 21; day++) {
    const date = new Date(startMs + day * 86400000);
    // 0–4 sessions per day
    const dayOfWeek = date.getDay();
    const count = (dayOfWeek === 0) ? 1 : (dayOfWeek === 6 ? 3 : 3 + (day % 3));
    for (let k = 0; k < count; k++) {
      const tpl = sessionTpls[(day * 3 + k) % sessionTpls.length];
      const hour = 14 + ((day + k * 3) % 7); // 14–20
      const start = new Date(date);
      start.setHours(hour, k % 2 === 0 ? 0 : 30, 0, 0);
      const taken = (id * 7) % tpl.cap;
      out.push({
        id: 's' + (id++),
        productId: tpl.product,
        courseId: tpl.course,
        title: tpl.title,
        teacherId: tpl.teacher,
        mode: tpl.mode,
        location: tpl.loc,
        capacity: tpl.cap,
        registered: taken,
        durationMin: tpl.dur,
        startISO: start.toISOString(),
      });
    }
  }
  return out.sort((a,b) => a.startISO.localeCompare(b.startISO));
}

const SESSIONS = makeSessions();

// User state — wallets, owned courses, progress, registrations
const INITIAL_USER = {
  authed: true,
  name: 'Luca Ionescu',
  email: 'luca.ionescu@example.ro',
  initial: 'LI',
  hue: 145,
  joinedISO: '2025-09-12',
  level: 7,
  xp: 4280,
  xpNext: 5500,
  streak: 12,
  qrCode: 'LNX-7K2P-LUCA-2026',
  city: 'București',
  wallets: {
    'cpp-mastery': 8,
    'webdev-fullstack': 12,
    'sat-prep': 4,
    'bac-mate': 0,
  },
  ownedStandalone: ['cpp-cont', 'web-html'],
  registeredSessionIds: ['s1003','s1006','s1011'],
  completedLessons: new Set(['cpp-algo-l1','cpp-algo-l2','cpp-algo-l3','cpp-algo-l4','web-react-l1','web-react-l2']),
  homeworkPending: ['cpp-algo-hw2', 'sat-math-hw1'],
};

// Course content (for the learning page)
const COURSE_CONTENT = {
  'cpp-algo': {
    productId: 'cpp-mastery',
    name: 'Algorithms & complexity',
    teacher: 't-andrei',
    description: 'Master the algorithmic toolkit used in every contest: greedy, divide & conquer, two pointers, sliding window, and complexity analysis with real OJI problems.',
    modules: [
      { id: 'm1', title: 'Asymptotic complexity', status: 'done', lessons: [
        { id: 'cpp-algo-l1', title: 'Big-O, Big-Theta, Big-Omega', type: 'lesson', durationMin: 18, status: 'done' },
        { id: 'cpp-algo-l2', title: 'Counting operations', type: 'lesson', durationMin: 22, status: 'done' },
        { id: 'cpp-algo-q1', title: 'Quiz: complexity', type: 'quiz', durationMin: 10, status: 'done', score: '9/10' },
      ]},
      { id: 'm2', title: 'Greedy algorithms', status: 'done', lessons: [
        { id: 'cpp-algo-l3', title: 'Exchange arguments', type: 'lesson', durationMin: 24, status: 'done' },
        { id: 'cpp-algo-l4', title: 'Interval scheduling', type: 'lesson', durationMin: 20, status: 'done' },
        { id: 'cpp-algo-hw1', title: 'Homework: 4 greedy problems', type: 'homework', durationMin: 90, status: 'done', score: '34/40' },
      ]},
      { id: 'm3', title: 'Two pointers & sliding window', status: 'in-progress', lessons: [
        { id: 'cpp-algo-l5', title: 'Two pointers introduction', type: 'lesson', durationMin: 18, status: 'in-progress' },
        { id: 'cpp-algo-l6', title: 'Sliding window pattern', type: 'lesson', durationMin: 22, status: 'todo' },
        { id: 'cpp-algo-q2', title: 'Quiz: two pointers', type: 'quiz', durationMin: 12, status: 'todo' },
        { id: 'cpp-algo-hw2', title: 'Homework: 5 problems', type: 'homework', durationMin: 90, status: 'todo', dueIn: '3 days' },
      ]},
      { id: 'm4', title: 'Divide & conquer', status: 'locked', lessons: [
        { id: 'cpp-algo-l7', title: 'Master theorem', type: 'lesson', durationMin: 20, status: 'locked' },
        { id: 'cpp-algo-l8', title: 'Merge sort revisited', type: 'lesson', durationMin: 22, status: 'locked' },
        { id: 'cpp-algo-q3', title: 'Quiz: D&C', type: 'quiz', durationMin: 10, status: 'locked' },
      ]},
      { id: 'm5', title: 'Binary search on the answer', status: 'locked', lessons: [
        { id: 'cpp-algo-l9',  title: 'Pattern & template', type: 'lesson', durationMin: 18, status: 'locked' },
        { id: 'cpp-algo-l10', title: 'Real OJI problems', type: 'lesson', durationMin: 30, status: 'locked' },
      ]},
    ],
  },
};

// Blog posts
const BLOG_POSTS = [
  { id: 'b1', slug: 'segment-trees-explained', title: 'Segment Trees, Explained Like You\'re 12', cat: 'Programming', readMin: 9, dateISO: '2026-04-22', author: 't-mihai', cover: 145, featured: true,
    excerpt: 'A friendly, visual walkthrough of segment trees — from why we need them to lazy propagation, with diagrams and runnable C++.' },
  { id: 'b2', slug: 'react-hooks-pitfalls',     title: '7 React Hooks pitfalls (and how to avoid them)', cat: 'Web dev',     readMin: 7, dateISO: '2026-04-18', author: 't-ioana', cover: 95, featured: true,
    excerpt: 'Stale closures, infinite renders, missing deps. The hook traps that trip up junior and senior devs alike.' },
  { id: 'b3', slug: 'sat-math-strategy',         title: 'The 4-step SAT Math strategy that gets you 750+', cat: 'Math & SAT',  readMin: 6, dateISO: '2026-04-14', author: 't-elena', cover: 200,
    excerpt: 'Stop solving every problem the long way. Here\'s the 4-step framework I teach all my students.' },
  { id: 'b4', slug: 'cum-sa-treci-bacul',         title: 'Cum să iei 9.5+ la Bacalaureat la matematică', cat: 'Bacalaureat', readMin: 8, dateISO: '2026-04-10', author: 't-elena', cover: 320,
    excerpt: 'Un plan de 8 săptămâni pentru subiectul de matematică — cu exerciții, formule și sfaturi de timp.' },
  { id: 'b5', slug: 'graph-dp',                   title: 'Graph DP: from beginner to OJI', cat: 'Programming', readMin: 12, dateISO: '2026-04-04', author: 't-andrei', cover: 175,
    excerpt: 'A deep dive into bitmask DP, tree DP and DP on DAGs with annotated solutions.' },
  { id: 'b6', slug: 'ielts-speaking-band-8',      title: 'How I went from band 6 to band 8 in IELTS Speaking', cat: 'Languages',   readMin: 5, dateISO: '2026-03-28', author: 't-ioana', cover: 35,
    excerpt: 'A student\'s journey, with the exact prompts, drills and feedback loop we used.' },
];

// Tweak defaults
const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "cardStyle": "glass",
  "radius": "rounded",
  "creditViz": "hex",
  "userState": "logged-in"
}/*EDITMODE-END*/;

// Format helpers
function formatDate(iso, opts) {
  const d = new Date(iso);
  return d.toLocaleDateString('en-US', opts || { month: 'short', day: 'numeric' });
}
function formatTime(iso) {
  const d = new Date(iso);
  return d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
}
function formatDay(iso) {
  const d = new Date(iso);
  return d.toLocaleDateString('en-US', { weekday: 'short' });
}
function dayKey(iso) {
  return iso.substring(0, 10);
}
function relativeDay(iso) {
  const d = new Date(iso); d.setHours(0,0,0,0);
  const today = new Date(); today.setHours(0,0,0,0);
  const diff = Math.round((d - today) / 86400000);
  if (diff === 0) return 'Today';
  if (diff === 1) return 'Tomorrow';
  if (diff < 7 && diff > 0) return formatDate(iso, { weekday: 'long' });
  return formatDate(iso, { month: 'short', day: 'numeric' });
}

// Export to window
Object.assign(window, {
  CATEGORIES, PRODUCTS, TEACHERS, SESSIONS, INITIAL_USER, COURSE_CONTENT, BLOG_POSTS, TWEAK_DEFAULTS,
  teacherById, productById, productBySlug,
  formatDate, formatTime, formatDay, dayKey, relativeDay,
});
