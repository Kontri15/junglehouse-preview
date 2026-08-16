/* Jungle House · one-page interactions */
(() => {
  'use strict';

  const staticMode = new URLSearchParams(location.search).has('static');
  const reduceMotion = staticMode || window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (staticMode) {
    document.documentElement.style.scrollBehavior = 'auto';
    document.documentElement.classList.add('static');
    document.querySelectorAll('.reveal').forEach((el) => el.classList.add('in'));
  }

  /* ---------- nav: background on scroll ---------- */
  const nav = document.getElementById('nav');
  const onNavScroll = () => nav.classList.toggle('scrolled', window.scrollY > 24);
  onNavScroll();
  window.addEventListener('scroll', onNavScroll, { passive: true });

  /* ---------- mobile menu ---------- */
  const toggle = document.getElementById('nav-toggle');
  const links = document.getElementById('nav-links');
  const inertTargets = () => [document.querySelector('main'), document.querySelector('footer'), document.getElementById('to-top')];
  const setMenu = (open) => {
    document.body.classList.toggle('menu-open', open);
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Zavrieť menu' : 'Otvoriť menu');
    inertTargets().forEach((el) => { if (el) el.inert = open; });
  };
  const closeMenu = () => setMenu(false);
  toggle.addEventListener('click', () => setMenu(!document.body.classList.contains('menu-open')));
  links.addEventListener('click', (e) => {
    if (e.target.closest('a')) closeMenu();
  });
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && document.body.classList.contains('menu-open')) closeMenu();
  });

  /* ---------- scrollspy ---------- */
  const hasIO = 'IntersectionObserver' in window;
  const sections = ['o-nas', 'tateri', 'faq', 'kontakt']
    .map((id) => document.getElementById(id))
    .filter(Boolean);
  const navAnchors = [...links.querySelectorAll('a[href^="#"]:not(.btn)')];
  if (hasIO) {
    const spy = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        navAnchors.forEach((a) =>
          a.setAttribute('aria-current', a.getAttribute('href') === `#${entry.target.id}` ? 'true' : 'false')
        );
      });
    }, { rootMargin: '-40% 0px -55% 0px' });
    sections.forEach((s) => spy.observe(s));
  }

  /* ---------- scroll reveals (fire once, default visible without JS) ---------- */
  if (!reduceMotion && hasIO) {
    const revealer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          revealer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -8% 0px' });
    document.querySelectorAll('.reveal').forEach((el) => revealer.observe(el));
  } else {
    document.querySelectorAll('.reveal').forEach((el) => el.classList.add('in'));
  }

  /* ---------- subtle parallax on hero + band (transform only) ---------- */
  const heroImg = document.getElementById('hero-img');
  const bandImg = document.getElementById('band-img');
  if (!reduceMotion) {
    let ticking = false;
    const parallax = () => {
      ticking = false;
      const y = window.scrollY;
      if (heroImg && y < window.innerHeight * 1.2) {
        heroImg.style.transform = `translateY(${y * 0.12}px)`;
      }
      if (bandImg) {
        const r = bandImg.parentElement.getBoundingClientRect();
        if (r.bottom > 0 && r.top < window.innerHeight) {
          const p = (r.top + r.height / 2 - window.innerHeight / 2) / window.innerHeight;
          bandImg.style.transform = `translateY(${p * -34}px)`;
        }
      }
    };
    window.addEventListener('scroll', () => {
      if (!ticking) { ticking = true; requestAnimationFrame(parallax); }
    }, { passive: true });
    parallax();
  }

  /* ---------- hero atmosphere: leaf layers (scroll + pointer depth) ---------- */
  const hero = document.querySelector('.hero');
  const leaves = [...document.querySelectorAll('.hero-leaf')];
  const finePointer = window.matchMedia('(pointer: fine)').matches;
  if (hero && leaves.length && !reduceMotion) {
    let tx = 0, ty = 0, mx = 0, my = 0;
    let heroVisible = !hasIO;
    let running = false, rafId = 0, lastSy = -1;
    const tick = () => {
      const sy = window.scrollY;
      mx += (tx - mx) * 0.055;
      my += (ty - my) * 0.055;
      if (Math.abs(tx - mx) < 0.002 && Math.abs(ty - my) < 0.002 && sy === lastSy) {
        running = false;
        return;
      }
      lastSy = sy;
      leaves.forEach((leaf) => {
        const d = parseFloat(leaf.dataset.depth || '0.5');
        const x = mx * -30 * d;
        const y = my * -20 * d - sy * 0.22 * d;
        leaf.style.transform = `translate3d(${x.toFixed(2)}px, ${y.toFixed(2)}px, 0)`;
      });
      rafId = requestAnimationFrame(tick);
    };
    const kick = () => {
      if (!running && heroVisible) {
        running = true;
        rafId = requestAnimationFrame(tick);
      }
    };
    if (finePointer) {
      window.addEventListener('pointermove', (e) => {
        tx = (e.clientX / window.innerWidth - 0.5) * 2;
        ty = (e.clientY / window.innerHeight - 0.5) * 2;
        kick();
      }, { passive: true });
    }
    window.addEventListener('scroll', kick, { passive: true });
    if (hasIO) {
      new IntersectionObserver((entries) => {
        entries.forEach((e) => {
          heroVisible = e.isIntersecting;
          if (heroVisible) kick();
          else { running = false; cancelAnimationFrame(rafId); }
        });
      }).observe(hero);
    } else {
      kick();
    }
  }

  /* ---------- hero atmosphere: fireflies ---------- */
  const ffWrap = document.getElementById('fireflies');
  if (ffWrap && !reduceMotion) {
    const frag = document.createDocumentFragment();
    for (let i = 0; i < 11; i++) {
      const f = document.createElement('i');
      f.className = 'firefly';
      f.style.setProperty('--x', (4 + Math.random() * 92).toFixed(1) + '%');
      f.style.setProperty('--y', (8 + Math.random() * 78).toFixed(1) + '%');
      f.style.setProperty('--s', (2.5 + Math.random() * 2.5).toFixed(1) + 'px');
      f.style.setProperty('--dx', ((Math.random() - 0.5) * 170).toFixed(0) + 'px');
      f.style.setProperty('--dy', ((Math.random() - 0.5) * 130).toFixed(0) + 'px');
      f.style.setProperty('--dur', (9 + Math.random() * 9).toFixed(1) + 's');
      f.style.setProperty('--delay', (-Math.random() * 14).toFixed(1) + 's');
      f.style.setProperty('--o', (0.3 + Math.random() * 0.45).toFixed(2));
      frag.appendChild(f);
    }
    ffWrap.appendChild(frag);
  }

  /* ---------- hero HUD: live clock ---------- */
  const hudTime = document.getElementById('hud-time');
  if (hudTime) {
    const setTime = () => {
      hudTime.textContent = new Date().toLocaleTimeString('sk-SK', { hour: '2-digit', minute: '2-digit' });
    };
    setTime();
    setInterval(setTime, 30000);
  }

  /* ---------- band marquee: run only on screen ---------- */
  const band = document.querySelector('.band');
  if (band && hasIO) {
    new IntersectionObserver((entries) => {
      entries.forEach((e) => band.classList.toggle('run', e.isIntersecting));
    }).observe(band);
  } else if (band) {
    band.classList.add('run');
  }

  /* ---------- magnetic CTA buttons ---------- */
  if (!reduceMotion && finePointer) {
    document.querySelectorAll('.hero .btn, .nav-inner > nav .btn').forEach((btn) => {
      btn.addEventListener('pointermove', (e) => {
        const r = btn.getBoundingClientRect();
        const x = ((e.clientX - r.left) / r.width - 0.5) * 10;
        const y = ((e.clientY - r.top) / r.height - 0.5) * 8;
        btn.style.setProperty('--mx', `${x.toFixed(1)}px`);
        btn.style.setProperty('--my', `${y.toFixed(1)}px`);
      });
      btn.addEventListener('pointerleave', () => {
        btn.style.removeProperty('--mx');
        btn.style.removeProperty('--my');
      });
    });
  }

  /* ---------- scroll progress hairline ---------- */
  const progress = document.getElementById('progress');
  if (progress) {
    let pTicking = false;
    const setProgress = () => {
      pTicking = false;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      progress.style.transform = `scaleX(${max > 0 ? Math.min(window.scrollY / max, 1).toFixed(4) : 0})`;
    };
    window.addEventListener('scroll', () => {
      if (!pTicking) { pTicking = true; requestAnimationFrame(setProgress); }
    }, { passive: true });
    setProgress();
  }

  /* ---------- back to top ---------- */
  const toTop = document.getElementById('to-top');
  const onTopScroll = () => toTop.classList.toggle('show', window.scrollY > window.innerHeight * 2);
  onTopScroll();
  window.addEventListener('scroll', onTopScroll, { passive: true });
  toTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
  });

  /* ---------- FAQ: category toggle + accordion ---------- */
  const tabs = [...document.querySelectorAll('.faq-tab')];
  tabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      tabs.forEach((t) => {
        const selected = t === tab;
        t.setAttribute('aria-pressed', String(selected));
        document.getElementById(t.getAttribute('aria-controls')).hidden = !selected;
      });
    });
  });
  document.querySelectorAll('.faq-q').forEach((q) => {
    q.addEventListener('click', () => {
      const open = q.getAttribute('aria-expanded') === 'true';
      q.setAttribute('aria-expanded', String(!open));
    });
  });

  /* ---------- artist CTA presets the form select ---------- */
  const artistSelect = document.getElementById('f-tater');
  document.querySelectorAll('[data-artist]').forEach((btn) => {
    btn.addEventListener('click', () => {
      artistSelect.value = btn.dataset.artist;
    });
  });

  /* ---------- gallery lightbox ---------- */
  const lightbox = document.getElementById('lightbox');
  const lbImg = document.getElementById('lb-img');
  const lbText = document.getElementById('lb-text');
  const lbCount = document.getElementById('lb-count');
  let gallery = [];
  let index = 0;
  let pushedState = false;

  const renderSlide = () => {
    const item = gallery[index];
    lbImg.src = item.src;
    lbImg.alt = item.alt;
    lbText.textContent = item.alt;
    lbCount.textContent = `${index + 1} / ${gallery.length}`;
    // preload neighbours
    [index + 1, index - 1].forEach((i) => {
      const n = gallery[(i + gallery.length) % gallery.length];
      if (n) new Image().src = n.src;
    });
  };
  const openLightbox = (items, start) => {
    if (typeof lightbox.showModal !== 'function') {
      window.open(items[start].src, '_blank');
      return;
    }
    gallery = items;
    index = start;
    renderSlide();
    lightbox.showModal();
    if (!history.state || !history.state.lightbox) {
      history.pushState({ lightbox: true }, '');
      pushedState = true;
    }
  };
  const step = (dir) => {
    index = (index + dir + gallery.length) % gallery.length;
    renderSlide();
  };

  document.querySelectorAll('.gallery').forEach((list) => {
    const tiles = [...list.querySelectorAll('.tile')];
    const items = tiles.map((t) => {
      const img = t.querySelector('img');
      return { src: img.currentSrc || img.src, alt: img.alt };
    });
    tiles.forEach((tile, i) => {
      tile.addEventListener('click', () => openLightbox(items, i));
    });
  });

  document.getElementById('lb-prev').addEventListener('click', () => step(-1));
  document.getElementById('lb-next').addEventListener('click', () => step(1));
  document.getElementById('lb-close').addEventListener('click', () => lightbox.close());
  lightbox.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') step(-1);
    if (e.key === 'ArrowRight') step(1);
  });
  // click on backdrop closes
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) lightbox.close();
  });
  // swipe
  let touchX = null;
  lightbox.addEventListener('touchstart', (e) => { touchX = e.changedTouches[0].clientX; }, { passive: true });
  lightbox.addEventListener('touchend', (e) => {
    if (touchX === null) return;
    const dx = e.changedTouches[0].clientX - touchX;
    if (Math.abs(dx) > 48) step(dx > 0 ? -1 : 1);
    touchX = null;
  }, { passive: true });
  // Android back button closes the lightbox instead of leaving the site
  window.addEventListener('popstate', () => {
    if (lightbox.open) { pushedState = false; lightbox.close(); }
  });
  lightbox.addEventListener('close', () => {
    if (pushedState) { pushedState = false; history.back(); }
    lbImg.removeAttribute('src');
  });

  /* ---------- in-page anchors: JS scroll, no hash navigation ----------
     (hash navigation reloads the page in sandboxed previews; JS scroll
     also guarantees smooth behavior after the mobile menu closes) */
  document.querySelectorAll('a[href^="#"]').forEach((a) => {
    a.addEventListener('click', (e) => {
      const id = a.getAttribute('href').slice(1);
      const target = id && document.getElementById(id);
      if (!target) return;
      e.preventDefault();
      if (document.body.classList.contains('menu-open')) closeMenu();
      const behavior = window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth';
      target.scrollIntoView({ behavior, block: 'start' });
      try { history.replaceState(null, '', '#' + id); } catch (_) { /* sandboxed preview */ }
    });
  });

  /* ---------- form: uploads with preview + client-side downscale ---------- */
  const MAX_REF = 4;
  const MAX_EDGE = 1600;
  let uploadsPending = 0;

  const looksLikeImage = (f) =>
    f.type.startsWith('image/') || /\.(heic|heif|jpe?g|png|webp|gif)$/i.test(f.name);

  const downscale = (file) => new Promise((resolve) => {
    if (!file.type.startsWith('image/') || file.type === 'image/gif') return resolve(file);
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      const scale = Math.min(1, MAX_EDGE / Math.max(img.width, img.height));
      if (scale === 1 && file.size < 1.5e6) { URL.revokeObjectURL(url); return resolve(file); }
      const canvas = document.createElement('canvas');
      canvas.width = Math.round(img.width * scale);
      canvas.height = Math.round(img.height * scale);
      const ctx = canvas.getContext('2d');
      ctx.fillStyle = '#fff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      canvas.toBlob((blob) => {
        URL.revokeObjectURL(url);
        if (!blob) return resolve(file);
        resolve(new File([blob], file.name.replace(/\.\w+$/, '') + '.jpg', { type: 'image/jpeg' }));
      }, 'image/jpeg', 0.8);
    };
    img.onerror = () => { URL.revokeObjectURL(url); resolve(file); };
    img.src = url;
  });

  const setupUpload = (inputId, listId, maxFiles) => {
    const input = document.getElementById(inputId);
    const list = document.getElementById(listId);
    const zone = input.closest('.dropzone');
    let files = [];

    const sync = () => {
      try {
        const dt = new DataTransfer();
        files.forEach((f) => dt.items.add(f));
        input.files = dt.files;
      } catch (_) {
        // DataTransfer constructor unavailable: keep the native selection as-is
      }
      list.querySelectorAll('img').forEach((im) => URL.revokeObjectURL(im.src));
      list.innerHTML = '';
      files.forEach((f, i) => {
        const li = document.createElement('li');
        const img = document.createElement('img');
        img.alt = '';
        img.onerror = () => {
          img.remove();
          li.classList.add('file-chip');
          li.insertAdjacentText('afterbegin', f.name);
        };
        img.src = URL.createObjectURL(f);
        const rm = document.createElement('button');
        rm.type = 'button';
        rm.className = 'rm';
        rm.setAttribute('aria-label', `Odstrániť fotku ${f.name}`);
        rm.innerHTML = '<svg class="icn" aria-hidden="true"><use href="#i-x"/></svg>';
        rm.addEventListener('click', () => {
          files.splice(i, 1);
          sync();
        });
        li.append(img, rm);
        list.append(li);
      });
    };

    const addFiles = async (fileList) => {
      uploadsPending += 1;
      try {
        for (const f of [...fileList]) {
          if (files.length >= maxFiles) break;
          if (!looksLikeImage(f)) continue;
          files.push(await downscale(f));
        }
        sync();
      } finally {
        uploadsPending -= 1;
      }
    };

    input.addEventListener('change', () => {
      const incoming = [...input.files];
      files = [];
      addFiles(incoming.slice(0, maxFiles));
    });
    zone.addEventListener('dragover', (e) => { e.preventDefault(); zone.classList.add('drag'); });
    zone.addEventListener('dragleave', () => zone.classList.remove('drag'));
    zone.addEventListener('drop', (e) => {
      e.preventDefault();
      zone.classList.remove('drag');
      addFiles([...e.dataTransfer.files].slice(0, maxFiles - files.length));
    });
  };
  setupUpload('f-ref', 'prev-ref', MAX_REF);
  setupUpload('f-miesto', 'prev-miesto', 1);

  /* ---------- form validation ---------- */
  const form = document.getElementById('rezervacia');
  const status = document.getElementById('f-status');
  const validateField = (el) => {
    const field = el.closest('.field');
    if (!field || !el.required) return true;
    const ok = el.checkValidity();
    field.classList.toggle('invalid', !ok);
    el.setAttribute('aria-invalid', String(!ok));
    return ok;
  };
  form.querySelectorAll('input[required], textarea[required]').forEach((el) => {
    el.addEventListener('blur', () => validateField(el));
    el.addEventListener('input', () => {
      if (el.closest('.field').classList.contains('invalid')) validateField(el);
    });
  });
  form.addEventListener('submit', (e) => {
    const fields = [...form.querySelectorAll('input[required], textarea[required]')];
    const allValid = fields.map(validateField).every(Boolean);
    if (!allValid) {
      e.preventDefault();
      fields.find((f) => !f.checkValidity())?.focus();
      status.className = 'form-status fail';
      status.textContent = 'Skontroluj prosím zvýraznené polia.';
      return;
    }
    if (uploadsPending > 0) {
      e.preventDefault();
      status.className = 'form-status fail';
      status.textContent = 'Ešte spracúvame fotky, skús to o chvíľu znova.';
      return;
    }
    const submit = document.getElementById('f-submit');
    submit.disabled = true;
    document.getElementById('f-submit-label').textContent = 'Odosielam…';
    status.className = 'form-status';
    status.textContent = '';
  });

  // restore the form when the user comes back via bfcache after submitting
  window.addEventListener('pageshow', (e) => {
    if (!e.persisted) return;
    const submit = document.getElementById('f-submit');
    submit.disabled = false;
    document.getElementById('f-submit-label').textContent = 'Odoslať dopyt';
    status.className = 'form-status';
    status.textContent = '';
  });
})();
