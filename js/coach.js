/* ==========================================
   COACH HUB — coach.js
   AI Coach Chat — Anthropic API
   ========================================== */

const COACH_SYSTEM = `Du bist ein direkter, präziser persönlicher Sportcoach. Antworte immer auf Deutsch. Sei konkret, kurz und datenbasiert. Kein Fluff. Nutze die Profildaten aktiv. Bei Trainingsfragen: immer konkrete Herzfrequenzzonen und Paces angeben. Bei Ernährung: konkrete Mengen und Lebensmittel. Max 200 Wörter außer bei expliziten Plan-Anfragen.

ATHLETEN-PROFIL:
- 22 Jahre, männlich, 178.8cm, 63kg, Münster DE
- Spiroergometrie (Nov 2025, Uni Münster): VO2max 48.7, VT1=161bpm, VT2=179bpm, HFmax=179bpm, Fettmax=106bpm
- Trainingszonen: Z1 65-101bpm (>13:56/km), Z2 101-112bpm (10:54-13:56), Z3 112-136bpm (7:23-10:54), Z4 136-172bpm (4:58-7:23), Z5 172-186bpm (4:24-4:58)
- Aktuelle Werte (Mai 2026): VO2max Watch 47.3, HRV heute 110ms (Basis 78ms), Ruhepuls 45bpm
- Schlaf: Ø6.8h, Tiefschlaf nur 0.72h/Nacht (Hauptbaustelle — Ziel 1.5h)
- Ernährung: Ø1659kcal bei Verbrauch 2224kcal (Defizit!), Protein nur 64g (Ziel: 113g)
- Laufmechanik: Bodenkontaktzeit 290ms (Ziel <260ms), vertikale Oszillation 10.1cm (Ziel <9cm)
- Sport: Laufen, Gym, Heimtraining, Fußball, Leichtathletik, gelegentlich Schwimmen
- Tracking: Apple Watch + Bevel App
- Ziele: Ausdauer + Kraft + Mobility + Gesundheit + Longevity, kein Wettkampf geplant
- Stärken: HRV exzellent, Athleten-Ruhepuls, VO2max-Trend +12% in 7 Monaten
- Periodisierung: 3 Wochen Aufbau, 1 Woche Deload. Aktuell: Aufbauwoche 1`;

let chatHistory = [];

function quickAsk(text) {
  document.getElementById('chatInput').value = text;
  sendChat();
}

async function sendChat() {
  const input = document.getElementById('chatInput');
  const text = input.value.trim();
  if (!text) return;

  input.value = '';
  input.style.height = 'auto';

  appendChatMsg(text, 'user');
  chatHistory.push({ role: 'user', content: text });

  const loadDiv = appendChatMsg('', 'loading');
  loadDiv.querySelector('.chat-bubble').innerHTML = '<i class="ti ti-refresh spin"></i> Coach antwortet...';

  const apiKey = DB.get('api_key', '');
  if (!apiKey) {
    loadDiv.querySelector('.chat-bubble').textContent = '⚠️ Bitte API Key in den Einstellungen eintragen (⚙️ oben rechts).';
    loadDiv.querySelector('.chat-bubble').style.color = 'var(--warning-text)';
    return;
  }

  try {
    const resp = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 600,
        system: COACH_SYSTEM,
        messages: chatHistory.slice(-12)
      })
    });

    if (!resp.ok) throw new Error(`API Error ${resp.status}`);
    const data = await resp.json();
    const reply = data.content?.filter(b => b.type === 'text').map(b => b.text).join('') || 'Fehler beim Antworten.';

    loadDiv.remove();
    appendChatMsg(reply, 'coach');
    chatHistory.push({ role: 'assistant', content: reply });

    // Auto-save notable messages to logbook
    if (text.toLowerCase().includes('check-in')) {
      const logEntry = { date: new Date().toLocaleDateString('de-DE'), title: 'Check-in', note: reply.substring(0, 200), mood: 'ok', cat: 'Training' };
      const logs = DB.get('logbook', []);
      logs.unshift(logEntry);
      DB.set('logbook', logs);
    }

  } catch (e) {
    loadDiv.querySelector('.chat-bubble').textContent = `Fehler: ${e.message}. API Key korrekt?`;
  }
}

function appendChatMsg(text, type) {
  const wrap = document.getElementById('chatMessages');
  const div = document.createElement('div');
  div.className = 'chat-msg ' + type;
  const bubble = document.createElement('div');
  bubble.className = 'chat-bubble';
  bubble.textContent = text;
  div.appendChild(bubble);
  wrap.appendChild(div);
  wrap.scrollTop = wrap.scrollHeight;
  return div;
}
