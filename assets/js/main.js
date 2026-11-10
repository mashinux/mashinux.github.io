/* ==========================================================================
   MASHINUX — main.js
   Renders data from assets/data/content.*.js and wires up interactions.
   Motion: machine-like — fast, stops precisely, no loops, no bounce.
   ========================================================================== */
(() => {
  'use strict';

  const C = window.MX_CONTENT;
  const PH = C.meta.placeholder;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const coarse = matchMedia('(pointer: coarse)').matches;
  const mqMobile = matchMedia('(max-width: 760px)');

  const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const isEmpty = v => v === null || v === undefined || v === '';
  // escape, then wrap any "[...]" placeholder in a mono span
  const fmt = v => isEmpty(v) ? `<span class="ph">${PH}</span>` : esc(v).replace(/\[[^\]]*\]/g, m => `<span class="ph">${m}</span>`);
  const fmtDate = iso => { const [y, m, d] = iso.split('-'); return `${d}/${m}/${y}`; };
  const pad = n => String(n).padStart(2, '0');
  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
  const worksById = Object.fromEntries(C.works.map(w => [w.id, w]));
  const real = arr => arr.filter(v => !isEmpty(v));
  const srcset = (img, w) => `${img.replace(/\.jpg$/, '-800w.jpg')} 800w, ${img} ${w}w`;

  /* ---------- certificate validity ---------- */
  const certValid = new Date() <= new Date(C.certificate.validUntil + 'T23:59:59');
  if (!certValid) document.body.classList.add('cert-expired');
  $('.iso-tag')?.classList.add('cert__live');

  /* ---------- data bindings ---------- */
  const link = (href, text, cls = '') => href ? `<a class="${cls}" href="${esc(href)}"${/^https?:/.test(href) ? ' target="_blank" rel="noopener"' : ''}>${esc(text)}</a>` : `<span class="ph">${PH}</span>`;
  const binds = {
    phone: () => C.contact.phone ? link(C.contact.phoneHref, C.contact.phone, 'num ltr') : `<span class="ph">${PH}</span>`,
    whatsapp: () => C.contact.whatsappHref ? link(C.contact.whatsappHref, C.contact.phone || 'פתיחת שיחה', 'num ltr') : `<span class="ph">${PH}</span>`,
    email: () => C.contact.email ? link(`mailto:${C.contact.email}`, C.contact.email, 'ltr') : `<span class="ph">${PH}</span>`,
    precision: () => C.ranges.precision ? `<span class="num ltr">${esc(C.ranges.precision)}</span>` : `<span class="ph">${PH}</span>`,
    legalName: () => esc(C.company.legalName),
    legalNameEn: () => esc(C.company.legalNameEn),
    // keep "08:00–20:00" in reading order inside RTL text
    hours: () => isEmpty(C.company.hours) ? fmt(null) : esc(C.company.hours).replace(/\d{1,2}:\d{2}\s*[–-]\s*\d{1,2}:\d{2}/g, m => `<bdi dir="ltr" class="num" style="white-space:nowrap">${m}</bdi>`),
    foundedYear: () => C.company.foundedYear ? `<span class="num">${esc(C.company.foundedYear)}</span>` : '<span class="ph">[שנת הקמה]</span>',
    maxFile: () => C.flags.maxFileMB ? `<span class="num">${esc(C.flags.maxFileMB)} MB</span>` : `<span class="ph">${PH}</span>`,
    'cert.standard': () => esc(C.certificate.standard),
    'cert.number': () => esc(C.certificate.number),
    'cert.body': () => esc(C.certificate.body),
    'cert.scope': () => esc(C.certificate.scope),
    'cert.scopeHe': () => esc(C.certificate.scopeHe),
    'cert.firstIssue': () => fmtDate(C.certificate.firstIssue),
    'cert.validUntil': () => fmtDate(C.certificate.validUntil)
  };
  $$('[data-bind]').forEach(el => { const f = binds[el.dataset.bind]; if (f) el.innerHTML = el.closest('a') ? esc(el.textContent || C.contact[el.dataset.bind] || '') : f(); });

  if (C.contact.whatsappHref) $('#headerWa').href = C.contact.whatsappHref; else $('#headerWa').remove();
  $('#year').textContent = new Date().getFullYear();
  if (!C.flags.maxFileMB) $('#maxFileLine')?.remove();
  if (C.company.foundedYear) $('#footerDimLabel').textContent = `MASHINUX — ${C.company.foundedYear} — ISRAEL`;
  if (C.flags.responseTime) $('#rfq-title').innerHTML = `יש לכם שרטוט?<br>נחזיר הצעת מחיר תוך&nbsp;${esc(C.flags.responseTime)}.`;

  /* ---------- navigation ---------- */
  $('#nav').innerHTML = C.nav.map(n => `<a href="${n.href}">${esc(n.label)}</a>`).join('');
  $('#menuList').innerHTML = [...C.nav, ...(C.menuExtra || [])].map(n => `<li><a href="${n.href}"${n.cta ? ' class="menu__cta"' : ''}><span class="mono">${n.no}</span>${esc(n.label)}</a></li>`).join('');

  // action bar: links only when a real number exists
  $$('#actionbar [data-action]').forEach(el => {
    const href = el.dataset.action === 'phone' ? C.contact.phoneHref : C.contact.whatsappHref;
    if (href) {
      const a = document.createElement('a');
      a.href = href; a.textContent = el.textContent;
      if (/^https?:/.test(href)) { a.target = '_blank'; a.rel = 'noopener'; }
      el.replaceWith(a);
    } else {
      el.setAttribute('aria-disabled', 'true');
      el.innerHTML = `${esc(el.textContent)} <span class="ph">${PH}</span>`;
    }
  });

  /* ---------- client strip ---------- */
  $('#stripList').innerHTML = C.industries.map(ind => {
    const cl = C.clients[ind.client];
    return C.flags.clientsApproved && cl
      ? `<li><img class="strip__logo" src="${cl.logo}" alt="${esc(cl.name)}" loading="lazy"></li>`
      : `<li>${esc(ind.name)}</li>`;
  }).join('');

  /* ---------- reveal ---------- */
  const revealIO = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('is-in'); revealIO.unobserve(e.target); } });
  }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
  const observeReveal = root => $$('.reveal', root).forEach(el => revealIO.observe(el));

  // one-time draw for dimension lines outside the hero
  const drawIO = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('is-drawn'); drawIO.unobserve(e.target); } });
  }, { threshold: 0.6 });
  ['#scaleDim', '#footerDim'].forEach(s => drawIO.observe($(s)));

  /* ==========================================================================
     Header: transparent over hero → hides on scroll down → returns compact
     ========================================================================== */
  const header = $('#header');
  const hero = $('#top');
  const heroPart = $('#heroPart');
  const heroDims = $('.part__dims', heroPart);
  const bar = $('#progressBar');
  const actionbar = $('#actionbar');
  let lastY = scrollY, ticking = false, menuOpen = false;

  function onScroll() {
    const y = scrollY;
    const dy = y - lastY;
    const max = document.documentElement.scrollHeight - innerHeight;
    bar.style.transform = `scaleX(${max > 0 ? y / max : 0})`;

    if (!menuOpen) {
      if (y < 80) header.classList.remove('is-scrolled', 'is-hidden');
      else {
        header.classList.add('is-scrolled');
        if (dy > 4) header.classList.add('is-hidden');
        else if (dy < -4) header.classList.remove('is-hidden');
      }
    }

    if (y < innerHeight * 0.5) navLinks.forEach(a => a.setAttribute('aria-current', 'false'));

    // hero: dims fade, part shrinks and makes room; parallax ≤ 5%
    const hh = hero.offsetHeight;
    const p = clamp(y / (hh * 0.8), 0, 1);
    if (!reduce) {
      heroPart.style.transform = `translate3d(0, ${p * 5}%, 0) scale(${1 - p * 0.12})`;
    }
    heroDims.style.opacity = String(clamp(1 - p * 2.5, 0, 1));

    lastY = y;
    ticking = false;
  }
  addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(onScroll); } }, { passive: true });
  addEventListener('resize', () => requestAnimationFrame(onScroll));


  /* ---------- one red per viewport: header CTA / action bar ---------- */
  const visiblePrimaries = new Set();
  const primaryIO = new IntersectionObserver(entries => {
    entries.forEach(e => e.isIntersecting ? visiblePrimaries.add(e.target) : visiblePrimaries.delete(e.target));
    const heroCtaVisible = visiblePrimaries.has($('#heroCta'));
    header.classList.toggle('cta-on', visiblePrimaries.size === 0);
    actionbar.classList.toggle('is-on', !heroCtaVisible);
    actionbar.classList.toggle('is-muted', visiblePrimaries.size > 0);
  }, { threshold: 0 });
  // every red point on the page: primary CTAs + the red graphic accents (hotspot, glass, QC stamps)
  const watchPrimaries = () => $$('main .btn--primary, .swatch--focus, #travelerRows .tv__row:not(.tv__row--cta)').forEach(b => primaryIO.observe(b));

  /* ---------- active nav item ---------- */
  const navLinks = $$('#nav a');
  const sectionIO = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      navLinks.forEach(a => a.setAttribute('aria-current', String(a.getAttribute('href') === '#' + e.target.id)));
    });
  }, { rootMargin: '-45% 0px -50% 0px' });
  C.nav.forEach(n => { const s = $(n.href); if (s) sectionIO.observe(s); });

  /* ---------- fullscreen menu ---------- */
  const burger = $('#burger'), menu = $('#menu');
  function setMenu(open) {
    menuOpen = open;
    burger.setAttribute('aria-expanded', String(open));
    burger.setAttribute('aria-label', open ? 'סגירת תפריט' : 'פתיחת תפריט');
    document.documentElement.style.overflow = open ? 'hidden' : '';
    if (open) {
      header.classList.remove('is-hidden');
      menu.hidden = false;
      requestAnimationFrame(() => { menu.classList.add('is-open'); $('a', menu)?.focus(); });
    } else {
      menu.classList.remove('is-open');
      setTimeout(() => { if (!menuOpen) menu.hidden = true; }, 260);
    }
  }
  burger.addEventListener('click', () => setMenu(!menuOpen));
  menu.addEventListener('click', e => { if (e.target.closest('a')) setMenu(false); });
  addEventListener('keydown', e => { if (e.key === 'Escape' && menuOpen) { setMenu(false); burger.focus(); } });

  /* ==========================================================================
     Hero intro: push-in → dimension draw → one light sweep
     ========================================================================== */
  function heroIntro() {
    const dims = $$('.dim', heroDims);
    dims.forEach((d, i) => { $('.dim__line', d).style.transitionDelay = `${i * 60}ms`; });
    if (reduce) { heroDims.classList.add('is-drawn'); return; }
    requestAnimationFrame(() => heroPart.classList.add('is-pushed'));
    setTimeout(() => heroDims.classList.add('is-drawn'), 800);
    setTimeout(() => heroPart.classList.add('is-swept'), 1700);
  }
  const heroImg = $('img', heroPart);
  if (heroImg.complete) heroIntro(); else heroImg.addEventListener('load', heroIntro, { once: true });

  /* ==========================================================================
     4 · Services
     ========================================================================== */
  $('#servicesList').innerHTML = C.services.map((sv, i) => `
    <li class="service reveal${sv.image ? ' service--img' : ''}" style="--i:${i}">
      <span class="service__no mono">${sv.no}</span>
      <h3 class="service__name">${esc(sv.name)}</h3>
      <p class="service__line">${esc(sv.line)}</p>
      ${sv.image ? `<img class="service__img chamfer" src="${sv.image.replace(/\.jpg$/, '-800w.jpg')}" width="800" height="533" alt="${esc(sv.name)}" loading="lazy">` : ''}
    </li>`).join('');

  // About: the gear settles into place once, when the section comes into view
  const aboutBrand = $('#aboutBrand');
  if (aboutBrand && !reduce) {
    const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { aboutBrand.classList.add('is-in'); io.disconnect(); } }), { threshold: 0.5 });
    io.observe(aboutBrand);
  } else aboutBrand?.classList.add('is-in');

  /* ==========================================================================
     5 · Materials
     ========================================================================== */
  const sw = $('#swatches'), md = $('#matDetail');
  sw.innerHTML = C.materials.map((m, i) => `
    <button type="button" class="swatch${m.brass ? ' swatch--brass' : ''}${m.focus ? ' swatch--focus' : ''}" data-i="${i}" aria-pressed="false">
      <span class="swatch__idx mono">${pad(i + 1)}</span>
      ${m.part && worksById[m.part]
        ? `<span class="swatch__img" aria-hidden="true"><img src="${worksById[m.part].image.replace(/\.jpg$/, '-800w.jpg')}" alt="" loading="lazy" style="object-position:${worksById[m.part].pos || '50% 50%'}"></span>`
        : `<span class="swatch__glyph" aria-hidden="true" data-glyph="${m.en.slice(0, 2)}"></span>`}
      <span><span class="swatch__name">${esc(m.name)}</span><br><span class="swatch__en mono">${m.en}</span></span>
    </button>`).join('');
  function showMat(i) {
    const m = C.materials[i];
    $$('.swatch', sw).forEach(b => b.setAttribute('aria-pressed', String(+b.dataset.i === i)));
    const w = m.part && worksById[m.part];
    md.innerHTML = `
      <div class="matdetail__img chamfer">${w
        ? `<img src="${w.image.replace(/\.jpg$/, '-800w.jpg')}" width="800" height="533" alt="${esc(w.alt)}" loading="lazy">`
        : `<span class="matdetail__glyph" aria-hidden="true" data-glyph="${m.en}"></span>`}</div>
      <div class="matdetail__body">
        <span class="mono t-muted">${pad(i + 1)} / ${pad(C.materials.length)} · ${m.en}</span>
        <h3 class="t-h3">${esc(m.name)}${w ? ` <span class="t-small t-muted">— ${esc(w.title)}</span>` : ''}</h3>
        ${m.challenge ? `<p class="t-small t-muted">האתגר בעיבוד: ${esc(m.challenge)}</p>` : (w ? '' : '<p class="t-small t-muted">ספרו לנו על החלק ונבדוק אותו יחד.</p>')}
      </div>`;
  }
  sw.addEventListener('mouseover', e => { const b = e.target.closest('.swatch'); if (b) showMat(+b.dataset.i); });
  sw.addEventListener('focusin', e => { const b = e.target.closest('.swatch'); if (b) showMat(+b.dataset.i); });
  sw.addEventListener('click', e => { const b = e.target.closest('.swatch'); if (b) showMat(+b.dataset.i); });
  showMat(Math.max(0, C.materials.findIndex(m => m.id === 'aluminum')));

  /* ==========================================================================
     6 · Works + Lightbox
     ========================================================================== */
  const gallery = $('#gallery');
  const tags = w => real([w.material, w.process, w.industry]).map(esc).join(' · ');
  gallery.innerHTML = C.works.map((w, i) => `
    <figure class="work work--${w.layout}">
      <button type="button" class="work__link" data-i="${i}" aria-label="${esc(w.title)} — פתיחה בתצוגה מלאה" style="text-align:right;width:100%">
        <div class="work__media chamfer">
          <img src="${w.image.replace(/\.jpg$/, '-800w.jpg')}" srcset="${srcset(w.image, w.w)}"
               sizes="(max-width: 760px) 100vw, ${w.layout === 'wide' ? '62vw' : w.layout === 'half' ? '46vw' : '31vw'}"
               width="${w.w}" height="${w.h}" alt="${esc(w.alt)}" loading="lazy" decoding="async"
               ${w.pos ? `style="object-position:${w.pos}"` : ''}>
          <svg class="work__mark" viewBox="0 0 124 124" aria-hidden="true" style="color:var(--metal)"><use href="#mx-mark-mono"/></svg>
        </div>
        <figcaption class="work__meta">
          <div class="dim dim--h" aria-hidden="true"><span class="dim__line"></span></div>
          <div class="work__title">${esc(w.title)}</div>
          ${tags(w) ? `<div class="work__tags mono">${tags(w)}</div>` : ''}
        </figcaption>
      </button>
    </figure>`).join('');

  if (C.works.length >= C.worksFilterMin) {
    const f = $('#worksFilter');
    const opts = (key) => [...new Set(C.works.map(w => w[key]).filter(Boolean))];
    f.innerHTML = `<button type="button" data-k="" aria-pressed="true">הכול</button>` +
      [...opts('industry').map(v => ['industry', v]), ...opts('material').map(v => ['material', v])]
        .map(([k, v]) => `<button type="button" data-k="${k}" data-v="${esc(v)}" aria-pressed="false">${esc(v)}</button>`).join('');
    f.hidden = false;
    f.addEventListener('click', e => {
      const b = e.target.closest('button'); if (!b) return;
      $$('button', f).forEach(x => x.setAttribute('aria-pressed', String(x === b)));
      $$('.work', gallery).forEach((el, i) => { el.hidden = !!b.dataset.k && C.works[i][b.dataset.k] !== b.dataset.v; });
    });
  }

  const lb = $('#lightbox'), lbImg = $('#lbImg'), lbFig = $('#lbFig');
  let lbIndex = 0, lbReturn = null;
  function lbRender(i, fade) {
    lbIndex = (i + C.works.length) % C.works.length;
    const w = C.works[lbIndex];
    const swap = () => {
      lbImg.src = w.image; lbImg.alt = w.alt; lbImg.width = w.w; lbImg.height = w.h;
      $('#lbTitle').textContent = w.title;
      $('#lbCount').textContent = `${pad(lbIndex + 1)} / ${pad(C.works.length)}`;
      $('#lbMeta').innerHTML = [
        [C.ui.material, w.material], [C.ui.process, w.process], [C.ui.industry, w.industry],
        [C.ui.challenge, w.challenge], [C.ui.qty, w.qty]
      ].filter(([, v]) => !isEmpty(v)).map(([k, v]) => `<dt>${esc(k)}</dt><dd>${esc(v)}</dd>`).join('');
      $$('.dim', lbFig).forEach(d => d.classList.remove('is-drawn'));
      const draw = () => requestAnimationFrame(() => requestAnimationFrame(() => { $$('.dim', lbFig).forEach(d => d.classList.add('is-drawn')); lbImg.classList.remove('is-fading'); }));
      if (lbImg.complete) draw(); else lbImg.addEventListener('load', draw, { once: true });
    };
    if (fade && !reduce) { lbImg.classList.add('is-fading'); setTimeout(swap, 150); } else swap();
  }
  function lbOpen(i) {
    lbReturn = document.activeElement;
    lb.hidden = false;
    document.documentElement.style.overflow = 'hidden';
    lbRender(i, false);
    requestAnimationFrame(() => { lb.classList.add('is-open'); $('#lbClose').focus(); });
  }
  function lbClose() {
    lb.classList.remove('is-open');
    document.documentElement.style.overflow = '';
    setTimeout(() => { lb.hidden = true; }, 260);
    lbReturn?.focus();
  }
  gallery.addEventListener('click', e => {
    if (dragMoved) { e.preventDefault(); e.stopPropagation(); return; }
    const b = e.target.closest('.work__link'); if (b) lbOpen(+b.dataset.i);
  }, true);

  /* ---------- horizontal rail: arrows, drag, counter, progress ---------- */
  const workEls = $$('.work', gallery);
  const railCount = $('#railCount'), railBar = $('#railBar'), railPrev = $('#railPrev'), railNext = $('#railNext');
  const maxScroll = () => gallery.scrollWidth - gallery.clientWidth;
  const pos = () => Math.abs(gallery.scrollLeft);                // RTL: scrollLeft runs 0 → negative
  function railUpdate() {
    const m = maxScroll(), p = pos();
    railBar.style.transform = `scaleX(${m > 0 ? Math.max(0.04, p / m) : 1})`;
    // first card whose start edge is inside the rail
    const idx = p >= m - 4 ? workEls.length - 1 : current();
    railCount.textContent = `${pad(idx + 1)} / ${pad(workEls.length)}`;
    railPrev.disabled = p <= 4;
    railNext.disabled = p >= m - 4;
  }
  const current = () => {
    const r = gallery.getBoundingClientRect();
    const i = workEls.findIndex(el => el.getBoundingClientRect().right <= r.right + 8);
    return i < 0 ? 0 : i;
  };
  // move exactly one card: align the target card's start (right edge, RTL) with the rail's start
  const go = dir => {
    const t = workEls[Math.min(workEls.length - 1, Math.max(0, current() + dir))];
    if (!t) return;
    gallery.scrollBy({ left: t.getBoundingClientRect().right - gallery.getBoundingClientRect().right, behavior: reduce ? 'auto' : 'smooth' });
  };
  railNext.addEventListener('click', () => go(1));
  railPrev.addEventListener('click', () => go(-1));
  gallery.addEventListener('scroll', () => requestAnimationFrame(railUpdate), { passive: true });
  addEventListener('resize', railUpdate);
  gallery.addEventListener('keydown', e => {
    if (e.target !== gallery) return;
    if (e.key === 'ArrowLeft') { e.preventDefault(); go(1); }
    if (e.key === 'ArrowRight') { e.preventDefault(); go(-1); }
  });
  // mouse drag (touch scrolls natively)
  let dragX = null, dragStart = 0, dragMoved = false;
  gallery.addEventListener('pointerdown', e => {
    if (e.pointerType !== 'mouse' || e.button !== 0) return;
    dragX = e.clientX; dragStart = gallery.scrollLeft; dragMoved = false;
  });
  addEventListener('pointermove', e => {
    if (dragX === null) return;
    const dx = e.clientX - dragX;
    if (!dragMoved && Math.abs(dx) > 6) { dragMoved = true; gallery.classList.add('is-dragging'); }
    if (dragMoved) gallery.scrollLeft = dragStart - dx;
  });
  addEventListener('pointerup', () => {
    if (dragX === null) return;
    dragX = null;
    if (dragMoved) {
      gallery.classList.remove('is-dragging');
      setTimeout(() => { dragMoved = false; }, 0);
    }
  });
  gallery.addEventListener('dragstart', e => e.preventDefault());
  railUpdate();
  $('#lbClose').addEventListener('click', lbClose);
  $('#lbNext').addEventListener('click', () => lbRender(lbIndex + 1, true));
  $('#lbPrev').addEventListener('click', () => lbRender(lbIndex - 1, true));
  lb.addEventListener('keydown', e => {
    if (e.key === 'Escape') lbClose();
    else if (e.key === 'ArrowLeft') lbRender(lbIndex + 1, true);   // RTL: left = next
    else if (e.key === 'ArrowRight') lbRender(lbIndex - 1, true);
    else if (e.key === 'Tab') {
      const f = $$('button', lb);
      const first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  });
  let tx = null;
  $('#lbStage').addEventListener('touchstart', e => { tx = e.touches[0].clientX; }, { passive: true });
  $('#lbStage').addEventListener('touchend', e => {
    if (tx === null) return;
    const dx = e.changedTouches[0].clientX - tx; tx = null;
    if (Math.abs(dx) > 40) lbRender(lbIndex + (dx > 0 ? 1 : -1), true);   // RTL: swipe right = next
  });

  /* ==========================================================================
     7 · Industries
     ========================================================================== */
  const indList = $('#industriesList'), pane = $('#industryPane');
  indList.innerHTML = C.industries.map((ind, i) => `
    <li class="ind" data-i="${i}">
      <button type="button" class="ind__row">
        <span class="ind__no mono">${ind.no} —</span>
        <span class="ind__name">${esc(ind.name)}</span>
        ${ind.line ? `<span class="ind__line">${esc(ind.line)}</span>` : '<span></span>'}
        ${C.flags.clientsApproved && C.clients[ind.client] ? `<span class="ind__logo"><img src="${C.clients[ind.client].logoColor || C.clients[ind.client].logo}" alt="${esc(C.clients[ind.client].name)}" loading="lazy"></span>` : '<span></span>'}
      </button>
    </li>`).join('');
  pane.remove();
  function showInd(i) {
    $$('.ind', indList).forEach(li => li.classList.toggle('is-on', +li.dataset.i === i));
  }
  indList.addEventListener('mouseover', e => { const li = e.target.closest('.ind'); if (li) showInd(+li.dataset.i); });
  indList.addEventListener('focusin', e => { const li = e.target.closest('.ind'); if (li) showInd(+li.dataset.i); });
  indList.addEventListener('click', e => { const li = e.target.closest('.ind'); if (li) showInd(+li.dataset.i); });
  showInd(0);

  /* ==========================================================================
     11b · FAQ — only questions that have an answer
     ========================================================================== */
  const faqItems = (C.faq || []).filter(f => f.a);
  if (!faqItems.length) $('#faq')?.remove();
  else $('#faqList').innerHTML = faqItems.map((f, i) => `
    <details class="faq__item"${i === 0 ? ' open' : ''}>
      <summary><span class="faq__q">${esc(f.q)}</span><span class="faq__icon" aria-hidden="true"></span></summary>
      <p class="faq__a">${esc(f.a)}</p>
    </details>`).join('');

  /* ==========================================================================
     8 · Data sheet — rows without real data are not shown
     ========================================================================== */
  const machines = C.machines.filter(m => m.real);
  const thumb = m => m.image
    ? `<img class="chamfer" src="${m.image.replace(/\.jpg$/, m.image.includes('lathe') ? '-480w.jpg' : '-640w.jpg')}" alt="${esc(m.alt)}" loading="lazy">`
    : '<span class="noimg" aria-hidden="true"></span>';
  // only columns that have at least one real value
  const cols = [
    { k: 'type', h: 'מכונה', td: m => `<div class="spec__thumb">${thumb(m)}<span>${esc(real([m.type, m.model]).join(' · '))}</span></div>` },
    { k: 'axes', h: 'צירים', num: true }, { k: 'table', h: 'שולחן', num: true }, { k: 'travel', h: 'מהלכים X/Y/Z', num: true }, { k: 'notes', h: '' }
  ].filter(c => c.td || machines.some(m => !isEmpty(m[c.k])));
  // header row only when there are real data columns (axes, travel) to label
  if (cols.some(c => ['axes', 'table', 'travel'].includes(c.k))) $('.spec--machines thead tr').innerHTML = cols.map(c => `<th scope="col">${c.h}</th>`).join('');
  else $('.spec--machines thead').remove();
  $('#machinesBody').innerHTML = machines.map(m => `<tr>${cols.map(c => `<td${c.num ? ' class="num"' : ''}>${c.td ? c.td(m) : (isEmpty(m[c.k]) ? '' : esc(m[c.k]))}</td>`).join('')}</tr>`).join('');
  $('#machinesCards').innerHTML = machines.map(m => `
    <div class="mcard">
      ${m.image ? `<img class="chamfer" src="${m.image}" alt="${esc(m.alt)}" loading="lazy">` : '<span class="noimg">תמונה בקרוב</span>'}
      <dl class="t-small">
        <dt class="mono">מכונה</dt><dd>${esc(real([m.type, m.model]).join(' · '))}</dd>
        ${m.axes ? `<dt class="mono">צירים</dt><dd class="num">${esc(m.axes)}</dd>` : ''}
        ${m.table ? `<dt class="mono">שולחן</dt><dd class="num">${esc(m.table)}</dd>` : ''}
        ${m.travel ? `<dt class="mono">מהלכים</dt><dd class="num">${esc(m.travel)}</dd>` : ''}
        ${m.notes ? `<dd class="mcard__note">${esc(m.notes)}</dd>` : ''}
      </dl>
    </div>`).join('');
  const R = C.ranges;
  $('#rangesKv').innerHTML = [
    ['רמת דיוק', R.precision && `עד <span class="ltr">${esc(R.precision)}</span>`],
    ['סוג עבודה', esc(R.series)],
    ['גודל חלק', R.partSize && esc(R.partSize)],
    ['גודל חלק מינ׳', R.partMin && `${esc(R.partMin)} mm`], ['גודל חלק מקס׳', R.partMax && `${esc(R.partMax)} mm`]
  ].filter(([, v]) => v).map(([k, v]) => `<div><dt class="mono">${k}</dt><dd>${v}</dd></div>`).join('');
  $('#rangesKv').style.setProperty('--n', $('#rangesKv').children.length);
  if (R.metrology) $('#metrology').textContent = R.metrology; else $('#metrologyBlock').remove();

  /* ==========================================================================
     9 · Quality
     ========================================================================== */
  // original-colour logos on the light quality section (mono versions sit on the dark sections)
  if (!(C.flags.clientsApproved && C.flags.clientsColorRow)) $('#trustList').remove();
  else $('#trustList').innerHTML = C.industries.map((ind, i) => {
    const cl = C.clients[ind.client];
    return cl ? `<li class="reveal" style="--i:${i}">
      <div class="trust__logo"><img src="${cl.logoColor || cl.logo}" alt="${esc(cl.name)}" loading="lazy"></div>
      <span class="trust__ind mono">${ind.no} · ${esc(ind.name)}</span>
    </li>` : '';
  }).join('');
  if (!real(C.qualityProcess).length) $('#qaBlock').remove();
  else $('#qaList').innerHTML = real(C.qualityProcess).map((s, i) => `<li class="reveal" style="--i:${i}"><span class="mono">${pad(i + 1)}</span><p>${esc(s)}</p></li>`).join('');

  /* ==========================================================================
     11 · Traveler — QC stamps by scroll
     ========================================================================== */
  const stamp = '<svg class="qc" viewBox="0 0 64 64" aria-hidden="true"><use href="#qc"/></svg>';
  const tvRows = (list) => list.map(s => `
    <li class="tv__row" data-no="${s.no}">
      <span class="tv__no mono">${s.no}</span>
      <span class="tv__name">${esc(s.name)}</span>
      <span class="tv__stampcell">${stamp}</span>
    </li>`).join('');
  const travelerRows = $('#travelerRows');
  travelerRows.innerHTML = tvRows(C.traveler) + `
    <li class="tv__row tv__row--cta">
      <span class="tv__no mono">→</span>
      <span class="tv__name">התחנה הראשונה היא שלכם: שלחו שרטוט.</span>
      <span><a class="btn btn--primary" href="#rfq">שלחו שרטוט לקבלת הצעת מחיר <span class="btn__arrow" aria-hidden="true">←</span></a></span>
    </li>`;
  const stampRow = row => {
    if (row.classList.contains('tv__row--cta')) { $$('.tv__row', travelerRows).forEach(r => r.classList.remove('is-current')); return; }
    if (row.classList.contains('is-stamped')) return;
    $$('.tv__row', travelerRows).forEach(r => r.classList.remove('is-current'));
    row.classList.add('is-stamped', 'is-current');
  };
  const tvIO = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) stampRow(e.target); });
  }, { rootMargin: '-40% 0px -40% 0px' });
  $$('.tv__row', travelerRows).forEach(r => tvIO.observe(r));

  /* ==========================================================================
     12 · Send a drawing — WhatsApp or email, the drawing is attached there
     ========================================================================== */
  const waText = 'שלום, אשמח להצעת מחיר. מצרף/ת את השרטוט.';
  if (C.contact.whatsappHref) $('#sendWa').href = `${C.contact.whatsappHref}?text=${encodeURIComponent(waText)}`;
  else $('#sendWa').remove();
  if (C.contact.email) $('#sendMail').href = `mailto:${C.contact.email}?subject=${encodeURIComponent('בקשה להצעת מחיר')}&body=${encodeURIComponent('שלום,\nאשמח להצעת מחיר. השרטוט מצורף.\n\nשם:\nחברה:\nכמות:\n')}`;
  else $('#sendMail').remove();
  // footer link opens the accessibility statement
  $('#a11yLink')?.addEventListener('click', e => { e.preventDefault(); const d = $('#a11y'); d.open = true; d.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' }); d.querySelector('summary').focus({ preventScroll: true }); });
  // inside a preview frame (e.g. a shared preview link) mailto:/tel: can't navigate the frame — open them in a new tab instead
  if (window.top !== window) document.addEventListener('click', e => {
    const l = e.target.closest('a[href^="mailto:"], a[href^="tel:"]');
    if (l) { e.preventDefault(); window.open(l.href, '_blank'); }
  }, true);

  /* ---------- go ---------- */
  watchPrimaries();
  observeReveal(document);
  onScroll();
})();
