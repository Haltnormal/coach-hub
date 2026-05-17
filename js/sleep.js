/* ==========================================
   COACH HUB — sleep.js
   Sleep checklist + supplement tracker
   ========================================== */

// ---- SLEEP CHECKLIST ----
const CHECK_IDS = ['c0','c1','c2','c3','c4','c5'];

function loadCheckStates() {
  const states = DB.get('sleep_checks_' + DB.today(), {});
  CHECK_IDS.forEach(id => {
    if (states[id]) applyCheck(id, true);
  });
}

function toggleCheck(row, id) {
  const box = document.getElementById(id);
  const label = row.querySelector('.check-label');
  const current = box?.classList.contains('done');
  applyCheck(id, !current);
  const states = DB.get('sleep_checks_' + DB.today(), {});
  states[id] = !current;
  DB.set('sleep_checks_' + DB.today(), states);
}

function applyCheck(id, on) {
  const box = document.getElementById(id);
  const row = document.getElementById('check-' + id);
  const label = row?.querySelector('.check-label');
  if (!box) return;
  box.classList.toggle('done', on);
  if (label) label.classList.toggle('done', on);
}

// ---- SUPPLEMENT TRACKER ----
const SUPP_IDS = ['s0','s1','s2','s3'];

function loadSuppStates() {
  const states = DB.get('supps_' + DB.today(), {});
  SUPP_IDS.forEach(id => {
    if (states[id]) applySupp(id, true);
  });
}

function toggleSupp(row, id) {
  const box = document.getElementById(id);
  const current = box?.classList.contains('done');
  applySupp(id, !current);
  const states = DB.get('supps_' + DB.today(), {});
  states[id] = !current;
  DB.set('supps_' + DB.today(), states);
}

function applySupp(id, on) {
  const box = document.getElementById(id);
  if (!box) return;
  box.classList.toggle('done', on);
}
