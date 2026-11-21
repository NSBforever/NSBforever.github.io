/**
 * content.js — EVERYTHING written on the site lives here.
 *
 * Edit text, projects, experience, skills and links below; the layout code in
 * render.js turns these objects into HTML. You should never need to touch the
 * other files to update content.
 *
 * Logos: `icon` fields are Simple Icons slugs (https://simpleicons.org — the
 * slug is the lowercase name in the icon's URL). Some brands (OpenAI, VS Code)
 * aren't on Simple Icons; leave those empty to show the name only.
 */

const GITHUB_USER = 'NSBforever';
const GITHUB = `https://github.com/${GITHUB_USER}`;
const LINKEDIN = 'https://www.linkedin.com/in/sai-baba-nagi-reddy-02257836a/';
const YOUTUBE = 'https://www.youtube.com/@nsbforever';
const EMAIL = 'nagireddysaibaba321@gmail.com';

/* ---------- Project images (one place for every card picture) ----------
 * Key = GitHub repo name. 16:10 pictures, ideally 1600×1000 WebP, in assets/projects/.
 * To change one, drop a new file in with the same name, or point its entry at another file.
 * A repo with no entry (e.g. a new one picked up from GitHub) gets a drawn cover instead.
 */
const PROJECT_IMAGES = {
  DiskFrame: ['assets/projects/diskframe.webp', 'DiskFrame: “Your drives, as a gallery” beside a grid of photo and video tiles'],
  'stashley-showcase': ['assets/projects/stashley.webp', 'Stashley: “Don’t just save it. Stashley it.” beside sorted bookmark cards'],
  'stock-trend-predictor': ['assets/projects/stock-trend-predictor.svg', ''],
  'AI-Prompt-Story-Generator': ['assets/projects/ai-prompt-story-generator.svg', ''],
  'EDA-Course-Project': ['assets/projects/eda-course-project.svg', ''],
};
const projectImage = (repo) => {
  const [image = '', alt = ''] = PROJECT_IMAGES[repo] || [];
  return { image, alt };
};

/* ---------- Skills (also used for the "technologies" count in the hero) ---------- */
const skillGroups = [
  { name: 'Languages', items: [
    { name: 'TypeScript', icon: 'typescript' }, { name: 'JavaScript', icon: 'javascript' }, { name: 'Python', icon: 'python' },
    { name: 'Rust', icon: 'rust' }, { name: 'Kotlin', icon: 'kotlin' }, { name: 'HTML / CSS', icon: 'html5' },
  ] },
  { name: 'Frontend & Desktop', items: [
    { name: 'React', icon: 'react' }, { name: 'Next.js', icon: 'nextdotjs' }, { name: 'Vite', icon: 'vite' },
    { name: 'Electron', icon: 'electron' }, { name: 'PWAs', icon: 'pwa' }, { name: 'Streamlit', icon: 'streamlit' },
  ] },
  { name: 'Backend & Data', items: [
    { name: 'Node.js', icon: 'nodedotjs' }, { name: 'FastAPI', icon: 'fastapi' }, { name: 'PostgreSQL', icon: 'postgresql' },
    { name: 'Supabase', icon: 'supabase' }, { name: 'SQLite', icon: 'sqlite' }, { name: 'Jupyter', icon: 'jupyter' },
  ] },
  { name: 'Tools & Platforms', items: [
    { name: 'Git', icon: 'git' }, { name: 'GitHub', icon: 'github' }, { name: 'Vercel', icon: 'vercel' },
    { name: 'VS Code', icon: '' }, { name: 'Android Studio', icon: 'androidstudio' }, { name: 'OpenAI API', icon: '' },
  ] },
];

