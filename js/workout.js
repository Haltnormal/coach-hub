/* ==========================================
   COACH HUB — workout.js
   Workout generator + Run session planner
   ========================================== */

const WORKOUTS = {
  'Oberkörper': {
    warmup: '5 min Rudern oder Arm Circles',
    exercises: [
      { name: 'Bankdrücken', sets: '4×6–8', desc: 'Exzentrik 3 Sek., Schulterblätter zusammen' },
      { name: 'Latzug vertikal', sets: '3×10–12', desc: 'Volle Streckung, Schulterblatt aktiv einziehen' },
      { name: 'Schrägbank Kurzhanteln', sets: '3×10', desc: '30° Neigung, oberer Pektoralis' },
      { name: 'Seilzug Rudern', sets: '3×12', desc: 'Pause 1 Sek. am Körper, enge Ellbogen' },
      { name: 'OHP stehend', sets: '3×8–10', desc: 'Neutrale Wirbelsäule, Core aktiv' },
      { name: 'Face Pulls', sets: '3×15', desc: 'Externe Rotation, Schultergesundheit' },
    ],
    cooldown: '5 min Brust + Schulter dehnen'
  },
  'Unterkörper': {
    warmup: '5 min Rad + Kniebeugen-Mobilität',
    exercises: [
      { name: 'Kniebeuge', sets: '4×5–6', desc: 'Tief, Knie über Zehen, Spiegelkontrolle' },
      { name: 'Rumänisches Kreuzheben', sets: '3×8', desc: 'Hamstrings, langsam runter (3 Sek.)' },
      { name: 'Beinpresse', sets: '3×12', desc: 'Fußposition variieren Quad vs. Hamstring' },
      { name: 'Ausfallschritte vorwärts', sets: '3×10/Seite', desc: 'Balance + unilateraler Kraftaufbau' },
      { name: 'Wadenheben stehend', sets: '4×15', desc: 'Volle Amplitude, 1 Sek. Pause oben' },
      { name: 'Leg Curl', sets: '3×12', desc: 'Hamstring Isolation, kontrolliert' },
    ],
    cooldown: '8 min Hüfte + Quad + Hamstring dehnen'
  },
  'Ganzkörper': {
    warmup: '5 min Cardio + Gelenkmobilisation',
    exercises: [
      { name: 'Kreuzheben', sets: '3×5', desc: 'Schwer, maximale Aktivierung, Rücken neutral' },
      { name: 'Klimmzüge', sets: '3×max', desc: 'Eigengewicht, volles ROM' },
      { name: 'Kniebeuge', sets: '3×8', desc: 'Moderate Last, saubere Ausführung' },
      { name: 'Bankdrücken', sets: '3×8', desc: 'Oberkörper Kraft, kontrolliert' },
      { name: 'Farmers Walk', sets: '3×30m', desc: 'Griffkraft + Core-Stabilität, metabolisch' },
      { name: 'Plank', sets: '3×45s', desc: 'Neutrale Wirbelsäule, Körper gerade' },
    ],
    cooldown: '5 min Full Body Stretching'
  },
  'Core': {
    warmup: '3 min Aktivierung (Glute Bridges)',
    exercises: [
      { name: 'Plank', sets: '3×45s', desc: 'Neutrale Wirbelsäule, kein Hohlkreuz' },
      { name: 'Dead Bug', sets: '3×10/Seite', desc: 'Langsam + kontrolliert, Rücken am Boden' },
      { name: 'Pallof Press', sets: '3×12/Seite', desc: 'Anti-Rotation, Kabel oder Band' },
      { name: 'Ab Wheel Rollout', sets: '3×8–10', desc: 'Volle Kontrolle beim Zurückrollen' },
      { name: 'Side Plank', sets: '3×30s/Seite', desc: 'Hüfte oben, Körper gerade' },
    ],
    cooldown: '5 min Rücken + Hüfte dehnen'
  },
  'Push': {
    warmup: '5 min Schulter Mobilität + Arm Circles',
    exercises: [
      { name: 'Bankdrücken', sets: '4×6', desc: 'Schwer, Grundlage' },
      { name: 'OHP sitzend KH', sets: '3×10', desc: 'Kontrolliert, neutrale Handgelenke' },
      { name: 'Dips', sets: '3×max', desc: 'Eigengewicht, tief gehen' },
      { name: 'Schrägbank Flyes', sets: '3×12', desc: 'Isolation, langsam und kontrolliert' },
      { name: 'Trizeps Pushdown', sets: '3×15', desc: 'Kabel, Ellbogen fix' },
    ],
    cooldown: '5 min Brust + Trizeps dehnen'
  },
  'Pull': {
    warmup: '5 min Schulter Mobilität',
    exercises: [
      { name: 'Klimmzüge', sets: '4×max', desc: 'Volles ROM, Schulterblatt aktiv' },
      { name: 'Langhantel Rudern', sets: '3×8', desc: 'Rumpf stabil, enge Führung' },
      { name: 'Latzug eng', sets: '3×10', desc: 'Unterer Trapez Fokus' },
      { name: 'Face Pulls', sets: '3×15', desc: 'Außenrotation Schulter, Prävention' },
      { name: 'Bizeps Curl KH', sets: '3×12', desc: 'Supiniert, volles ROM' },
    ],
    cooldown: '5 min Rücken + Lat dehnen'
  }
};

