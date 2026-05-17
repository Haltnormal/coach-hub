/* ==========================================
   COACH HUB — checkin.js
   Readiness score + send check-in to coach
   ========================================== */

function calcReady() {
  const sleep = parseFloat(document.getElementById('s_sleep')?.value || 7);
  const sq    = parseFloat(document.getElementById('s_sq')?.value || 7);
  const hrv   = parseFloat(document.getElementById('s_hrv')?.value || 78);
  const hr    = parseFloat(document.getElementById('s_hr')?.value || 50);
  const en    = parseFloat(document.getElementById('s_en')?.value || 7);
  const sore  = parseFloat(document.getElementById('s_sore')?.value || 3);
  const str   = parseFloat(document.getElementById('s_str')?.value || 3);

  const hrvBase = PROFILE.hrv_baseline || 78;

  const sleepScore = Math.min((sleep / 8.5) * 10, 10);
  const hrvScore   = Math.min((hrv / (hrvBase * 1.2)) * 10, 10);
  const hrScore    = Math.max(10 - ((hr - 35) / 35) * 10, 0);
  const score = (
    sleepScore * 0.20 +
    sq         * 0.12 +
    hrvScore   * 0.28 +
    hrScore    * 0.10 +
    en         * 0.15 +
    (10 - sore)* 0.10 +
    (10 - str) * 0.05
  );
  const pct = Math.round(score * 10);

  const box   = document.getElementById('readBox');
  const icon  = document.getElementById('readIcon');
  const title = document.getElementById('readTitle');
  const sub   = document.getElementById('readSub');
  const scEl  = document.getElementById('readScore');

  if (!box) return;
  if (scEl) scEl.textContent = pct;

  if (pct >= 85) {
    box.style.background = 'var(--success-light)';
    icon.textContent = '⚡';
    title.textContent = 'Top Readiness — Vollgas heute';
    sub.textContent = 'HRV stark, Schlaf gut. Ideal für Z4-Intervalle oder schwere Sätze.';
  } else if (pct >= 70) {
    box.style.background = 'var(--success-light)';
    icon.textContent = '✅';
    title.textContent = 'Gute Readiness — Training wie geplant';
    sub.textContent = 'Körper erholt. Normales Training im geplanten Bereich.';
  } else if (pct >= 55) {
    box.style.background = 'var(--warning-light)';
    icon.textContent = '🟡';
    title.textContent = 'Moderat — Intensität anpassen';
    sub.textContent = 'Eine Zone runter, Volumen -20%. Technik statt maximaler Last.';
  } else if (pct >= 40) {
    box.style.background = 'var(--warning-light)';
    icon.textContent = '⚠️';
    title.textContent = 'Niedrig — nur leichte Aktivität';
    sub.textContent = 'Mobility, Spazieren, Dehnen. Kein hartes Training heute.';
  } else {
    box.style.background = 'var(--danger-light)';
    icon.textContent = '🔴';
    title.textContent = 'Rest Day — Körper braucht Ruhe';
    sub.textContent = 'Schlafen, trinken, erholen. Training jetzt wäre kontraproduktiv.';
  }
}

function sendCheckin() {
  const sleep = document.getElementById('s_sleep')?.value || '?';
  const sq    = document.getElementById('s_sq')?.value || '?';
  const hrv   = document.getElementById('s_hrv')?.value || '?';
  const hr    = document.getElementById('s_hr')?.value || '?';
  const en    = document.getElementById('s_en')?.value || '?';
  const sore  = document.getElementById('s_sore')?.value || '?';
  const str   = document.getElementById('s_str')?.value || '?';
  const dur   = document.getElementById('s_dur')?.value || '';
  const rpe   = document.getElementById('s_rpe')?.value || '';
  const kcal  = document.getElementById('s_kcal')?.value || '';
  const prot  = document.getElementById('s_prot')?.value || '';
  const note  = document.getElementById('s_note')?.value || '';
  const score = document.getElementById('readScore')?.textContent || '?';
  const sports = [...document.querySelectorAll('#sportTags .tag.on')].map(e => e.textContent).join(', ') || '—';
  const d = new Date().toLocaleDateString('de-DE', { weekday:'long', day:'numeric', month:'long' });

  let msg = `Check-in ${d}\n`;
  msg += `\nReadiness Score: ${score}/100`;
  msg += `\nSchlaf: ${parseFloat(sleep).toFixed(1)}h (Qualität ${sq}/10)`;
  msg += `\nHRV: ${hrv}ms | Ruhepuls: ${hr}bpm`;
  msg += `\nEnergie: ${en}/10 | Kater: ${sore}/10 | Stress: ${str}/10`;
  msg += `\nSport heute: ${sports}`;
  if (dur) msg += `\nDauer: ${dur}min | RPE: ${rpe || '—'}`;
  if (kcal) msg += `\nKcal: ${kcal} | Protein: ${prot || '—'}g`;
  if (note) msg += `\nNotizen: ${note}`;
  msg += `\n\nGib mir meine konkrete Tagesempfehlung für Training und Ernährung.`;

  sendToCoach(msg);
}
