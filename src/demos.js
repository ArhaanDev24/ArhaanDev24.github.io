import { animate, stagger, createTimeline } from 'animejs';

/* helper: type text into an element via an animated progress object */
function typeInto(el, html, duration = 1200) {
  const plain = html.replace(/<[^>]*>/g, '');
  const obj = { p: 0 };
  animate(obj, {
    p: 1,
    duration,
    ease: 'linear',
    onUpdate: () => {
      const n = Math.round(obj.p * plain.length);
      // typing on plain text, swap to rich html at the end
      el.textContent = plain.slice(0, n);
      if (n >= plain.length) el.innerHTML = html;
    },
  });
}

/* helper: append a log line and fade it in; returns the element */
function logLine(container, html, cls = '') {
  const div = document.createElement('div');
  if (cls) div.className = cls;
  div.innerHTML = html;
  container.appendChild(div);
  animate(div, { opacity: [0, 1], translateX: [-8, 0], duration: 350, ease: 'outQuad' });
  return div;
}

/* ============ PROMPY ============ */
function prompy() {
  const btn = document.getElementById('prompy-run');
  const out = document.getElementById('prompy-output');
  let busy = false;
  btn.addEventListener('click', () => {
    if (busy) return;
    busy = true;
    out.innerHTML = '<span class="muted">optimizing…</span>';
    animate(btn, { scale: [1, 0.94, 1], duration: 300, ease: 'outQuad' });
    setTimeout(() => {
      typeInto(
        out,
        '<span class="k">ROLE:</span> senior product designer\n' +
          '<span class="k">TASK:</span> design a modern landing page for a fitness app\n' +
          '<span class="k">CONTEXT:</span> mobile-first audience, energetic brand\n' +
          '<span class="k">FORMAT:</span> hero → social proof → features → CTA\n' +
          '<span class="k">TONE:</span> bold, minimal, no clichés',
        1600
      );
      setTimeout(() => (busy = false), 1700);
    }, 450);
  });
}

/* ============ FILE ANALYZER MCP ============ */
function mcp() {
  const log = document.getElementById('mcp-log');
  const results = {
    'invoice.pdf': '{ "vendor": "Acme", "total": "$1,240.00", "due": "2026-08-02" }',
    'dataset.csv': '{ "rows": 5000, "cols": 12, "nulls": 43, "schema": "inferred" }',
    'notes.md': '{ "headings": 6, "todos": 3, "words": 842 }',
  };
  document.querySelectorAll('#demo-mcp .file').forEach((f) => {
    f.addEventListener('click', () => {
      document.querySelectorAll('#demo-mcp .file').forEach((x) => x.classList.remove('active'));
      f.classList.add('active');
      const name = f.dataset.file;
      log.innerHTML = '';
      const tl = createTimeline();
      tl.call(() => logLine(log, `&gt; tool_call: <span class="ok">read_file</span>("${name}")`), 0)
        .call(() => logLine(log, '&gt; parsing structure…'), 500)
        .call(() => logLine(log, '&gt; extraction <span class="ok">complete</span>'), 1000)
        .call(() => logLine(log, results[name], 'ok'), 1400)
        .call(() => logLine(log, '&gt; returned to LLM client ✓', 'muted'), 1900);
    });
  });
}

