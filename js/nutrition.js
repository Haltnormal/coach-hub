/* ==========================================
   COACH HUB — nutrition.js
   Food tracking + KI Macro Snapshot
   ========================================== */

let foods = [];

const TARGETS = { kcal: 2400, prot: 113, carb: 250, fat: 80 };

function loadFoods() {
  const stored = DB.get('foods_' + DB.today(), []);
  foods = stored;
  renderFoodList();
  updateNutritionBars();
}

function updateNutritionBars() {
  const totals = foods.reduce((a, f) => ({
    kcal: a.kcal + (f.kcal || 0),
    prot: a.prot + (f.prot || 0),
    carb: a.carb + (f.carb || 0),
    fat:  a.fat  + (f.fat  || 0)
  }), { kcal: 0, prot: 0, carb: 0, fat: 0 });

  const set = (id, val, target) => {
    const el = document.getElementById(id);
    if (el) el.style.width = Math.min((val / target) * 100, 100).toFixed(1) + '%';
  };
  const setVal = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = Math.round(val); };

  set('nbar_kcal', totals.kcal, TARGETS.kcal);
  set('nbar_prot', totals.prot, TARGETS.prot);
  set('nbar_carb', totals.carb, TARGETS.carb);
  setVal('nv_kcal', totals.kcal);
  setVal('nv_prot', totals.prot);
  setVal('nv_carb', totals.carb);
}

function renderFoodList() {
  const el = document.getElementById('foodListCard');
  if (!el) return;
  if (foods.length === 0) {
    el.innerHTML = '<div class="empty-state">Noch keine Mahlzeiten eingetragen.</div>';
    return;
  }
  el.innerHTML = foods.map((f, i) => `
    <div class="food-list-item">
      <div>
        <div class="food-name">${f.name}</div>
        <div class="food-macros">${Math.round(f.kcal || 0)} kcal · ${Math.round(f.prot || 0)}g P · ${Math.round(f.carb || 0)}g KH</div>
      </div>
      <button class="food-del" onclick="delFood(${i})" aria-label="Entfernen"><i class="ti ti-x"></i></button>
    </div>
  `).join('');
}

function addFood() {
  const name = document.getElementById('f_name')?.value.trim();
  if (!name) return;
  const food = {
    name,
    kcal: parseFloat(document.getElementById('f_kcal')?.value) || 0,
    prot: parseFloat(document.getElementById('f_prot')?.value) || 0,
    carb: parseFloat(document.getElementById('f_carb')?.value) || 0,
    fat:  parseFloat(document.getElementById('f_fat')?.value)  || 0,
  };
  foods.push(food);
  DB.set('foods_' + DB.today(), foods);
  renderFoodList();
  updateNutritionBars();
  ['f_name','f_kcal','f_prot','f_carb','f_fat'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.value = '';
  });
}

function delFood(i) {
  foods.splice(i, 1);
  DB.set('foods_' + DB.today(), foods);
  renderFoodList();
  updateNutritionBars();
}

// ---- KI SNAPSHOT ----
async function analyzeSnap() {
  const text = document.getElementById('snap_text')?.value.trim();
  if (!text) return;

  const trainDay = document.getElementById('snap_train')?.value;
  const goal = document.getElementById('snap_goal')?.value;
  const kTarget = trainDay === 'yes' ? 2600 : 2200;

  const loading = document.getElementById('snapLoading');
  const out = document.getElementById('snapOut');
  if (loading) loading.style.display = 'block';
  if (out) out.style.display = 'none';

  const apiKey = DB.get('api_key', '');
  if (!apiKey) {
    if (loading) loading.style.display = 'none';
    alert('API Key in den Einstellungen eintragen (⚙️ oben rechts).');
    return;
  }

  const prompt = `Analysiere diese Mahlzeiten eines 22-jährigen Athleten (63kg, 178.8cm, Ziel: Muskelaufbau + Ausdauer, Protein-Tagesziel 113g, Kalorien-Tagesziel ${kTarget} kcal).

Mahlzeiten: "${text}"
Trainingstag: ${trainDay === 'yes' ? 'Ja' : 'Nein'}
Ziel: ${goal}

Antworte NUR mit diesem JSON (keine Backticks, kein Text davor/danach):
{
  "kcal": 2100,
  "protein": 85,
  "carbs": 230,
  "fat": 70,
  "assessment": "kurze 2-Satz Bewertung",
  "missing": "was konkret fehlt",
  "tip": "ein konkreter umsetzbarer Tipp für heute noch"
}`;

  try {
    const resp = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 400,
        messages: [{ role: 'user', content: prompt }]
      })
    });
    const data = await resp.json();
    const raw = data.content?.filter(b => b.type === 'text').map(b => b.text).join('') || '{}';
    const d = JSON.parse(raw.replace(/```json|```/g, '').trim());

    // Update bars
    const setBar = (id, val, target) => {
      const el = document.getElementById(id);
      if (el) el.style.width = Math.min((val / target) * 100, 100).toFixed(1) + '%';
    };
    const setVal = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = Math.round(val); };

    setBar('sbar_kcal', d.kcal || 0, kTarget);
    setBar('sbar_prot', d.protein || 0, 113);
    setBar('sbar_carb', d.carbs || 0, 250);
    setBar('sbar_fat',  d.fat || 0, 80);
    setVal('sv_kcal', d.kcal || 0);
    setVal('sv_prot', d.protein || 0);
    setVal('sv_carb', d.carbs || 0);
    setVal('sv_fat',  d.fat || 0);

    const protGap = 113 - (d.protein || 0);
    const kcalGap = kTarget - (d.kcal || 0);
    const fb = document.getElementById('snapFeedback');
    if (fb) {
      let html = `<div style="margin-bottom:8px;">${d.assessment || ''}</div>`;
      if (d.missing) html += `<div style="color:var(--warning-text);margin-bottom:5px;">⚠️ ${d.missing}</div>`;
      if (protGap > 15) html += `<div style="color:var(--danger-text);margin-bottom:5px;">❌ Protein-Lücke: noch <strong>${Math.round(protGap)}g</strong> fehlen heute</div>`;
      if (kcalGap > 200) html += `<div style="color:var(--text-secondary);margin-bottom:5px;">ℹ️ Noch <strong>${Math.round(kcalGap)} kcal</strong> zum Tagesziel</div>`;
      if (d.tip) html += `<div style="color:var(--success-text);margin-top:8px;">💡 ${d.tip}</div>`;
      fb.innerHTML = html;
    }

    if (out) out.style.display = 'block';
  } catch (e) {
    const fb = document.getElementById('snapFeedback');
    if (fb) fb.innerHTML = `<div class="alert-box alert-danger">Fehler: ${e.message}</div>`;
    if (out) out.style.display = 'block';
  }

  if (loading) loading.style.display = 'none';
}
