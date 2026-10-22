/* Creative Writing catalog. Add real, published works in data/creative-writing.json. */
document.addEventListener('DOMContentLoaded', async () => {
  const list = document.querySelector('[data-writing-list]');
  const empty = document.querySelector('[data-writing-empty]');
  const error = document.querySelector('[data-writing-error]');
  const count = document.querySelector('[data-writing-count]');
  const filters = document.querySelector('[data-writing-filters]');
  if (!list || !empty || !count || !filters) return;

  const menu = document.querySelector('.menu-btn');
  const nav = document.querySelector('.nav-links');
  if (menu && nav) {
    menu.addEventListener('click', () => {
      // site.js performs the actual class toggle.
      menu.setAttribute('aria-expanded', String(nav.classList.contains('mobile-open')));
    });
  }

  const validUrl = value => {
    if (typeof value !== 'string') return false;
    const url = value.trim();
    if (/^https:\/\//i.test(url)) return true;
    return /^[a-z0-9][a-z0-9._/?&=#%+\-]*$/i.test(url) &&
      !url.includes('..') && !url.includes(':') && !url.startsWith('//');
  };
  const make = (tag, className, text) => {
    const el = document.createElement(tag);
    if (className) el.className = className;
    if (text !== undefined) el.textContent = String(text);
    return el;
  };

  try {
    const response = await fetch('data/creative-writing.json', { cache: 'no-store' });
    if (!response.ok) throw new Error('Could not fetch story list');
    const data = await response.json();
    const works = (Array.isArray(data.works) ? data.works : []).filter(
      item => item && typeof item.title === 'string' && item.title.trim() && validUrl(item.url)
    );

    const types = [...new Set(works.map(item => String(item.type || 'Story').trim()))];
    let current = 'All';

    const draw = () => {
      const visible = works.filter(item => current === 'All' ||
        String(item.type || 'Story').trim() === current);
      list.replaceChildren();

      visible.forEach(item => {
        const card = make('article', 'cw-story-card');
        const cover = make('div', 'cw-story-cover');
        if (validUrl(item.cover)) {
          const img = make('img');
          img.src = item.cover;
          img.alt = item.coverAlt ? String(item.coverAlt) : '';
          img.loading = 'lazy';
          cover.append(img);
        } else {
          cover.classList.add('no-image');
          cover.append(make('span', '', 'Original writing'));
        }
        const copy = make('div', 'cw-story-copy');
        const category = String(item.type || 'Story').trim();
        copy.append(make('span', 'cw-story-category',
          category + (item.date ? ' / ' + String(item.date) : '')));
        const title = make('h3', '', item.title);
        copy.append(title);
        if (item.description) copy.append(make('p', '', item.description));
        const link = make('a', 'cw-story-link', 'Read the story ↗');
        link.href = item.url;
        link.setAttribute('aria-label', 'Read ' + item.title);
        if (/^https:\/\//i.test(item.url)) {
          link.target = '_blank';
          link.rel = 'noopener noreferrer';
        }
        copy.append(link);
        card.append(cover, copy);
        list.append(card);
      });

      count.textContent = visible.length + (visible.length === 1 ? ' story' : ' stories');
      empty.hidden = visible.length > 0;
      if (empty.hidden) empty.classList.remove('reveal');
    };

    if (types.length > 1) {
      filters.hidden = false;
      const categories = ['All', ...types];
      categories.forEach(type => {
        const button = make('button', 'cw-filter', type);
        button.type = 'button';
        button.setAttribute('aria-pressed', String(type === 'All'));
        button.addEventListener('click', () => {
          current = type;
          filters.querySelectorAll('button').forEach(btn =>
            btn.setAttribute('aria-pressed', String(btn === button)));
          draw();
        });
        filters.append(button);
      });
    }
    draw();
  } catch (e) {
    error.hidden = false;
    count.textContent = 'Stories';
  }
});