/* ============ PCB ION ============ */
function pcb() {
  const run = document.getElementById('pcb-run');
  const sim = document.getElementById('pcb-sim');
  const board = document.getElementById('pcb-board');
  const svg = document.getElementById('pcb-traces');
  const mcu = document.getElementById('chip-mcu');
  const sns = document.getElementById('chip-sns');
  let generated = false;

  run.addEventListener('click', () => {
    svg.innerHTML = '';
    generated = true;
    const tl = createTimeline({ defaults: { ease: 'outExpo' } });
    tl.add(mcu, { opacity: [0, 1], scale: [0.5, 1], duration: 500 })
      .add(sns, { opacity: [0, 1], scale: [0.5, 1], duration: 500 }, '-=250')
      .call(() => {
        // draw two I2C traces (SDA/SCL) as right-angled paths
        const paths = [
          'M 66 58 L 150 58 L 150 95 L 208 95',
          'M 66 66 L 142 66 L 142 103 L 208 103',
        ];
        paths.forEach((d, i) => {
          const p = document.createElementNS('http://www.w3.org/2000/svg', 'path');
          p.setAttribute('d', d);
          svg.appendChild(p);
          const len = p.getTotalLength();
          p.style.strokeDasharray = len;
          p.style.strokeDashoffset = len;
          animate(p, {
            strokeDashoffset: [len, 0],
            duration: 900,
            delay: i * 180,
            ease: 'inOutQuad',
          });
        });
      }, '+=100');
  });

  sim.addEventListener('click', () => {
    if (!generated) {
      animate(sim, { translateX: [0, -5, 5, -3, 0], duration: 350, ease: 'outQuad' });
      return;
    }
    board.classList.add('sim-ok');
    [mcu, sns].forEach((c) => c.classList.add('glow'));
    setTimeout(() => {
      board.classList.remove('sim-ok');
      [mcu, sns].forEach((c) => c.classList.remove('glow'));
    }, 1300);
  });
}

/* ============ NEUROOPS ============ */
function neuro() {
  const lanes = [...document.querySelectorAll('#demo-neuro .lane')];
  const latencyEl = document.querySelector('#neuro-latency b');
  const dispatch = document.getElementById('neuro-dispatch');
  const spike = document.getElementById('neuro-spike');
  let n = 0;

  const setLatency = (target) => {
    const obj = { v: parseInt(latencyEl.textContent, 10) || 12 };
    animate(obj, {
      v: target,
      duration: 900,
      ease: 'outExpo',
      onUpdate: () => (latencyEl.textContent = Math.round(obj.v)),
    });
  };

  const addTask = (lane) => {
    const chip = document.createElement('span');
    chip.className = 'task-chip';
    chip.textContent = `t${n++}`;
    lane.appendChild(chip);
    animate(chip, { opacity: [0, 1], translateY: [-16, 0], scale: [0.6, 1], duration: 500, ease: 'outBack' });
    // tasks complete and leave after a while
    setTimeout(() => {
      animate(chip, {
        opacity: [1, 0],
        translateY: [0, 10],
        duration: 400,
        ease: 'inQuad',
        onComplete: () => chip.remove(),
      });
    }, 3500 + Math.random() * 2000);
  };

  dispatch.addEventListener('click', () => {
    // scheduler: pick least-loaded lane
    const lane = lanes.reduce((a, b) =>
      a.querySelectorAll('.task-chip').length <= b.querySelectorAll('.task-chip').length ? a : b
    );
    addTask(lane);
  });

  spike.addEventListener('click', () => {
    lanes.forEach((l) => l.classList.add('hot'));
    setLatency(46);
    let i = 0;
    const burst = setInterval(() => {
      addTask(lanes[i % 3]);
      if (++i >= 9) {
        clearInterval(burst);
        // rebalanced: latency recovers fast
        setTimeout(() => {
          lanes.forEach((l) => l.classList.remove('hot'));
          setLatency(12);
        }, 900);
      }
    }, 130);
  });
}

