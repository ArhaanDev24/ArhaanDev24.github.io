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
window.addEventListener('pointerdown', () => dot.classList.add('down'));
window.addEventListener('pointerup', () => dot.classList.remove('down'));

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

// "open to work" dot pulses forever
animate('.hero-kicker .accent', {
  scale: [1, 1.45],
  opacity: [1, 0.4],
  duration: 900,
  alternate: true,
  loop: true,
  ease: 'inOutSine',
});

/* ---------- hero letters: bounce on hover ---------- */
document.querySelectorAll('.hero-title .char').forEach((c) => {
  c.addEventListener('mouseenter', () => {
    if (c.dataset.busy) return;
    c.dataset.busy = '1';
    animate(c, {
      translateY: [
        { to: -16, duration: 150, ease: 'outQuad' },
        { to: 0, duration: 650, ease: 'outElastic(1, .4)' },
      ],
      onComplete: () => delete c.dataset.busy,
    });
  });
});

/* ---------- hero parallax + scroll progress ---------- */
const heroTitle = document.querySelector('.hero-title');
const progress = document.querySelector('.scroll-progress');
window.addEventListener(
  'scroll',
  () => {
    const y = window.scrollY;
    const max = document.documentElement.scrollHeight - window.innerHeight;
    progress.style.transform = `scaleX(${max > 0 ? y / max : 0})`;
    if (y <= window.innerHeight) {
      heroTitle.style.transform = `translateY(${y * 0.18}px)`;
      heroTitle.style.opacity = Math.max(0, 1 - y / (window.innerHeight * 0.9));
    }
  },
  { passive: true }
);

/* ---------- clockwork timeline: line draws, gear turns, runner rides ---------- */
const cw = document.getElementById('clockwork');
if (cw) {
  const fill = cw.querySelector('.cw-fill');
  const runner = cw.querySelector('.cw-runner');
  const rotor = cw.querySelector('.cw-gear-rotor');
  const TRACK_TOP = 48;
  const updateClockwork = () => {
    const r = cw.getBoundingClientRect();
    const p = Math.min(1, Math.max(0, (window.innerHeight * 0.55 - r.top) / r.height));
    const trackH = r.height - TRACK_TOP;
    fill.style.height = `${p * trackH}px`;
    runner.style.top = `${TRACK_TOP + p * trackH}px`;
    rotor.style.transform = `rotate(${p * 540}deg)`;
  };
  window.addEventListener('scroll', updateClockwork, { passive: true });
  window.addEventListener('resize', updateClockwork, { passive: true });
  updateClockwork();
}

/* ---------- magnetic buttons ---------- */
function magnetize(el, strength = 0.3) {
  el.addEventListener('pointermove', (e) => {
    const r = el.getBoundingClientRect();
    const dx = e.clientX - (r.left + r.width / 2);
    const dy = e.clientY - (r.top + r.height / 2);
    el.style.transform = `translate(${dx * strength}px, ${dy * strength}px)`;
  });
  el.addEventListener('pointerleave', () => {
    animate(el, { translateX: 0, translateY: 0, duration: 550, ease: 'outElastic(1, .5)' });
  });
}
document.querySelectorAll('.btn, .hero-cta, .ext-icon').forEach((el) => magnetize(el));

/* ---------- footer email: letters rise from the center ---------- */
const mail = document.querySelector('.footer-mail');
mail.innerHTML = [...mail.textContent]
  .map((c) => `<span class="char" style="opacity:0">${c}</span>`)
  .join('');
const mailChars = mail.querySelectorAll('.char');
new IntersectionObserver(
  (entries, obs) => {
    if (!entries[0].isIntersecting) return;
    obs.disconnect();
    animate(mailChars, {
      opacity: [0, 1],
      translateY: [30, 0],
      duration: 850,
      ease: 'outExpo',
      delay: stagger(16, { from: 'center' }),
    });
  },
  { threshold: 0.4 }
).observe(mail);

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
        // clear the inline transform so the CSS :hover lift on cards can take over
        onComplete: () => (entry.target.style.transform = ''),
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
