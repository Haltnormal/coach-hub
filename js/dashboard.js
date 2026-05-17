/* ==========================================
   COACH HUB — dashboard.js
   Charts: VO2max, HRV trends
   ========================================== */

let chartsBuilt = false;

function buildCharts() {
  if (chartsBuilt) return;
  chartsBuilt = true;

  const isDark = matchMedia('(prefers-color-scheme: dark)').matches;
  const gc = isDark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.06)';
  const tc = isDark ? '#aaa' : '#888';

  const base = (yMin, yMax, suffix) => ({
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: { callbacks: { label: c => c.parsed.y.toFixed(1) + suffix } }
    },
    scales: {
      x: { grid: { color: gc }, ticks: { color: tc, font: { size: 10 } } },
      y: { grid: { color: gc }, min: yMin, max: yMax, ticks: { color: tc, font: { size: 10 } } }
    }
  });

  // VO2max chart
  const vo2El = document.getElementById('vo2Chart');
  if (vo2El) {
    new Chart(vo2El, {
      type: 'line',
      data: {
        labels: ['Okt','Nov','Dez','Jan','Feb','Mrz','Apr','Mai'],
        datasets: [{
          data: [42.2, 42.5, 46.5, 42.5, 42.7, 44.8, 46.8, 47.2],
          borderColor: '#378ADD',
          backgroundColor: 'rgba(55,138,221,0.08)',
          borderWidth: 2.5, pointRadius: 4,
          pointBackgroundColor: '#378ADD', fill: true, tension: 0.3
        }]
      },
      options: base(38, 52, ' ml/kg/min')
    });
  }

  // HRV chart
  const hrvEl = document.getElementById('hrvChart');
  if (hrvEl) {
    const weeks = ['9.Feb','23.Feb','9.Mrz','23.Mrz','6.Apr','20.Apr','4.Mai','11.Mai'];
    const hrv   = [79.1, 77.3, 77.0, 74.4, 81.3, 77.3, 68.1, 80.7];
    const rhr   = [52.3, 55.2, 51.3, 50.1, 51.8, 50.5, 50.4, 45.3];
    new Chart(hrvEl, {
      type: 'line',
      data: {
        labels: weeks,
        datasets: [
          { data: hrv, borderColor: '#1D9E75', backgroundColor: 'transparent', borderWidth: 2, pointRadius: 3, pointBackgroundColor: '#1D9E75', tension: 0.3, label: 'HRV' },
          { data: rhr, borderColor: '#E24B4A', backgroundColor: 'transparent', borderWidth: 2, pointRadius: 3, pointBackgroundColor: '#E24B4A', tension: 0.3, borderDash: [5,3], label: 'RHR' }
        ]
      },
      options: {
        ...base(40, 100, ''),
        plugins: {
          legend: { display: true, labels: { color: tc, font: { size: 11 }, boxWidth: 12 } },
          tooltip: { callbacks: { label: c => `${c.dataset.label}: ${c.parsed.y}` } }
        }
      }
    });
  }
}