/* ============ SPACECRAFT HIL ============ */
function hil() {
  const fills = ['g1', 'g2', 'g3'].map((id) => document.getElementById(id));
  const log = document.getElementById('hil-log');
  const btn = document.getElementById('hil-fault');
  let faulting = false;

  // idle telemetry: gauges breathe forever
  const idle = fills.map((f, i) =>
    animate(f, {
      height: ['34%', '62%'],
      duration: 1400 + i * 380,
      alternate: true,
      loop: true,
      ease: 'inOutSine',
    })
  );

  btn.addEventListener('click', () => {
    if (faulting) return;
    faulting = true;
    const vi = Math.floor(Math.random() * 3);
    const victim = fills[vi];
    idle[vi].pause();
    victim.classList.add('fault');
    log.innerHTML = '';
    animate(victim, { height: '96%', duration: 260, ease: 'outQuad' });

    const tl = createTimeline();
    tl.call(() => logLine(log, '&gt; fault injected on bus', 'warn'), 0)
      .call(() => logLine(log, '&gt; watchdog: anomaly in firmware loop', 'warn'), 500)
      .call(() => logLine(log, '&gt; detected + flagged in <span class="ok">0.4s</span>'), 1100)
      .call(() => logLine(log, '&gt; system recovered ✓', 'ok'), 1800)
      .call(() => {
        victim.classList.remove('fault');
        animate(victim, {
          height: '48%',
          duration: 500,
          ease: 'outQuad',
          onComplete: () => idle[vi].play(),
        });
        faulting = false;
      }, 2200);
  });
}

/* ============ ECOLENS ============ */
function eco() {
  const items = [
    { icon: '🧴', label: 'PET plastic — recyclable ♻', conf: '96%' },
    { icon: '🔋', label: 'battery — hazardous ⚠ drop-off only', conf: '93%' },
    { icon: '🫙', label: 'glass jar — recyclable ♻ rinse first', conf: '98%' },
    { icon: '🍕', label: 'soiled cardboard — compost, not recycling', conf: '91%' },
  ];
  let idx = 0;
  const itemEl = document.getElementById('eco-item');
  const scan = document.getElementById('eco-scan');
  const result = document.getElementById('eco-result');
  const scanBtn = document.getElementById('eco-scan-btn');
  const nextBtn = document.getElementById('eco-next');

  scanBtn.addEventListener('click', () => {
    result.innerHTML = '&nbsp;';
    animate(scan, {
      opacity: [0, 1, 1, 0],
      top: ['0%', '96%'],
      duration: 800,
      ease: 'inOutQuad',
      onComplete: () => {
        const it = items[idx];
        result.innerHTML = `${it.label}<br><span class="muted">on-device · ${it.conf} confidence</span>`;
        animate(result, { opacity: [0, 1], translateY: [6, 0], duration: 400, ease: 'outQuad' });
      },
    });
  });

  nextBtn.addEventListener('click', () => {
    idx = (idx + 1) % items.length;
    result.innerHTML = '&nbsp;';
    animate(itemEl, {
      opacity: [1, 0],
      scale: [1, 0.6],
      duration: 200,
      ease: 'inQuad',
      onComplete: () => {
        itemEl.textContent = items[idx].icon;
        animate(itemEl, { opacity: [0, 1], scale: [0.6, 1], duration: 350, ease: 'outBack' });
      },
    });
  });
}

/* ============ JIRA FORGE PANEL ============ */
function jira() {
  const input = document.getElementById('jira-input');
  const save = document.getElementById('jira-save');
  const tbody = document.querySelector('#jira-table tbody');
  const saved = document.getElementById('jira-saved');

  const persist = () => {
    const text = input.value.trim();
    if (!text) {
      animate(input, { translateX: [0, -5, 5, -3, 0], duration: 350, ease: 'outQuad' });
      return;
    }
    const tr = document.createElement('tr');
    tr.innerHTML = `<td>${text.replace(/</g, '&lt;')}</td><td><span class="pill">open</span></td>`;
    tbody.appendChild(tr);
    input.value = '';
    animate(tr, { opacity: [0, 1], translateY: [-10, 0], duration: 450, ease: 'outQuad' });
    animate(saved, { opacity: [0, 1, 1, 0], duration: 2200, ease: 'inOutQuad' });
  };

  save.addEventListener('click', persist);
  input.addEventListener('keydown', (e) => e.key === 'Enter' && persist());
}

export function initDemos() {
  prompy();
  mcp();
  pcb();
  neuro();
  hil();
  eco();
  jira();
}
