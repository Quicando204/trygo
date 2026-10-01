/* ==========================================================
   TRYGO — animações (GSAP + ScrollTrigger)
   Melhoria progressiva: sem GSAP, ou com "reduzir movimento"
   ativo no sistema, o site funciona na mesma, só sem animação.
   ========================================================== */
(function () {
  'use strict';
  var root = document.documentElement;
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduce || !window.gsap || !window.ScrollTrigger) { root.classList.remove('pt-pending'); return; }

  gsap.registerPlugin(ScrollTrigger);
  ScrollTrigger.config({ ignoreMobileResize: true });
  root.classList.add('gsap-on');

  /* ---------- Fila: nada anima antes de a transição de entrada acabar ---------- */
  var ready = false, queue = [];
  function whenReady(fn) { if (ready) fn(); else queue.push(fn); }
  function flush() { if (ready) return; ready = true; queue.splice(0).forEach(function (f) { f(); }); }
  setTimeout(flush, 2600); /* rede de segurança */

  /* ---------- Separar texto em palavras (máscara) ---------- */
  var SPLIT = '.sec-head h2,.page-head h1,.ct-copy h1,.bh-text h1,.cta h2,.why-copy h2,.princ h2,.camp-copy h2,.info-head h2,.faq-head h2,.mf-head h2,.hero h1,.st-grid h2,.vm-item>p:not(.kicker),.band h2,.anat-head h2,.gl-head h2,.care h2,.about-prod h2';

  function splitWords(el) {
    var words = [];
    (function walk(node) {
      Array.prototype.slice.call(node.childNodes).forEach(function (n) {
        if (n.nodeType === 3) {
          var frag = document.createDocumentFragment();
          n.textContent.split(/(\s+)/).forEach(function (p) {
            if (!p) return;
            if (/^\s+$/.test(p)) { frag.appendChild(document.createTextNode(' ')); return; }
            var w = document.createElement('span'), i = document.createElement('span');
            w.className = 'w'; i.className = 'wi'; i.textContent = p; w.appendChild(i); frag.appendChild(w); words.push(i);
          });
          node.replaceChild(frag, n);
        } else if (n.nodeType === 1 && n.tagName !== 'BR') { walk(n); }
      });
    })(el);
    return words;
  }

  function initSplit(el) {
    var words = splitWords(el);
    if (el.matches('.st-grid h2')) {
      gsap.set(words, { opacity: .16 });
      gsap.to(words, { opacity: 1, stagger: .1, ease: 'none', scrollTrigger: { trigger: el, start: 'top 85%', end: 'bottom 50%', scrub: true } });
      return;
    }
    gsap.set(words, { yPercent: 118 });
    ScrollTrigger.create({
      trigger: el, start: 'top 90%', once: true,
      onEnter: function () { whenReady(function () { gsap.to(words, { yPercent: 0, duration: 1.15, ease: 'power4.out', stagger: .05 }); }); }
    });
  }

  /* ---------- Reveal geral (substitui o IntersectionObserver) ---------- */
  function delayOf(el) { return parseFloat(el.style.getPropertyValue('--d')) || 0; }

  function parallax(scope) {
    Array.prototype.forEach.call((scope || document).querySelectorAll('[data-par]:not([data-pd])'), function (img) {
      img.setAttribute('data-pd', '1');
      var amt = parseFloat(img.getAttribute('data-par')) || 7;
      gsap.set(img, { scale: 1.18 });
      gsap.fromTo(img, { yPercent: -amt }, {
        yPercent: amt, ease: 'none',
        scrollTrigger: { trigger: img.parentElement, start: 'top bottom', end: 'bottom top', scrub: true }
      });
    });
  }

  function magnetic(scope) {
    if (!window.matchMedia('(pointer: fine)').matches) return;
    Array.prototype.forEach.call((scope || document).querySelectorAll('.btn:not([data-mg])'), function (b) {
      b.setAttribute('data-mg', '1');
      var xt = gsap.quickTo(b, 'x', { duration: .5, ease: 'power3' }), yt = gsap.quickTo(b, 'y', { duration: .5, ease: 'power3' });
      b.addEventListener('mousemove', function (e) {
        var r = b.getBoundingClientRect();
        xt((e.clientX - r.left - r.width / 2) * .22); yt((e.clientY - r.top - r.height / 2) * .3);
      });
      b.addEventListener('mouseleave', function () { xt(0); yt(0); });
    });
  }

  window.TRYGO_REVEAL = function (scope) {
    Array.prototype.forEach.call((scope || document).querySelectorAll('.rv:not(.g)'), function (el) {
      el.classList.add('g');
      if (el.classList.contains('hv')) return;                       /* tratado em hero() */
      if (el.matches(SPLIT)) { el.classList.remove('rv'); initSplit(el); return; }
      gsap.set(el, { opacity: 0, y: 32 });
      ScrollTrigger.create({
        trigger: el, start: el.closest('.hero') ? 'top bottom' : 'top 92%', once: true,
        onEnter: function () { whenReady(function () { gsap.to(el, { opacity: 1, y: 0, duration: 1.05, ease: 'power3.out', delay: delayOf(el) }); }); }
      });
    });
    parallax(scope); magnetic(scope);
  };

  /* ---------- Hero (só na página inicial) ---------- */
  function hero() {
    var hv = document.querySelector('.hv'); if (!hv) return;
    var main = hv.querySelector('.hv-main'), img = main.querySelector('img'), box = hv.querySelector('.hv-box');
    hv.classList.remove('rv');
    gsap.set(hv, { opacity: 1, y: 0, '--gb': 0 });
    gsap.set(main, { clipPath: 'inset(0 0 100% 0)' });
    gsap.set(img, { scale: 1.4 });
    gsap.set(box, { xPercent: -45, opacity: 0, y: 40 });
    var tl = gsap.timeline({ paused: true, defaults: { ease: 'power3.out' } });
    tl.to(hv, { '--gb': 1, duration: 1.1 }, 0)
      .to(main, { clipPath: 'inset(0 0 0% 0)', duration: 1.4, ease: 'power4.inOut' }, .1)
      .to(img, { scale: 1, duration: 2, ease: 'power3.out' }, .1)
      .to(box, { xPercent: 0, y: 0, opacity: 1, duration: 1.1 }, .8);
    whenReady(function () { tl.play(); });

    if (window.matchMedia('(pointer: fine)').matches) {
      var mx = gsap.quickTo(main, 'x', { duration: 1.1, ease: 'power3' }), my = gsap.quickTo(main, 'y', { duration: 1.1, ease: 'power3' });
      var bx = gsap.quickTo(box, 'x', { duration: 1.4, ease: 'power3' }), by = gsap.quickTo(box, 'y', { duration: 1.4, ease: 'power3' });
      var area = document.querySelector('.hero');
      area.addEventListener('mousemove', function (e) {
        var nx = e.clientX / window.innerWidth - .5, ny = e.clientY / window.innerHeight - .5;
        mx(nx * -14); my(ny * -10); bx(nx * 28); by(ny * 18);
      });
    }
  }

  /* ---------- Faixa de palavras (reage à velocidade do scroll) ---------- */
  function marquee() {
    var tr = document.querySelector('.mq-track'); if (!tr) return;
    var tw = gsap.to(tr, { xPercent: -50, duration: 36, ease: 'none', repeat: -1 }), kick;
    ScrollTrigger.create({
      trigger: '.marquee', start: 'top bottom', end: 'bottom top',
      onUpdate: function (s) {
        var d = s.direction, boost = 1 + Math.min(Math.abs(s.getVelocity()) / 240, 7);
        if (kick) kick.kill();
        kick = gsap.timeline().to(tw, { timeScale: d * boost, duration: .15 }).to(tw, { timeScale: d, duration: .9 });
      }
    });
  }

  /* ---------- "Em três gestos": secção fixada com troca de passos ---------- */
  function gestos() {
    var sec = document.querySelector('.gestos'); if (!sec) return;
    var mm = gsap.matchMedia();
    mm.add('(min-width: 961px)', function () {
      var steps = sec.querySelectorAll('.g-step'), box = sec.querySelector('.g-box'), photo = sec.querySelector('.g-photo'), pimg = photo.querySelector('img'), bar = sec.querySelector('.g-bar i');
      gsap.set(steps, { autoAlpha: 0, y: 44 }); gsap.set(steps[0], { autoAlpha: 1, y: 0 });
      gsap.set(photo, { clipPath: 'inset(100% 0 0 0)' });
      var tl = gsap.timeline({
        defaults: { ease: 'power2.inOut' },
        scrollTrigger: { trigger: sec, start: 'top top', end: '+=2300', pin: true, scrub: .7, anticipatePin: 1 }
      });
      tl.to(bar, { scaleX: 1, ease: 'none', duration: 3.4 }, 0)
        .to(steps[0], { autoAlpha: 0, y: -44, duration: .5 }, 1)
        .fromTo(steps[1], { autoAlpha: 0, y: 44 }, { autoAlpha: 1, y: 0, duration: .5 }, 1.15)
        .to(photo, { clipPath: 'inset(0% 0 0 0)', duration: .8 }, 1)
        .to(box, { yPercent: -10, scale: .9, opacity: .25, duration: .8 }, 1)
        .to(steps[1], { autoAlpha: 0, y: -44, duration: .5 }, 2.2)
        .fromTo(steps[2], { autoAlpha: 0, y: 44 }, { autoAlpha: 1, y: 0, duration: .5 }, 2.35)
        .to(pimg, { scale: 1.45, transformOrigin: '52% 36%', duration: 1, ease: 'power1.inOut' }, 2.2)
        .to({}, { duration: .5 }, 2.9);
    });
    mm.add('(max-width: 960px)', function () {
      sec.querySelectorAll('.g-step').forEach(function (s) {
        gsap.from(s, { opacity: 0, y: 30, duration: .9, ease: 'power3.out', scrollTrigger: { trigger: s, start: 'top 90%', once: true } });
      });
    });
  }

  /* ---------- Mitos e factos: risca o mito, revela o facto ---------- */
  function mitos() {
    Array.prototype.forEach.call(document.querySelectorAll('.mf-row'), function (row) {
      var sp = row.querySelector('.myth span'), myth = row.querySelector('.myth'), fact = row.querySelector('.fact');
      gsap.set(sp, { '--lw': '0%' }); gsap.set(fact, { opacity: 0, y: 22 });
      var tl = gsap.timeline({ paused: true })
        .to(sp, { '--lw': '100%', duration: .8, ease: 'power3.inOut' })
        .to(myth, { opacity: .45, duration: .5 }, '<.3')
        .to(fact, { opacity: 1, y: 0, duration: .8, ease: 'power3.out' }, '-=.45');
      ScrollTrigger.create({ trigger: row, start: 'top 82%', once: true, onEnter: function () { whenReady(function () { tl.play(); }); } });
    });
  }

  /* ---------- Faixa da campanha ---------- */
  function band() {
    var b = document.querySelector('.band'); if (!b) return;
    var st = { trigger: b, scrub: true, start: 'top bottom', end: 'bottom top' };
    gsap.fromTo('.band-poster', { rotate: 8, y: 70 }, { rotate: -3, y: -50, ease: 'none', scrollTrigger: st });
    gsap.fromTo('.band-num', { xPercent: -6 }, { xPercent: 6, ease: 'none', scrollTrigger: st });
  }

  /* ---------- Anatomia da embalagem ---------- */
  function anat() {
    var a = document.querySelector('.anat'); if (!a) return;
    gsap.from(a.querySelectorAll('.hs'), {
      scale: 0, duration: .7, ease: 'back.out(2.4)', stagger: .15,
      scrollTrigger: { trigger: a.querySelector('.anat-img'), start: 'top 70%', once: true }
    });
  }

  /* ---------- Entrada e saída entre páginas ---------- */
  var pt = document.createElement('div');
  pt.className = 'pt'; pt.setAttribute('aria-hidden', 'true');
  var seen = false;
  try { seen = sessionStorage.getItem('trygo-seen') === '1'; sessionStorage.setItem('trygo-seen', '1'); } catch (e) {}
  pt.innerHTML = seen ? '' : '<img src="assets/logo/trygo-logo.jpg" alt="" width="190" height="91">';
  document.body.appendChild(pt);
  root.classList.remove('pt-pending');

  var intro = gsap.timeline({ onComplete: function () { pt.style.display = 'none'; } });
  if (!seen) { intro.from(pt.querySelector('img'), { opacity: 0, y: 14, duration: .6, ease: 'power3.out' }).to({}, { duration: .35 }); }
  intro.to(pt, { yPercent: -100, duration: .85, ease: 'power4.inOut' }, seen ? 0 : '>')
       .add(flush, '-=.35');

  document.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('a[href]');
    if (!a || e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button) return;
    var h = a.getAttribute('href');
    if (!h || h.charAt(0) === '#' || a.target === '_blank' || a.hasAttribute('download') || /^(https?:|tel:|mailto:)/.test(h)) return;
    var u; try { u = new URL(a.href); } catch (err) { return; }
    if (u.pathname === location.pathname && u.hash) return;
    e.preventDefault();
    pt.innerHTML = ''; pt.style.display = '';
    gsap.set(pt, { yPercent: 100 });
    gsap.to(pt, { yPercent: 0, duration: .65, ease: 'power3.inOut', onComplete: function () { location.href = a.href; } });
  });
  window.addEventListener('pageshow', function (e) { if (e.persisted) { pt.style.display = 'none'; } });

  /* ---------- Arranque ---------- */
  hero(); marquee(); gestos(); mitos(); band(); anat();
  function refresh() { ScrollTrigger.refresh(); }
  window.addEventListener('load', refresh);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(refresh);
})();
