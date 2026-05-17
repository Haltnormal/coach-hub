/* ==========================================
   COACH HUB — app.js
   Core: Navigation, Storage, Settings, Utils
   ========================================== */

// ---- PROFILE (edit these) ----
const PROFILE = {
  age: 22, weight: 63, height: 178.8,
  vo2max: 47.3, hrv_baseline: 78, rhr: 45,
  // Spiro zones (Nov 2025)
  zones: {
    z1: { hr: [65,101], pace: [null, '13:56'] },
    z2: { hr: [101,112], pace: ['10:54','13:56'] },
    z3: { hr: [112,136], pace: ['7:23','10:54'] },
    z4: { hr: [136,172], pace: ['4:58','7:23'] },
    z5: { hr: [172,186], pace: ['4:24','4:58'] },
  },
  vt1_hr: 161, vt2_hr: 179, fatmax_hr: 106,
  protein_goal: 113, kcal_goal: 2400,
  sleep_goal: 8, deep_sleep_goal: 1.5
};

// ---- STORAGE ----
const DB = {
  get(key, fallback = null) {
    try { const v = localStorage.getItem(key); return v !== null ? JSON.parse(v) : fallback; }
    catch { return fallback; }
  },
  set(key, value) {
    try { localStorage.setItem(key, JSON.stringify(value)); showSaved(); }
    catch(e) { console.warn('Storage error', e); }
  },
  today() { return new Date().toISOString().split('T')[0]; }
};

// ---- NAVIGATION ----
function showTab(id, btn) {
  document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('.nav-item').forEach(b => b.classList.remove('active'));
  const tab = document.getElementById('tab-' + id);
  if (tab) tab.classList.add('active');
  if (btn) btn.classList.add('active');
  // scroll to top
  document.querySelector('.main-content').scrollTop = 0;
}

// ---- UTILS ----
function updSlider(sid, oid, fmt) {
  const v = document.getElementById(sid)?.value;
  const out = document.getElementById(oid);
  if (v && out) out.textContent = fmt(v);
}

function toggleTag(el) { el.classList.toggle('on'); }

function showSaved() {
  const el = document.getElementById('savedInd');
  if (!el) return;
  el.style.display = 'inline';
  clearTimeout(el._timer);
  el._timer = setTimeout(() => el.style.display = 'none', 1500);
}

function autoSave() {
  const data = {
    sleep: document.getElementById('s_sleep')?.value,
    sq: document.getElementById('s_sq')?.value,
    hrv: document.getElementById('s_hrv')?.value,
    hr: document.getElementById('s_hr')?.value,
    en: document.getElementById('s_en')?.value,
    sore: document.getElementById('s_sore')?.value,
    str: document.getElementById('s_str')?.value,
    dur: document.getElementById('s_dur')?.value,
    rpe: document.getElementById('s_rpe')?.value,
    kcal: document.getElementById('s_kcal')?.value,
    prot: document.getElementById('s_prot')?.value,
    note: document.getElementById('s_note')?.value,
    sports: [...document.querySelectorAll('#sportTags .tag.on')].map(e => e.textContent),
    date: DB.today()
  };
  DB.set('checkin_today', data);
}

function loadCheckin() {
  const d = DB.get('checkin_today');
  if (!d || d.date !== DB.today()) return;
  const fields = ['sleep','sq','hrv','hr','en','sore','str'];
  const suffixes = ['h','/10','ms','bpm','/10','/10','/10'];
  fields.forEach((f, i) => {
    const el = document.getElementById('s_'+f);
    const out = document.getElementById('sv_'+f);
    if (el && d[f]) {
      el.value = d[f];
      if (out) out.textContent = f === 'sleep' ? parseFloat(d[f]).toFixed(1) + suffixes[i] : d[f] + suffixes[i];
    }
  });
  if (d.dur) document.getElementById('s_dur').value = d.dur;
  if (d.rpe) document.getElementById('s_rpe').value = d.rpe;
  if (d.kcal) document.getElementById('s_kcal').value = d.kcal;
  if (d.prot) document.getElementById('s_prot').value = d.prot;
  if (d.note) document.getElementById('s_note').value = d.note;
  if (d.sports) d.sports.forEach(s => {
    document.querySelectorAll('#sportTags .tag').forEach(t => {
      if (t.textContent === s) t.classList.add('on');
    });
  });
  calcReady();
}

// ---- SETTINGS ----
function showSettings() {
  const modal = document.getElementById('settingsModal');
  if (!modal) return;
  modal.style.display = 'flex';
  const key = DB.get('api_key', '');
  const w = DB.get('user_weight', PROFILE.weight);
  const hb = DB.get('hrv_base', PROFILE.hrv_baseline);
  document.getElementById('apiKeyInput').value = key;
  document.getElementById('weightInput').value = w;
  document.getElementById('hrvBaseInput').value = hb;
}

function hideSettings() {
  document.getElementById('settingsModal').style.display = 'none';
}

function saveSettings() {
  const key = document.getElementById('apiKeyInput').value.trim();
  const w = document.getElementById('weightInput').value;
  const hb = document.getElementById('hrvBaseInput').value;
  if (key) DB.set('api_key', key);
  if (w) { DB.set('user_weight', parseFloat(w)); PROFILE.weight = parseFloat(w); }
  if (hb) { DB.set('hrv_base', parseFloat(hb)); PROFILE.hrv_baseline = parseFloat(hb); }
  hideSettings();
  showSaved();
}

// ---- DATE ----
function initDate() {
  const el = document.getElementById('topbarDate');
  if (el) el.textContent = new Date().toLocaleDateString('de-DE', { weekday:'long', day:'numeric', month:'long' });
}

// ---- INIT ----
document.addEventListener('DOMContentLoaded', () => {
  initDate();
  loadCheckin();
  loadLogs();
  loadFoods();
  loadCheckStates();
  loadSuppStates();
  calcReady();
  // Load persisted settings
  const w = DB.get('user_weight'); if (w) PROFILE.weight = w;
  const hb = DB.get('hrv_base'); if (hb) PROFILE.hrv_baseline = hb;
});

// ---- SEND TO COACH ----
function sendToCoach(msg) {
  showTab('coach', document.querySelector('.nav-item:nth-child(2)'));
  setTimeout(() => {
    document.getElementById('chatInput').value = msg;
    sendChat();
  }, 100);
}
