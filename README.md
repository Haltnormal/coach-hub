# 🏃 Coach Hub

Persönlicher Athleten-Coach als Web-App — gebaut mit Apple Health Daten und Spiroergometrie-Baseline.

## Features

- **Daily Check-in** — HRV, Schlaf, Readiness Score, Training
- **KI Coach Chat** — direkter Chat mit Anthropic Claude, kennt dein komplettes Profil
- **Dashboard** — VO2max Verlauf, HRV Trends, Ziel-Tracking
- **Workout Generator** — 6 Trainingspläne, readiness-angepasst
- **Laufsession Planer** — basierend auf echten Spiro-Zonen
- **Ernährungs-Tracker** — inkl. KI Makro-Snapshot per Freitext
- **Logbuch** — persistentes Trainings-Tagebuch
- **Mobility Bibliothek** — 4 kontextabhängige Routinen
- **Schlafprotokoll** — 4-Wochen-Plan + Supplement-Tracker

## Setup

### 1. GitHub Pages aktivieren
- Repo Settings → Pages → Source: `main` branch, `/ (root)`
- URL: `https://haltnormal.github.io/coach-hub`

### 2. API Key einrichten
- App öffnen → ⚙️ oben rechts → API Key eintragen
- Key wird nur in `localStorage` gespeichert, nie übertragen
- API Key von: https://console.anthropic.com

### 3. Als App installieren (iPhone)
- Safari → Share → "Zum Home-Bildschirm" → fertig

## Daten

Alle Daten werden lokal im Browser gespeichert (`localStorage`). Kein Server, kein Backend, kein Tracking.

## Profil anpassen

In `js/app.js` → `PROFILE` Objekt — Gewicht, HRV-Baseline, Spiro-Zonen etc.

## Athleten-Baseline (Mai 2026)

| Metrik | Wert |
|--------|------|
| VO2max (Spiro) | 48.7 ml/kg/min |
| VO2max (Watch) | 47.3 ml/kg/min |
| HRV Basis | 78ms |
| Ruhepuls | 45 bpm |
| VT1 | 161 bpm |
| VT2 | 179 bpm |
| Fettmax | 106 bpm |
| Schlaf Ø | 6.8h |
| Tiefschlaf | 0.72h |
| Protein Ø | 64g/Tag |
