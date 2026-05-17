/* ==========================================
   COACH HUB — logbook.js
   Persistent training logbook
   ========================================== */

function loadLogs() {
  const logs = DB.get('logbook', []);
  const el = document.getElementById('logList');
  if (!el) return;
  el.innerHTML = '';
  // Seed entry
  const seed = { date: '15. Mai 2026', title: 'Coaching gestartet', note: 'Baseline gesetzt. VO2max 47.3, HRV 110ms, RHR 45bpm. Hauptbaustellen: Kaloriendefizit -565 kcal, Protein 64g (Ziel 113g), Tiefschlaf 0.72h (Ziel 1.5h). Laufmechanik: Bodenkontakt 290ms, Oszillation 10.1cm.', mood: 'great', cat: 'Meilenstein' };
  renderLogEntry(seed, el);
  logs.forEach(l => renderLogEntry(l, el, true));
}

function renderLogEntry(l, container, prepend = false) {
  const el = document.createElement('div');
  el.className = 'log-entry ' + (l.mood || 'ok');
  el.innerHTML = `
    <div class="log-date">${l.date}${l.cat ? ' — ' + l.cat : ''}</div>
    <div class="log-title">${l.title}</div>
    ${l.note ? `<div class="log-body">${l.note}</div>` : ''}
  `;
  if (prepend) container.prepend(el);
  else container.appendChild(el);
}

function addLog() {
  const title = document.getElementById('l_title')?.value.trim();
  if (!title) return;
  const log = {
    date: new Date().toLocaleDateString('de-DE', { day: 'numeric', month: 'long', year: 'numeric' }),
    title,
    note: document.getElementById('l_note')?.value || '',
    mood: document.getElementById('l_mood')?.value || 'ok',
    cat:  document.getElementById('l_cat')?.value || 'Training'
  };
  const logs = DB.get('logbook', []);
  logs.unshift(log);
  DB.set('logbook', logs);
  renderLogEntry(log, document.getElementById('logList'), true);
  document.getElementById('l_title').value = '';
  document.getElementById('l_note').value = '';
}
