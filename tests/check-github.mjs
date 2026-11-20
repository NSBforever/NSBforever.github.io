// Self-check for the GitHub sync merge rules. Run from the project folder: node tests/check-github.mjs
import assert from 'node:assert/strict';
import { mergeProjects, readmeExcerpt, safeUrl, displayName } from '../js/github.js';

const repo = (name, extra = {}) => ({
  name, html_url: `https://github.com/me/${name}`, description: null, homepage: null, language: 'Python',
  topics: [], fork: false, archived: false, private: false, pushed_at: '2026-01-01T00:00:00Z', ...extra,
});
const item = (r, extra = {}) => ({ repo: r, title: r, kicker: 'k', description: 'd', tech: ['x'], image: '', alt: '', links: { code: '', live: '' }, ...extra });
const cfg = { user: 'me', hidden: ['h'], showForks: false, showArchived: false, max: 9 };

const repos = [
  repo('me'), // profile README repo: never shown
  repo('curated-b', { homepage: 'b.example.com' }),
  repo('curated-a'),
  repo('new-old', { pushed_at: '2026-02-01T00:00:00Z', description: 'Old one' }),
  repo('new-recent', { pushed_at: '2026-03-01T00:00:00Z', readme: 'From the README' }),
  repo('fork', { fork: true }),
  repo('archived', { archived: true }),
  repo('h'),
  repo('tagged', { topics: ['portfolio-hide'] }),
  repo('secret', { private: true }),
];
const items = [item('curated-a'), item('curated-b'), item('deleted-repo')];
const out = mergeProjects(repos, items, cfg);

// Hand-written first in their order (deleted repo dropped), then new repos newest first.
assert.deepEqual(out.map((p) => p.repo), ['curated-a', 'curated-b', 'new-recent', 'new-old']);
assert.equal(out[1].links.live, 'https://b.example.com/'); // GitHub "Website" field becomes the live link
assert.equal(out[2].description, 'From the README'); // README fallback when no description
assert.equal(out[2].title, 'New Recent');
assert.equal(mergeProjects(repos, items, { ...cfg, max: 2 }).length, 2);

// README fallback skips "**Name:** … **Reg No.:** …" metadata lines.
assert.equal(
  readmeExcerpt('# Title\n\n**Name:** Someone  **Reg No.:** 123\n\nComplete EDA workflow in Python: cleaning and statistics.\n'),
  'Complete EDA workflow in Python: cleaning and statistics.',
);
assert.equal(safeUrl('javascript:alert(1)'), '');
assert.equal(displayName('DiskFrame'), 'DiskFrame');

console.log('check-github: all good');
