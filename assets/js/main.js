(function () {
  'use strict';
  var D = window.TRYGO || { products: [], categories: [] };
  var root = document.documentElement;
  root.classList.add('js');

  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  var esc = function (s) { return String(s).replace(/[&<>"']/g, function (m) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[m]; }); };
  var ARROW = '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M2 8h11M9 3.5 13.5 8 9 12.5"/></svg>';
  var PH = '<span class="ph">A preencher</span>';

  /* ---------- Header, menu, topo ---------- */
  var hdr = $('#hdr'), totop = $('#totop');
  function onScroll() {
    if (hdr) hdr.classList.toggle('stuck', window.scrollY > 20);
    if (totop) totop.classList.toggle('show', window.scrollY > 700);
  }
  window.addEventListener('scroll', onScroll, { passive: true }); onScroll();
  if (totop) totop.addEventListener('click', function () { window.scrollTo({ top: 0, behavior: 'smooth' }); });

  var burger = $('#burger'), mobile = $('#mobile');
  function closeMenu() {
    document.body.classList.remove('menu-open');
    if (burger) { burger.setAttribute('aria-expanded', 'false'); burger.setAttribute('aria-label', 'Abrir menu'); }
    if (mobile) mobile.setAttribute('aria-hidden', 'true');
  }
  if (burger) burger.addEventListener('click', function () {
    var open = !document.body.classList.contains('menu-open');
    document.body.classList.toggle('menu-open', open);
    burger.setAttribute('aria-expanded', open); burger.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
    mobile.setAttribute('aria-hidden', !open);
  });
  $$('#mobile a').forEach(function (a) { a.addEventListener('click', closeMenu); });
  window.addEventListener('resize', function () { if (innerWidth > 960) closeMenu(); });

  /* ---------- Reveal ---------- */
  var io = 'IntersectionObserver' in window ? new IntersectionObserver(function (es) {
    es.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); } });
  }, { threshold: .12, rootMargin: '0px 0px -6% 0px' }) : null;
  function observe(scope) {
    if (window.TRYGO_REVEAL) { window.TRYGO_REVEAL(scope); return; }   /* GSAP (anim.js) */
    $$('.rv', scope).forEach(function (el) { if (io) io.observe(el); else el.classList.add('in'); });
  }

  /* ---------- Modal genérico ---------- */
  var modal, mbox, mcontent, lastFocus;
  function buildModal() {
    if (modal) return;
    modal = document.createElement('div');
    modal.className = 'modal'; modal.setAttribute('role', 'dialog'); modal.setAttribute('aria-modal', 'true'); modal.setAttribute('aria-labelledby', 'm-title'); modal.setAttribute('aria-hidden', 'true');
    modal.innerHTML = '<div class="bd" data-close></div><div class="box" tabindex="-1"><button class="mclose" data-close aria-label="Fechar"><svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="m2.5 2.5 11 11m0-11-11 11"/></svg></button><div class="mc"></div></div>';
    document.body.appendChild(modal);
    mbox = $('.box', modal); mcontent = $('.mc', modal);
    modal.addEventListener('click', function (e) { if (e.target.closest('[data-close]')) closeModal(); });
  }
  function openModal(html) {
    buildModal(); lastFocus = document.activeElement; mcontent.innerHTML = html; mbox.scrollTop = 0;
    modal.classList.add('show'); modal.setAttribute('aria-hidden', 'false'); document.body.style.overflow = 'hidden';
    setTimeout(function () { mbox.focus({ preventScroll: true }); }, 50);
  }
  function closeModal() {
    if (!modal) return;
    modal.classList.remove('show'); modal.setAttribute('aria-hidden', 'true'); document.body.style.overflow = '';
    if (lastFocus && lastFocus.focus) lastFocus.focus({ preventScroll: true });
  }
  function trap(e, container, fallback) {
    var f = $$('button,a[href],[tabindex="0"]', container).filter(function (x) { return x.offsetParent !== null; });
    if (!f.length) return;
    var a = f[0], z = f[f.length - 1];
    if (e.shiftKey && (document.activeElement === a || document.activeElement === fallback)) { e.preventDefault(); z.focus(); }
    else if (!e.shiftKey && document.activeElement === z) { e.preventDefault(); a.focus(); }
  }

  /* ---------- Conteúdo: artigos e textos legais ---------- */
  var NOTE = '<div class="note-box"><b>Nota</b>Estas são orientações gerais. Siga sempre as instruções e as informações oficiais que constam da embalagem do produto.</div>';
  var ARTS = {
    usar: {
      k: 'Informação · 01', t: 'Como usar corretamente', h:
        '<p>Usado da forma certa, o preservativo é um método eficaz de proteção. Tudo começa antes de abrir a embalagem.</p><ol>' +
        '<li>Verifique a data de validade e se a embalagem está intacta.</li>' +
        '<li>Abra com cuidado, com os dedos. Nunca use dentes, tesoura ou unhas.</li>' +
        '<li>Confirme o sentido: o preservativo deve desenrolar-se com facilidade.</li>' +
        '<li>Coloque-o antes de qualquer contacto íntimo, apertando a ponta para não ficar ar no reservatório.</li>' +
        '<li>Desenrole-o até à base.</li>' +
        '<li>No final, segure na base e retire com cuidado, antes de perder a firmeza.</li>' +
        '<li>Dê um nó, embrulhe em papel e deite no lixo. Nunca na sanita.</li></ol>' +
        '<h3>Um preservativo, uma utilização</h3><p>Nunca reutilize. Se tiver dúvidas durante a colocação, descarte e use um novo.</p>' +
        '<h3>Lubrificantes</h3><p>Consulte a embalagem. Com preservativos de látex, use apenas lubrificantes à base de água ou de silicone: óleos, vaselina e cremes podem danificá-los.</p>' + NOTE
    },
    escolher: {
      k: 'Informação · 02', t: 'Como escolher', h:
        '<p>Não existe uma escolha única. O melhor preservativo é aquele que serve bem e que se usa sempre.</p>' +
        '<h3>Ajuste</h3><p>Um preservativo demasiado largo pode escorregar. Um demasiado justo pode romper. O ajuste confortável é importante para a segurança.</p>' +
        '<h3>Material</h3><p>Verifique na embalagem de que material é feito o produto. Se tem alergia a algum material, fale com um profissional de saúde.</p>' +
        '<h3>Espessura, lubrificação e textura</h3><p>São preferências pessoais. Experimente com calma e leia sempre a descrição na embalagem.</p>' +
        '<h3>Antes de adquirir</h3><ul class="dots"><li>Verifique a validade.</li><li>Confirme que a embalagem não está danificada.</li><li>Prefira marcas e pontos de venda de confiança.</li></ul>' + NOTE
    },
    conservar: {
      k: 'Informação · 03', t: 'Como conservar', h:
        '<p>Um bom preservativo pode perder qualidade se for mal guardado.</p><ul class="dots">' +
        '<li>Guarde em local fresco e seco.</li>' +
        '<li>Evite calor e luz solar direta, como no painel de um carro.</li>' +
        '<li>Não deixe muito tempo em carteiras ou bolsos, onde o atrito pode danificar a embalagem.</li>' +
        '<li>Não use objetos cortantes para abrir.</li></ul>' +
        '<h3>Validade</h3><p>A data vem impressa na embalagem. Depois dela, não utilize.</p>' +
        '<h3>Quando descartar</h3><p>Se a embalagem estiver rasgada, seca, pegajosa ou com aspeto alterado, descarte o produto e use um novo.</p>' + NOTE
    },
    privacidade: {
      k: 'Legal', t: 'Política de Privacidade', h:
        '<p><span class="ph">Texto demonstrativo</span></p><p>Esta página deve ser substituída pela política de privacidade oficial da TRYGO, redigida e validada pela empresa.</p><p>Deve descrever que dados pessoais são recolhidos (por exemplo, através do formulário de contacto), para que finalidade, durante quanto tempo e como exercer os respetivos direitos.</p>'
    },
    termos: {
      k: 'Legal', t: 'Termos de Utilização', h:
        '<p><span class="ph">Texto demonstrativo</span></p><p>Esta página deve ser substituída pelos termos de utilização oficiais da TRYGO.</p><p>O conteúdo deste site é meramente informativo e não substitui o aconselhamento de um profissional de saúde.</p>'
    }
  };
  function artHTML(a) { return '<div class="art-box"><div class="kicker">' + a.k + '</div><h2 id="m-title">' + a.t + '</h2>' + a.h + '</div>'; }
  document.addEventListener('click', function (e) {
    var t = e.target.closest('[data-art]');
    if (t && ARTS[t.dataset.art]) { openModal(artHTML(ARTS[t.dataset.art])); }
  });

  /* ---------- Produtos: helpers ---------- */
  function mediaHTML(p) {
    var i = p.images || [];
    if (!i.length) return '<div class="media"></div>';
    return '<div class="media"><img class="m-main" data-par="6" src="' + esc(i[0].src) + '" alt="' + esc(i[0].alt) + '" loading="lazy">' +
      (i[1] ? '<img class="m-sub" src="' + esc(i[1].src) + '" alt="' + esc(i[1].alt) + '" loading="lazy">' : '') + '</div>';
  }
  function detailHref(p) { return 'produto.html?id=' + encodeURIComponent(p.id); }

  /* Destaques (home) */
  var feat = $('#featured');
  if (feat) {
    var list = D.products.slice(0, 3);
    feat.setAttribute('data-count', list.length);
    feat.innerHTML = list.map(function (p, i) {
      return '<article class="fcard rv" style="--d:' + (i * .08) + 's"><a class="media-link" href="' + detailHref(p) + '" aria-label="Ver ' + esc(p.name) + '" tabindex="-1">' + mediaHTML(p) + '</a>' +
        '<div class="fbody"><p class="kicker">' + esc(p.type || '') + '</p><h3>' + esc(p.name) + (p.nameEn ? '<span class="en">' + esc(p.nameEn) + '</span>' : '') + '</h3>' +
        '<p class="desc">' + esc(p.short) + '</p><a class="btn btn-green" href="' + detailHref(p) + '">Ver produto ' + ARROW + '</a></div></article>';
    }).join('');
    observe(feat);
  }

  /* Lista + filtros (produtos.html) */
  var plist = $('#plist');
  if (plist) {
    var filt = $('#filters'), current = 'Todos';
    function renderList() {
      var items = D.products.filter(function (p) { return current === 'Todos' || p.category === current; });
      if (!items.length) { plist.innerHTML = '<p class="empty">Não há produtos nesta categoria.</p>'; return; }
      plist.innerHTML = items.map(function (p) {
        return '<article class="prow rv"><a class="pr-media media-link" href="' + detailHref(p) + '" aria-label="Ver ' + esc(p.name) + '" tabindex="-1">' + mediaHTML(p) + '</a>' +
          '<div class="pbody"><p class="kicker">' + esc(p.category || p.type || '') + '</p><h2>' + esc(p.name) + (p.nameEn ? '<span>' + esc(p.nameEn) + '</span>' : '') + '</h2>' +
          '<p class="desc">' + esc(p.short) + '</p>' +
          '<ul class="feats">' + (p.features || []).map(function (f) { return '<li>' + esc(f) + '</li>'; }).join('') + '</ul>' +
          '<a class="btn btn-green" href="' + detailHref(p) + '">Ver detalhes ' + ARROW + '</a></div></article>';
      }).join('');
      observe(plist);
    }
    var used = D.categories.filter(function (c) { return D.products.some(function (p) { return p.category === c; }); });
    D.products.forEach(function (p) { if (p.category && used.indexOf(p.category) < 0) used.push(p.category); });
    if (filt && used.length >= 2) {
      filt.hidden = false;
      filt.innerHTML = ['Todos'].concat(used).map(function (c) { return '<button type="button" aria-pressed="' + (c === 'Todos') + '">' + esc(c) + '</button>'; }).join('');
      filt.addEventListener('click', function (e) {
        var b = e.target.closest('button'); if (!b) return;
        current = b.textContent;
        $$('button', filt).forEach(function (x) { x.setAttribute('aria-pressed', x === b); });
        renderList();
      });
    }
    renderList();
  }

  /* ---------- Página de produto ---------- */
  var pd = $('#pd');
  if (pd) {
    var id = new URLSearchParams(location.search).get('id');
    var p = D.products.filter(function (x) { return x.id === id; })[0] || D.products[0];
    if (!p) { pd.innerHTML = '<p class="empty">Produto não encontrado. <a class="link" href="produtos.html">Ver todos os produtos</a></p>'; }
    else {
      document.title = p.name + ' — TRYGO';
      var md = $('meta[name="description"]'); if (md) md.setAttribute('content', p.name + ': ' + p.short);
      var ogt = $('meta[property="og:title"]'); if (ogt) ogt.setAttribute('content', p.name + ' — TRYGO');
      var cr = $('#crumb-name'); if (cr) cr.textContent = p.name;
      var imgs = p.images || [], idx = 0;
      var val = function (v) { return v ? esc(v) : PH; };
      pd.innerHTML =
        '<div class="gallery"><button type="button" class="gal-main" id="gal-main" aria-label="Ampliar imagem"><img id="gal-img" src="" alt=""><span class="zoom-ic" aria-hidden="true"><svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="8.5" cy="8.5" r="5.5"/><path d="m13 13 5 5M8.5 6v5M6 8.5h5"/></svg></span></button>' +
        (imgs.length > 1 ? '<div class="thumbs" id="thumbs" role="group" aria-label="Imagens do produto">' + imgs.map(function (im, i) { return '<button type="button" data-i="' + i + '" aria-label="Ver imagem ' + (i + 1) + '"><img src="' + esc(im.src) + '" alt="' + esc(im.alt) + '" loading="lazy" style="object-fit:cover"></button>'; }).join('') + '</div>' : '') + '</div>' +
        '<div class="pd-info"><p class="kicker">' + esc(p.type || p.category || '') + '</p><h1>' + esc(p.name) + (p.nameEn ? '<span>' + esc(p.nameEn) + '</span>' : '') + '</h1>' +
        '<p class="lead">' + esc(p.short) + '</p>' +
        '<ul class="pd-feats">' + (p.features || []).map(function (f) { return '<li>' + esc(f) + '</li>'; }).join('') + '</ul>' +
        '<dl class="specs"><div><dt>Material</dt><dd>' + val(p.material) + '</dd></div><div><dt>Lubrificação</dt><dd>' + val(p.lubrication) + '</dd></div><div><dt>Dimensões</dt><dd>' + val(p.dimensions) + '</dd></div><div><dt>Quantidade</dt><dd>' + val(p.quantity) + '</dd></div></dl>' +
        '<div class="note-box"><b>Informações importantes</b><ul><li>Verifique a validade e o estado da embalagem antes de utilizar.</li><li>Uso único: nunca reutilize.</li><li>Conserve em local fresco e seco.</li></ul><p style="margin-top:10px"><button type="button" class="link" data-art="usar">Como usar corretamente</button></p></div>' +
        '<p class="official">Consulte sempre a embalagem do produto para obter as informações oficiais.</p></div>';
      var gImg = $('#gal-img'), gBtn = $('#gal-main');
      function show(i) {
        idx = (i + imgs.length) % imgs.length; var im = imgs[idx];
        gImg.style.opacity = 0;
        setTimeout(function () { gImg.src = im.src; gImg.alt = im.alt; gImg.className = im.fit === 'cover' ? 'cover' : ''; gImg.style.opacity = 1; }, 120);
        $$('#thumbs button').forEach(function (b, n) { b.setAttribute('aria-current', n === idx); });
      }
      gImg.src = imgs[0].src; gImg.alt = imgs[0].alt; gImg.className = imgs[0].fit === 'cover' ? 'cover' : '';
      $$('#thumbs button').forEach(function (b, n) { b.setAttribute('aria-current', n === 0); });
      var th = $('#thumbs'); if (th) th.addEventListener('click', function (e) { var b = e.target.closest('button'); if (b) show(+b.dataset.i); });

      /* Sobre este produto */
      var ab = $('#about-txt'); if (ab) ab.innerHTML = (p.about || []).map(function (t) { return '<p>' + esc(t) + '</p>'; }).join('');

      /* Lightbox com zoom */
      var lb = document.createElement('div');
      lb.className = 'lb'; lb.setAttribute('role', 'dialog'); lb.setAttribute('aria-modal', 'true'); lb.setAttribute('aria-label', 'Imagem ampliada'); lb.setAttribute('aria-hidden', 'true');
      lb.innerHTML = '<div class="lb-stage" id="lb-stage"><img id="lb-img" alt=""></div>' +
        '<button class="ctl x" type="button" aria-label="Fechar"><svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="m2.5 2.5 11 11m0-11-11 11"/></svg></button>' +
        (imgs.length > 1 ? '<button class="ctl pv" type="button" aria-label="Imagem anterior"><svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M10 2 4 8l6 6"/></svg></button><button class="ctl nx" type="button" aria-label="Imagem seguinte"><svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="m6 2 6 6-6 6"/></svg></button>' : '') +
        '<div class="cap" id="lb-cap"></div>';
      document.body.appendChild(lb);
      var stage = $('#lb-stage'), lImg = $('#lb-img'), cap = $('#lb-cap'), lbLast;
      function lbShow(i) {
        idx = (i + imgs.length) % imgs.length; lImg.src = imgs[idx].src; lImg.alt = imgs[idx].alt;
        cap.textContent = imgs[idx].alt + (imgs.length > 1 ? '  ·  ' + (idx + 1) + '/' + imgs.length : '') + '  ·  clique para ampliar';
        stage.classList.remove('zoomed'); lImg.style.transformOrigin = '50% 50%'; show(idx);
      }
      function lbOpen() { lbLast = document.activeElement; lbShow(idx); lb.classList.add('show'); lb.setAttribute('aria-hidden', 'false'); document.body.style.overflow = 'hidden'; $('.x', lb).focus(); }
      function lbClose() { lb.classList.remove('show'); lb.setAttribute('aria-hidden', 'true'); document.body.style.overflow = ''; if (lbLast) lbLast.focus({ preventScroll: true }); }
      gBtn.addEventListener('click', lbOpen);
      stage.addEventListener('click', function (e) {
        var z = stage.classList.toggle('zoomed');
        if (z) { var r = lImg.getBoundingClientRect(); lImg.style.transformOrigin = ((e.clientX - r.left) / r.width * 100) + '% ' + ((e.clientY - r.top) / r.height * 100) + '%'; }
      });
      stage.addEventListener('mousemove', function (e) {
        if (!stage.classList.contains('zoomed')) return;
        var r = stage.getBoundingClientRect(); lImg.style.transformOrigin = ((e.clientX - r.left) / r.width * 100) + '% ' + ((e.clientY - r.top) / r.height * 100) + '%';
      });
      stage.addEventListener('touchmove', function (e) {
        if (!stage.classList.contains('zoomed') || !e.touches[0]) return;
        var r = stage.getBoundingClientRect(), t = e.touches[0]; lImg.style.transformOrigin = ((t.clientX - r.left) / r.width * 100) + '% ' + ((t.clientY - r.top) / r.height * 100) + '%';
      }, { passive: true });
      lb.addEventListener('click', function (e) {
        if (e.target.closest('.x') || e.target === lb) lbClose();
        else if (e.target.closest('.pv')) lbShow(idx - 1);
        else if (e.target.closest('.nx')) lbShow(idx + 1);
      });
      document.addEventListener('keydown', function (e) {
        if (!lb.classList.contains('show')) return;
        if (e.key === 'Escape') lbClose();
        else if (e.key === 'ArrowLeft' && imgs.length > 1) lbShow(idx - 1);
        else if (e.key === 'ArrowRight' && imgs.length > 1) lbShow(idx + 1);
        else if (e.key === 'Tab') trap(e, lb, lb);
      });

      /* Outros produtos */
      var others = D.products.filter(function (x) { return x.id !== p.id; }).slice(0, 3), ob = $('#others');
      if (ob && others.length) {
        ob.hidden = false;
        $('#others-list', ob).innerHTML = others.map(function (o) {
          return '<article class="fcard"><a class="media-link" href="' + detailHref(o) + '" tabindex="-1" aria-label="Ver ' + esc(o.name) + '">' + mediaHTML(o) + '</a><div class="fbody"><h3>' + esc(o.name) + '</h3><a class="link" href="' + detailHref(o) + '">Ver produto</a></div></article>';
        }).join('');
        $('#others-list', ob).setAttribute('data-count', others.length);
      }
    }
  }

  /* ---------- Artigos (lista na página da marca) ---------- */
  /* os botões já estão no HTML com data-art */

  /* ---------- FAQ ---------- */
  var FAQ = [
    ['Para que serve o preservativo?', 'Reduz o risco de gravidez indesejada e de infeções sexualmente transmissíveis, quando usado de forma correta e em todas as relações.'],
    ['Como utilizar corretamente?', 'Verifique a validade, abra a embalagem com cuidado, coloque antes de qualquer contacto íntimo e desenrole até à base. Depois, retire com cuidado e use sempre um novo. O passo a passo está em “Como usar corretamente”, na página A TRYGO.'],
    ['Como deve ser armazenado?', 'Em local fresco e seco, longe do calor e da luz solar direta. Evite carteiras, bolsos e carros por muito tempo.'],
    ['Como verificar a validade?', 'A data vem impressa na embalagem. Não utilize se estiver vencido ou se a embalagem estiver danificada.'],
    ['O que fazer em caso de rompimento?', 'Pare, retire com cuidado e procure aconselhamento num serviço de saúde o mais depressa possível. Alguns cuidados têm prazos.'],
    ['Onde posso obter mais informações?', 'Num serviço de saúde, junto de um profissional de saúde, ou contactando-nos para dúvidas sobre os produtos TRYGO.']
  ];
  var fl = $('#faq-list');
  if (fl) {
    fl.innerHTML = FAQ.map(function (q, i) {
      return '<div class="qa rv" style="--d:' + (i * .04) + 's"><h3><button type="button" aria-expanded="false" aria-controls="a' + i + '" id="q' + i + '"><span>' + q[0] + '</span><span class="pm" aria-hidden="true"></span></button></h3>' +
        '<div class="ans" id="a' + i + '" role="region" aria-labelledby="q' + i + '"><div><p>' + q[1] + '</p></div></div></div>';
    }).join('');
    fl.addEventListener('click', function (e) {
      var b = e.target.closest('button'); if (!b) return;
      var item = b.closest('.qa'), open = !item.classList.contains('open');
      item.classList.toggle('open', open); b.setAttribute('aria-expanded', open);
    });
    observe(fl);
  }

  /* ---------- Formulário ---------- */
  var form = $('#form');
  if (form) {
    var rules = {
      nome: function (v) { return v.trim().length >= 2; },
      email: function (v) { return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()); },
      assunto: function (v) { return v.trim().length >= 3; },
      msg: function (v) { return v.trim().length >= 5; }
    };
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var ok = true, first = null;
      Object.keys(rules).forEach(function (k) {
        var el = form.elements[k], good = rules[k](el.value);
        el.closest('.field').classList.toggle('err', !good);
        if (!good) { ok = false; first = first || el; }
      });
      if (!ok) { first.focus(); return; }
      var btn = $('button[type=submit]', form); btn.disabled = true;
      setTimeout(function () {
        form.classList.add('sent'); btn.disabled = false;
        var h = $('.ok h2', form); h.setAttribute('tabindex', '-1'); h.focus({ preventScroll: true });
      }, 350);
    });
    form.addEventListener('input', function (e) { var f = e.target.closest('.field'); if (f) f.classList.remove('err'); });
    var again = $('#again'); if (again) again.addEventListener('click', function () { form.reset(); form.classList.remove('sent'); form.elements.nome.focus(); });
  }

  /* ---------- Anatomia da embalagem ---------- */
  var anat = $('.anat');
  if (anat) {
    var dots = $$('.hs', anat), items = $$('.anat-list li', anat);
    var act = function (i) {
      dots.forEach(function (d, n) { d.setAttribute('aria-pressed', n === i); });
      items.forEach(function (li, n) { li.classList.toggle('on', n === i); });
    };
    dots.forEach(function (d, n) {
      d.addEventListener('mouseenter', function () { act(n); });
      d.addEventListener('focus', function () { act(n); });
      d.addEventListener('click', function () { act(n); });
    });
    items.forEach(function (li, n) { li.addEventListener('mouseenter', function () { act(n); }); });
    act(0);
  }

  /* ---------- Teclado global ---------- */
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') { if (modal && modal.classList.contains('show')) closeModal(); else closeMenu(); }
    if (e.key === 'Tab' && modal && modal.classList.contains('show')) trap(e, modal, mbox);
  });

  observe(document);
})();
