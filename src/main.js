import { animate, stagger, createTimeline } from 'animejs';
import { initDemos } from './demos.js';

/* ---------- custom cursor ---------- */
const dot = document.querySelector('.cursor-dot');
const mouse = { x: -100, y: -100 };
const pos = { x: -100, y: -100 };
window.addEventListener('pointermove', (e) => {
  dot.classList.add('on');
  mouse.x = e.clientX;
  mouse.y = e.clientY;
  const hot = e.target.closest('a, button, [data-explain], input');
  dot.classList.toggle('hot', !!hot);
});
(function cursorLoop() {
  pos.x += (mouse.x - pos.x) * 0.22;
  pos.y += (mouse.y - pos.y) * 0.22;
  dot.style.left = `${pos.x}px`;
  dot.style.top = `${pos.y}px`;
  requestAnimationFrame(cursorLoop);
})();

/* ---------- hero: split letters + intro timeline ---------- */
document.querySelectorAll('[data-split]').forEach((el) => {
  el.innerHTML = [...el.textContent]
    .map((c) => `<span class="char">${c}</span>`)
    .join('');
});

const intro = createTimeline({ defaults: { ease: 'outExpo' } });
intro
  .add('.hero-title .char', {
    translateY: ['110%', '0%'],
    duration: 1100,
    delay: stagger(45),
  })
  .add('.reveal-now', {
    opacity: [0, 1],
    translateY: [24, 0],
    duration: 800,
    delay: stagger(120),
  }, '-=700');

// gently bob the CTA arrow forever
animate('.hero-cta .arrow', {
  translateY: [0, 5],
  duration: 700,
  alternate: true,
  loop: true,
  ease: 'inOutQuad',
});

/* ---------- marquee: duplicate content so -50% loops seamlessly ---------- */
const track = document.querySelector('.marquee-track');
track.innerHTML += track.innerHTML;

/* ---------- scroll reveals ---------- */
const io = new IntersectionObserver(
  (entries) => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      io.unobserve(entry.target);
      animate(entry.target, {
        opacity: [0, 1],
        translateY: [36, 0],
        duration: 900,
        ease: 'outExpo',
      });
    }
  },
  { threshold: 0.12 }
);
document.querySelectorAll('.reveal').forEach((el) => io.observe(el));

/* ---------- explain system ----------
   Any element with [data-explain] updates its card's explainer bar
   and fires a little ping where you clicked. */
document.addEventListener('click', (e) => {
  const el = e.target.closest('[data-explain]');
  if (!el) return;

  // ping at click point
  const ping = document.createElement('div');
  ping.className = 'ping';
  ping.style.left = `${e.clientX}px`;
  ping.style.top = `${e.clientY}px`;
  document.body.appendChild(ping);
  animate(ping, {
    scale: [0.4, 3.2],
    opacity: [1, 0],
    duration: 550,
    ease: 'outExpo',
    onComplete: () => ping.remove(),
  });

  // update the card's explain bar
  const card = el.closest('.card');
  const bar = card?.querySelector('.explain-text');
  if (!bar) return;
  bar.textContent = el.dataset.explain;
  animate(bar, {
    opacity: [0, 1],
    translateX: [10, 0],
    duration: 450,
    ease: 'outQuad',
  });
});

/* ---------- interactive project demos ---------- */
initDemos();
