/**
 * github.js — keeps the Projects section in sync with your public GitHub repos.
 *
 * Runs in the visitor's browser while the intro loader plays (GitHub Pages has no server).
 * No token is used: GitHub allows 60 API calls an hour per visitor IP, and results are
 * cached in localStorage for an hour, so a visit costs at most a handful of calls.
 * If GitHub is slow or unreachable, the hand-written list in content.js stays as it is.
 */

const API = 'https://api.github.com';
const CACHE_KEY = 'gh-sync-v1';
const TTL = 60 * 60 * 1000;
const HIDE_TOPIC = 'portfolio-hide';

/** Only http(s) links typed into GitHub's "Website" field. */
export function safeUrl(u) {
  if (!u || !String(u).trim()) return '';
  try {
    const url = new URL(/^https?:\/\//i.test(u) ? u : `https://${u}`);
    return url.protocol === 'https:' || url.protocol === 'http:' ? url.href : '';
  } catch {
    return '';
  }
}

/** "stock-trend-predictor" -> "Stock Trend Predictor"; deliberate casing ("DiskFrame") stays. */
export function displayName(name) {
  if (/[A-Z]/.test(name) && !/[-_]/.test(name)) return name;
  return name.replace(/[-_]+/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}

/** First readable paragraph of a README; skips headings, badges, lists and "**Name:** value" metadata. */
export function readmeExcerpt(md, max = 200) {
  const para = md
    .replace(/<!--[\s\S]*?-->/g, '')
    .replace(/```[\s\S]*?```/g, '')
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .find(
      (p) =>
        p &&
        !/^(#|<|!\[|\[!\[|\||-{3,}|>|[-*+] |\d+\. )/.test(p) &&
        !/^(\*\*|__)[^*_\n]{1,30}(:(\*\*|__)|(\*\*|__):)/.test(p) &&
        !/^[A-Z][\w.]*( [\w.]+)?:\s/.test(p) &&
        /[a-z]{3}/i.test(p),
    );
  if (!para) return '';
  const text = para
    .replace(/!\[[^\]]*\]\([^)]*\)/g, '')
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
    .replace(/[*_`]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
  if (text.length < 20) return '';
  return text.length > max ? `${text.slice(0, max).replace(/\s+\S*$/, '')}…` : text;
}

/**
 * Merge the live repo list with the hand-written items (pure, so it can be tested).
 * Hand-written items come first in their order, if their repo still exists and isn't hidden;
 * every other public repo follows, newest push first. Private, forked (unless allowed),
 * archived (unless allowed) and hidden repos are left out; deleted repos simply vanish.
 */
export function mergeProjects(repos, items, cfg) {
  const byName = new Map(repos.map((r) => [r.name, r]));
  const visible = (r) =>
    r && !r.private && r.name.toLowerCase() !== cfg.user.toLowerCase() &&
    !(cfg.hidden || []).includes(r.name) && !(r.topics || []).includes(HIDE_TOPIC);

  const curated = items
    .filter((it) => !it.repo || visible(byName.get(it.repo)))
    .map((it) => {
      const r = byName.get(it.repo);
      if (!r) return it;
      return { ...it, links: { code: r.html_url, live: it.links?.live || safeUrl(r.homepage) } };
    });

  const taken = new Set(items.map((it) => it.repo));
  const added = repos
    .filter((r) => visible(r) && !taken.has(r.name))
    .filter((r) => (cfg.showForks || !r.fork) && (cfg.showArchived || !r.archived))
    .sort((a, b) => Date.parse(b.pushed_at) - Date.parse(a.pushed_at))
    .map((r) => ({
      repo: r.name,
      title: displayName(r.name),
      kicker: [r.language, (r.topics || [])[0] && displayName(r.topics[0])].filter(Boolean).join(' · ') || 'GitHub project',
      description: r.description?.trim() || r.readme || (r.language ? `A ${r.language} project.` : 'A project on GitHub.'),
      tech: (r.languages?.length ? r.languages : [r.language]).filter(Boolean).slice(0, 4),
      image: '',
      alt: '',
      links: { code: r.html_url, live: safeUrl(r.homepage) },
    }));

  return [...curated, ...added].slice(0, cfg.max || 9);
}

const readCache = () => {
  try {
    const c = JSON.parse(localStorage.getItem(CACHE_KEY));
    return c && Date.now() - c.at < TTL ? c : null;
  } catch {
    return null;
  }
};
const writeCache = (repos) => {
  try { localStorage.setItem(CACHE_KEY, JSON.stringify({ at: Date.now(), repos })); } catch { /* storage off */ }
};

async function gh(path, signal, raw = false) {
  const res = await fetch(`${API}${path}`, {
    signal,
    headers: { Accept: raw ? 'application/vnd.github.raw+json' : 'application/vnd.github+json' },
  });
  if (!res.ok) throw new Error(`GitHub ${res.status}`);
  return raw ? res.text() : res.json();
}

/** Fetch repos; extra calls (languages, README) only for repos that aren't hand-written. */
async function fetchRepos(cfg, items, signal) {
  const list = await gh(`/users/${encodeURIComponent(cfg.user)}/repos?type=owner&sort=pushed&per_page=100`, signal);
  const taken = new Set(items.map((it) => it.repo));
  return Promise.all(
    list.map(async (r) => {
      const repo = {
        name: r.name, html_url: r.html_url, description: r.description, homepage: r.homepage,
        language: r.language, topics: r.topics, fork: r.fork, archived: r.archived, private: r.private,
        pushed_at: r.pushed_at,
      };
      if (taken.has(r.name) || r.private || r.fork || r.archived) return repo;
      const [langs, md] = await Promise.all([
        gh(`/repos/${r.full_name}/languages`, signal).catch(() => ({})),
        r.description ? '' : gh(`/repos/${r.full_name}/readme`, signal, true).catch(() => ''),
      ]);
      repo.languages = Object.entries(langs).sort((a, b) => b[1] - a[1]).map(([n]) => n);
      repo.readme = md ? readmeExcerpt(md) : '';
      return repo;
    }),
  );
}

/** Updates content.projects.items and the repo-count stat in place. Never throws. */
export async function syncProjects(content, timeoutMs = 3500) {
  const cfg = content.github;
  if (!cfg?.user) return;
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), timeoutMs);
  try {
    let repos = readCache()?.repos;
    if (!repos) {
      repos = await fetchRepos(cfg, content.projects.items, ctrl.signal);
      writeCache(repos);
    }
    content.projects.items = mergeProjects(repos, content.projects.items, cfg);
    const count = repos.filter((r) => !r.private && !r.fork).length;
    content.hero.stats.forEach((s) => { if (s.source === 'githubRepos') s.value = count; });
  } catch (err) {
    console.warn('GitHub sync skipped, showing the saved project list:', err.message || err);
  } finally {
    clearTimeout(timer);
  }
}
