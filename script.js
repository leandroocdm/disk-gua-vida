'use strict';

/* ===== CONFIGURAÇÃO — ajuste aqui ===== */
const CONFIG = {
  whatsapp: '5519995956039',
  instagram: 'https://www.instagram.com/diskaguaevida2026/',
  // Cole aqui o link de avaliação do Google (Perfil da Empresa > "Pedir avaliações")
  reviewUrl: 'https://g.page/r/COLE-SEU-LINK/review',
  endereco: 'Rua Coronel Manoel Leme, 1104, Jardim Belém, Descalvado, SP'
};

function setupLinks() {
  document.querySelectorAll('.wa-link').forEach(function (a) {
    const msg = a.dataset.msg || 'Olá!';
    a.href = 'https://wa.me/' + CONFIG.whatsapp + '?text=' + encodeURIComponent(msg);
    a.target = '_blank';
    a.rel = 'noopener';
  });
  ['igLink', 'igLink2'].forEach(function (id) { document.getElementById(id).href = CONFIG.instagram; });
  document.getElementById('reviewLink').href = CONFIG.reviewUrl;
  document.getElementById('mapLink').href = 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(CONFIG.endereco);
  document.getElementById('year').textContent = new Date().getFullYear();
}

/* aberto/fechado em horário de Brasília */
function setupOpenStatus() {
  const el = document.getElementById('openStatus');
  const parts = new Intl.DateTimeFormat('pt-BR', { timeZone: 'America/Sao_Paulo', weekday: 'short', hour: 'numeric', hour12: false })
    .formatToParts(new Date());
  const wd = parts.find(function (p) { return p.type === 'weekday'; }).value.toLowerCase();
  const h = parseInt(parts.find(function (p) { return p.type === 'hour'; }).value, 10) % 24;
  const close = wd.indexOf('dom') === 0 ? 0 : (wd.indexOf('sáb') === 0 || wd.indexOf('sab') === 0 ? 17 : 18);
  const open = h >= 8 && h < close;
  el.innerHTML = open
    ? '<b>Estamos atendendo agora</b> até às ' + close + 'h.'
    : 'No momento fechado. Atendemos seg–sex 8h–18h e sáb 8h–17h.';
}

function setupWater() {
  const water = document.getElementById('water');
  function update() {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const p = max > 0 ? window.scrollY / max : 0;
    water.style.setProperty('--lvl', (6 + p * 94) + '%');
  }
  window.addEventListener('scroll', update, { passive: true });
  window.addEventListener('resize', update);
  update();
}

function setupReveal() {
  const items = document.querySelectorAll('.reveal');
  if (!('IntersectionObserver' in window)) { items.forEach(function (i) { i.classList.add('in'); }); return; }
  const io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
  }, { threshold: 0.15 });
  items.forEach(function (i, idx) { i.style.transitionDelay = (idx % 3) * 90 + 'ms'; io.observe(i); });
}

function setupSmoothScroll() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || typeof Lenis === 'undefined') return;
  const lenis = new Lenis({ duration: 1.2, easing: function (t) { return Math.min(1, 1.001 - Math.pow(2, -10 * t)); } });
  function raf(time) { lenis.raf(time); requestAnimationFrame(raf); }
  requestAnimationFrame(raf);
  document.querySelectorAll('a[href^="#"]').forEach(function (a) {
    a.addEventListener('click', function (e) {
      const id = a.getAttribute('href');
      if (id.length > 1 && document.querySelector(id)) { e.preventDefault(); lenis.scrollTo(id, { offset: -70 }); }
    });
  });
  const par = document.querySelector('[data-parallax]');
  lenis.on('scroll', function (e) { if (par) par.style.transform = 'translateY(' + (e.scroll * -parseFloat(par.dataset.parallax)) + 'px)'; });
}

document.addEventListener('DOMContentLoaded', function () {
  setupLinks();
  setupOpenStatus();
  setupWater();
  setupReveal();
  setupSmoothScroll();
});