const RUN_SESSIONS = {
  'Grundlauf Z2': [
    { title: 'Aufwärmen', zone: 'z1', desc: '10 min locker — HF unter 101bpm. Nasenatmung möglich.' },
    { title: 'Hauptteil Zone 2', zone: 'z2', desc: 'HF 101–112bpm, Pace 10:54–13:56 min/km. Klingt sehr langsam — ist Absicht. Nasenatmung sollte möglich sein. Das ist die wichtigste Trainingszone für VO2max-Aufbau.' },
    { title: 'Optional: Strides', zone: 'z3', desc: '4×20 Sek. leichte Beschleunigung am Ende. Beine locker machen.' },
    { title: 'Abkühlen', zone: 'z1', desc: '5 min gehen + Waden & Hüftbeuger dehnen.' }
  ],
  'Intervalle Z4/Z5': [
    { title: 'Aufwärmen', zone: 'z1', desc: '12–15 min locker + 3×30 Sek. progressiv steigern.' },
    { title: 'Intervallblock', zone: 'z5', desc: '6–8×3 min bei HF 161–179bpm, Pace 4:25–5:00 min/km. Pause: 90 Sek. traben. Letzter Intervall so schnell wie erster.' },
    { title: 'Pace-Check', zone: 'z4', desc: 'Falls letzte Intervalle deutlich langsamer → Pause auf 2 min erhöhen.' },
    { title: 'Abkühlen', zone: 'z1', desc: '10 min sehr locker, HF unter 110bpm.' }
  ],
  'Tempodauerlauf Z3': [
    { title: 'Aufwärmen', zone: 'z1', desc: '10 min locker + dynamisches Dehnen.' },
    { title: 'Tempoblock', zone: 'z3', desc: '20–30 min gleichmäßig HF 112–136bpm, Pace 7:23–10:54 min/km. Komfortabel unangenehm — noch sprechen aber anstrengend.' },
    { title: 'Abkühlen', zone: 'z1', desc: '5–10 min auslocker laufen + dehnen.' }
  ],
  'Regeneration Z1': [
    { title: 'Komplett in Z1', zone: 'z1', desc: '30–40 min ausschließlich HF unter 101bpm. Pace >13:56. Aktive Erholung, kein Sport. Nasenatmung pflichtgemäß.' }
  ],
  'Fartlek': [
    { title: 'Aufwärmen', zone: 'z1', desc: '10 min locker.' },
    { title: 'Fartlek', zone: 'z3', desc: 'Wechsel: 2 min Z3 (112–136bpm), 1 min locker (Z1). 8–10 Zyklen nach Gefühl. Keine starre Struktur — Fartlek = Spielen.' },
    { title: 'Abkühlen', zone: 'z1', desc: '5 min gehen + dehnen.' }
  ]
};

const ZONE_COLORS = { z1:'var(--teal-text)', z2:'var(--accent)', z3:'var(--success-text)', z4:'var(--warning-text)', z5:'var(--danger-text)' };
const ZONE_LABELS = { z1:'Zone 1', z2:'Zone 2', z3:'Zone 3', z4:'Zone 4', z5:'Zone 5' };

function generateWorkout() {
  const fokus  = document.getElementById('w_fokus').value;
  const ready  = document.getElementById('w_ready').value;
  const plan   = WORKOUTS[fokus] || WORKOUTS['Ganzkörper'];

  const volNote = ready === 'Niedrig' ? '⚠️ Readiness niedrig → Volumen -20%, längere Pausen.'
    : ready === 'Moderat' ? '💡 Readiness moderat → letzte Sätze ggf. kürzen.' : '';

  let html = `<div style="font-size:12px;color:var(--text-secondary);margin-bottom:10px;padding-bottom:8px;border-bottom:0.5px solid var(--border);">
    <strong>Aufwärmen:</strong> ${plan.warmup}
  </div>`;

  if (volNote) {
    html = `<div class="alert-box alert-warning" style="margin-bottom:10px;">${volNote}</div>` + html;
  }

  plan.exercises.forEach((ex, i) => {
    html += `
      <div class="workout-exercise">
        <div class="workout-ex-head">
          <span class="workout-ex-name">${i+1}. ${ex.name}</span>
          <span class="badge badge-amber">${ex.sets}</span>
        </div>
        <div class="workout-ex-desc">${ex.desc}</div>
      </div>`;
  });

  html += `<div style="font-size:12px;color:var(--text-secondary);margin-top:10px;padding-top:8px;border-top:0.5px solid var(--border);">
    <strong>Abkühlen:</strong> ${plan.cooldown}
  </div>`;

  document.getElementById('workoutCard').innerHTML = html;
  document.getElementById('workoutResult').style.display = 'block';
  document.getElementById('workoutResult').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function generateRun() {
  const typ   = document.getElementById('l_typ').value;
  const ready = document.getElementById('l_ready').value;
  const blocks = RUN_SESSIONS[typ] || RUN_SESSIONS['Grundlauf Z2'];

  const note = ready === 'Niedrig' ? 'Readiness niedrig → eine Zone nach unten verschieben.'
    : ready === 'Moderat' ? 'Readiness moderat → Volumen leicht reduzieren, auf Körper hören.' : '';

  const card = document.getElementById('runCard');
  let html = '';

  if (note) html += `<div class="alert-box alert-warning" style="margin-bottom:8px;">${note}</div>`;

  blocks.forEach(b => {
    html += `
      <div class="run-block">
        <div class="run-block-title">
          ${b.title}
          <span style="font-size:11px;font-weight:500;color:${ZONE_COLORS[b.zone]}">${ZONE_LABELS[b.zone]}</span>
        </div>
        <div class="run-block-desc">${b.desc}</div>
      </div>`;
  });

  card.innerHTML = html;
  document.getElementById('runResult').style.display = 'block';
  document.getElementById('runResult').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}