export const content = {
  person: {
    name: 'Nagi Reddy SaiBaba',
  },

  /* ---------- GitHub sync (js/github.js) ----------
   * Your public repos are fetched in the visitor's browser (cached for an hour) and
   * merged with `projects.items` below: repos listed there keep your hand-written text,
   * in that order; any other public repo is added automatically after them.
   * A repo's "Website" field on GitHub becomes its Live demo link.
   * Hide a repo by listing it in `hidden` or giving it the GitHub topic `portfolio-hide`.
   */
  github: {
    user: GITHUB_USER,
    hidden: [],
    showForks: false,
    showArchived: false,
    max: 9,
  },

  /* ---------- Top bar ---------- */
  topbar: {
    // Shown top-left; the first line is red
    roles: ['Nagi Reddy', 'SaiBaba'],
    status: 'Building SyncLink',
  },
  nav: [
    { label: 'Work', href: '#work' },
    { label: 'Experience', href: '#experience' },
    { label: 'Skills', href: '#skills' },
    { label: 'Contact', href: '#contact' },
  ],

  /* ---------- Hero ---------- */
  hero: {
    // The giant word behind the photo (decorative; screen readers get the name below)
    bigWord: 'Portfolio',
    hello: "Hi, I'm",
    // Your name in the left column, one entry per line
    name: ['Nagi Reddy', 'SaiBaba'],
    role: 'Full-Stack Developer',
    lead: 'I build the tools I wish existed, then I ship them: DiskFrame, a Windows gallery that browses photos and videos straight off any drive, and Stashley, a bookmark library that sorts itself.',
    // Small note with a sparkle, right of the photo
    badge: 'Desktop and web apps in TypeScript, React, Electron and Rust.',
    location: 'Full-stack · Desktop · Web · Video',
    photo: {
      // Background removed, so the page shows through around you
      src: 'assets/portrait-cutout.webp',
      alt: 'Portrait of Nagi Reddy SaiBaba',
      width: 800,
      height: 1000,
    },
    // Numbers count up when scrolled into view. `source: 'githubRepos'` is kept up to date by js/github.js.
    stats: [
      { value: 6, suffix: '', label: ['Public', 'Repos'], source: 'githubRepos' },
      { value: skillGroups.reduce((n, g) => n + g.items.length, 0), suffix: '', label: ['Technologies', 'Used'] },
      { value: 2, suffix: '', label: ['Apps', 'Shipped'] },
    ],
  },

  /* ---------- Selected projects (3 per row on laptops) ----------
   * `repo` links an entry to its GitHub repo (see `github` above); its picture comes from
   * PROJECT_IMAGES at the top of this file (no entry: a cover is drawn).
   * This list is also what shows if GitHub can't be reached.
   */
  projects: {
    title: 'Selected Projects',
    viewAll: { label: 'View all on GitHub', href: `${GITHUB}?tab=repositories` },
    items: [
      {
        repo: 'DiskFrame',
        title: 'DiskFrame',
        kicker: 'Desktop App · Electron + Rust',
        description:
          'Your drives, as a gallery. Browse photos and videos straight off any drive on Windows, including iPhone HEIC and 4K HEVC. Nothing imported.',
        tech: ['TypeScript', 'Electron', 'React', 'Rust'],
        ...projectImage('DiskFrame'),
        links: { code: `${GITHUB}/DiskFrame`, live: '' },
      },
      {
        repo: 'stashley-showcase',
        title: 'Stashley',
        kicker: 'Web App · Next.js + Supabase',
        description:
          'A bookmark library that sorts links itself and finds them by what you’re making. Installable as a PWA.',
        tech: ['Next.js', 'TypeScript', 'Supabase', 'PWA'],
        ...projectImage('stashley-showcase'),
        links: { code: `${GITHUB}/stashley-showcase`, live: 'https://stashley.vercel.app' },
      },
      {
        repo: 'stock-trend-predictor',
        title: 'AI Stock Trend Predictor',
        kicker: 'Machine Learning · Streamlit',
        description:
          'A financial ML dashboard with dual-model prediction (LSTM + SVM), regime-aware modelling, a custom trainable attention layer and explainability through SHAP and LIME.',
        tech: ['Python', 'Streamlit', 'LSTM', 'SHAP'],
        ...projectImage('stock-trend-predictor'),
        links: { code: `${GITHUB}/stock-trend-predictor`, live: '' },
      },
      {
        repo: 'AI-Prompt-Story-Generator',
        title: 'AI Prompt Story Generator',
        kicker: 'Generative AI · Streamlit',
        description:
          'A Streamlit app that writes short stories from your prompts using OpenAI’s GPT-3.5.',
        tech: ['Python', 'Streamlit', 'OpenAI API'],
        ...projectImage('AI-Prompt-Story-Generator'),
        links: { code: `${GITHUB}/AI-Prompt-Story-Generator`, live: '' },
      },
      {
        repo: 'EDA-Course-Project',
        title: 'Exploratory Data Analysis',
        kicker: 'Data Analysis · Jupyter',
        description:
          'A complete EDA workflow in Python: data import and cleaning, summary statistics, missing-value handling, visualisation and statistical analysis.',
        tech: ['Python', 'Jupyter'],
        ...projectImage('EDA-Course-Project'),
        links: { code: `${GITHUB}/EDA-Course-Project`, live: '' },
      },
    ],
  },

  /* ---------- Experience (rendered as a data pipeline) ----------
   * The section and its nav link are hidden while `items` is empty. Entry format:
   * { stage: 'Internship', role: 'Software Engineer Intern', org: 'Company', period: 'May 2025 – Jul 2025',
   *   points: ['What you did, with a result.'], tech: ['React', 'Node.js'] }
   */
  experience: {
    title: 'Experience',
    intro: 'Roles and work so far — each stage feeds the next.',
    items: [
      {
        stage: 'Freelance',
        role: 'Video Editor & Content Producer',
        org: 'Independent',
        period: '2023 – Present',
        points: [
          'Managed 100+ end-to-end content deliveries: reels, advertisements and cinematic edits for creators and media professionals.',
        ],
        tech: ['Video Editing', 'Motion Graphics', 'Content'],
      },
      {
        stage: 'Internship',
        role: 'Generative AI Intern',
        org: 'IBM – Adroit Technologies',
        period: 'May 2025 – Jul 2025',
        points: [
          'Built AI applications on IBM watsonx, running structured and unstructured data through NLP pipelines for sentiment analysis and text generation.',
          'Developed chatbot workflows with REST API integration and prompt engineering for consistent, structured model responses.',
        ],
        tech: ['IBM watsonx', 'NLP', 'REST APIs', 'Prompt Engineering'],
      },
      {
        stage: 'Leadership',
        role: 'Secretary',
        org: 'VRIKSH Club, VIT Vellore',
        period: 'Present',
        points: [],
        tech: ['Leadership'],
      },
      {
        stage: 'Marketing',
        role: 'Student Manager',
        org: 'GRAVITAS Publicity & Marketing, VIT Vellore',
        period: 'Sept 2026',
        points: [],
        tech: ['Publicity', 'Marketing'],
      },
      {
        stage: 'Events',
        role: 'Coordinator',
        org: 'INFUSION at Riviera, VIT’s cultural fest',
        period: '2025',
        points: [],
        tech: ['Event Ops'],
      },
    ],
    // Final node of the pipeline
    end: { label: 'Next stage', text: 'Your team?', cta: { label: 'Get in touch', href: '#contact' } },
  },

  /* ---------- Education ----------
   * The column is hidden while both lists are empty.
   * Item: { degree: 'B.Tech in …', school: '…', period: '2023 – 2027', badge: 'VIT', logo: '' }
   * Certification / achievement: { name: '…', issuer: '…', icon: 'simpleicons-slug', href: 'URL' } (icon and href optional)
   */
  education: {
    title: 'Education',
    items: [
      { degree: 'B.Tech in Computer Science (Data Science)', school: 'Vellore Institute of Technology, Vellore · CGPA 8.21/10', period: '2023 – 2027', badge: 'VIT', logo: '' },
    ],
    certifications: [],
    achievements: [
      { name: 'Eco Hackathon participant', issuer: 'IIT (BHU) Varanasi · 2025' },
    ],
  },

  /* ---------- Skills ---------- */
  skills: {
    title: 'Skills',
    // Each group is a "chip" on the circuit board; hover a group to light up its traces.
    groups: skillGroups,
  },

  /* ---------- Quote card ---------- */
  quote: {
    text: 'Ship first. Polish after.',
    signature: 'SaiBaba',
    cta: { label: 'Let’s build something together', href: '#contact' },
  },

  /* ---------- Contact ---------- */
  contact: {
    title: ['Let’s work', 'together'],
    text: 'Email me about a role, a project or an idea worth building. You can also find me on GitHub, LinkedIn and YouTube.',
    cta: { label: 'Email me', href: `mailto:${EMAIL}` },
    // Glass cards — icon: mail | github | linkedin | globe | phone | pin
    socials: [
      { icon: 'mail', title: 'Email', note: EMAIL, href: `mailto:${EMAIL}` },
      { icon: 'github', title: 'GitHub', note: 'See my code', href: GITHUB },
      { icon: 'linkedin', title: 'LinkedIn', note: 'Let’s connect', href: LINKEDIN },
    ],
    // Rotating "Contact me" badge on the right
    badge: { heading: 'Contact me', ring: 'Contact me • Let’s talk • ', href: `mailto:${EMAIL}` },
  },

  /* ---------- Footer ---------- */
  footer: {
    note: 'Nagi Reddy SaiBaba · Design by Dheeraj Alahari',
    links: [
      { label: 'GitHub', href: GITHUB },
      { label: 'LinkedIn', href: LINKEDIN },
      { label: 'YouTube', href: YOUTUBE },
      { label: 'Email', href: `mailto:${EMAIL}` },
    ],
  },
};
