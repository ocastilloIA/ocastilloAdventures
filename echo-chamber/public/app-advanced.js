/**
 * Echo Chamber Advanced Frontend
 * Features:
 * - Multi-tab interface
 * - Chart.js visualizations
 * - Real-time analytics
 * - Data export
 * - Settings management
 */

// ============================================================================
// STATE MANAGEMENT
// ============================================================================

const state = {
  currentTab: 'analyzer',
  memories: [],
  charts: {},
  settings: {
    autoVisualize: true,
    showFormulas: true,
    groupByType: true,
    darkMode: true,
    animationsEnabled: true
  }
};

// ============================================================================
// INITIALIZATION
// ============================================================================

document.addEventListener('DOMContentLoaded', () => {
  initializeEventListeners();
  loadSettings();
  loadMemories();
  initializeCharts();
  showStatus('Welcome to Echo Castle! 🏰', 'info');
});

function initializeEventListeners() {
  // Tab switching
  document.querySelectorAll('.nav-tab').forEach(tab => {
    tab.addEventListener('click', (e) => switchTab(e.target.dataset.tab));
  });

  // Analyzer
  document.getElementById('testBtn').addEventListener('click', analyzeSequence);
  document.getElementById('sequenceInput').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') analyzeSequence();
  });

  // Example buttons
  document.querySelectorAll('.example-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.getElementById('sequenceInput').value = btn.dataset.example;
      analyzeSequence();
    });
  });

  // Batch testing
  document.getElementById('batchBtn').addEventListener('click', testBatch);

  // Gallery
  document.getElementById('filterType').addEventListener('change', updateMemoriesList);
  document.getElementById('clearMemBtn').addEventListener('click', clearAllMemories);

  // Export
  document.getElementById('exportJsonBtn').addEventListener('click', () => exportData('json'));
  document.getElementById('exportCsvBtn').addEventListener('click', () => exportData('csv'));
  document.getElementById('exportStatsBtn').addEventListener('click', () => exportData('stats'));

  // Settings
  document.querySelectorAll('.setting-group input[type="checkbox"]').forEach(input => {
    input.addEventListener('change', (e) => {
      const setting = e.target.id;
      state.settings[setting] = e.target.checked;
      saveSettings();
      applySetting(setting, e.target.checked);
    });
  });

  // Developer tools
  document.getElementById('consoleBtn').addEventListener('click', openConsole);
  document.getElementById('healthCheckBtn').addEventListener('click', healthCheck);
  document.getElementById('apiDocsBtn').addEventListener('click', showApiDocs);
}

// ============================================================================
// TAB MANAGEMENT
// ============================================================================

function switchTab(tabName) {
  // Update content
  document.querySelectorAll('.tab-content').forEach(tab => {
    tab.classList.remove('active');
  });
  document.getElementById(`${tabName}-tab`).classList.add('active');

  // Update navigation
  document.querySelectorAll('.nav-tab').forEach(tab => {
    tab.classList.remove('active');
  });
  event.target.classList.add('active');

  state.currentTab = tabName;

  // Refresh charts for specific tabs
  if (tabName === 'gallery') {
    updateMemoriesList();
    updateDistributionChart();
  } else if (tabName === 'analytics') {
    refreshAnalytics();
  }
}

// ============================================================================
// ANALYZER TAB
// ============================================================================

async function analyzeSequence() {
  const input = document.getElementById('sequenceInput').value.trim();
  
  if (!input) {
    showStatus('Please enter a sequence', 'error');
    return;
  }

  try {
    // Parse input
    const sequence = input.split(',').map(n => {
      const num = parseFloat(n.trim());
      if (isNaN(num)) throw new Error(`Invalid number: ${n}`);
      return num;
    });

    // Call API
    const response = await fetch('/api/test', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sequence })
    });

    const data = await response.json();

    if (!data.success) {
      showStatus(`Error: ${data.error}`, 'error');
      return;
    }

    // Display result
    displayResult(data.result);

    // Visualize
    if (state.settings.autoVisualize) {
      visualizeSequence(sequence, data.result);
    }

    // Refresh analytics
    await loadMemories();
    updateStatistics();

    showStatus('✨ Sequence analyzed successfully!', 'success');
  } catch (error) {
    showStatus(`Error: ${error.message}`, 'error');
  }
}

function displayResult(result) {
  const container = document.getElementById('resultsContainer');
  const { sequence, patternType, analysis } = result;

  const html = `
    <div class="result-item">
      <div class="result-header">
        <span class="result-type">${patternType}</span>
        <span style="color: var(--text-secondary); font-size: 0.9rem;">#${result.echoId}</span>
      </div>
      
      <div class="result-value">
        🔮 Next Number: <strong>${analysis.nextNumber.toFixed(analysis.nextNumber % 1 === 0 ? 0 : 4)}</strong>
      </div>

      <div class="result-details">
        <strong>Sequence:</strong> ${sequence.join(', ')}<br>
        <strong>Confidence:</strong> ${((analysis.confidence || 1.0) * 100).toFixed(1)}%<br>
        ${analysis.description ? `<strong>Pattern:</strong> ${analysis.description}<br>` : ''}
        ${analysis.difference !== undefined ? `<strong>Common Difference:</strong> ${analysis.difference}<br>` : ''}
        ${analysis.ratio !== undefined ? `<strong>Common Ratio:</strong> ${analysis.ratio.toFixed(4)}<br>` : ''}
      </div>

      ${analysis.formula && state.settings.showFormulas ? `
        <div class="result-formula">
          Formula: ${analysis.formula}
        </div>
      ` : ''}
    </div>
  `;

  container.innerHTML = html;
}

function visualizeSequence(sequence, result) {
  const ctx = document.getElementById('sequenceChart');
  if (!ctx) return;

  // Destroy previous chart
  if (state.charts.sequenceChart) {
    state.charts.sequenceChart.destroy();
  }

  const labels = sequence.map((_, i) => i + 1);
  const predictedNext = result.analysis.nextNumber;
  const extendedSequence = [...sequence, predictedNext];
  const extendedLabels = [...labels, labels.length + 1];

  state.charts.sequenceChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: extendedLabels,
      datasets: [
        {
          label: 'Sequence Values',
          data: sequence,
          borderColor: '#6366f1',
          backgroundColor: 'rgba(99, 102, 241, 0.1)',
          borderWidth: 3,
          fill: true,
          tension: 0.4,
          pointRadius: 6,
          pointBackgroundColor: '#8b5cf6',
          pointBorderColor: '#6366f1',
          pointBorderWidth: 2
        },
        {
          label: 'Predicted Next',
          data: [...Array(sequence.length - 1).fill(null), sequence[sequence.length - 1], predictedNext],
          borderColor: '#ec4899',
          backgroundColor: 'rgba(236, 72, 153, 0.1)',
          borderWidth: 3,
          borderDash: [5, 5],
          fill: false,
          tension: 0.4,
          pointRadius: 8,
          pointBackgroundColor: '#ec4899',
          pointBorderColor: '#fff',
          pointBorderWidth: 2
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          labels: { color: '#f1f5f9' }
        }
      },
      scales: {
        y: {
          ticks: { color: '#cbd5e1' },
          grid: { color: 'rgba(99, 102, 241, 0.1)' }
        },
        x: {
          ticks: { color: '#cbd5e1' },
          grid: { color: 'rgba(99, 102, 241, 0.1)' }
        }
      }
    }
  });
}

// ============================================================================
// BATCH TESTING
// ============================================================================

async function testBatch() {
  const input = document.getElementById('batchInput').value.trim();
  
  if (!input) {
    showStatus('Enter sequences in batch input', 'error');
    return;
  }

  try {
    const sequences = input.split('\n').map(line => {
      return line.split(',').map(n => {
        const num = parseFloat(n.trim());
        if (isNaN(num)) throw new Error(`Invalid number: ${n}`);
        return num;
      });
    }).filter(seq => seq.length > 0);

    const response = await fetch('/api/predict-batch', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sequences })
    });

    const data = await response.json();

    if (data.success) {
      showStatus(
        `✨ Batch testing complete! ${data.successful} succeeded, ${data.failed} failed`,
        'success'
      );
      await loadMemories();
      updateStatistics();
    }
  } catch (error) {
    showStatus(`Error: ${error.message}`, 'error');
  }
}

// ============================================================================
// GALLERY TAB
// ============================================================================

async function loadMemories() {
  try {
    const response = await fetch('/api/memories');
    const data = await response.json();
    state.memories = data.memories || [];
    updateMemoriesList();
    updateStatistics();
  } catch (error) {
    showStatus(`Error loading memories: ${error.message}`, 'error');
  }
}

function updateMemoriesList() {
  const container = document.getElementById('memoriesList');
  const filterType = document.getElementById('filterType').value;

  let filtered = state.memories;
  if (filterType) {
    filtered = state.memories.filter(m => m.success && m.analysis.type === filterType);
  }

  if (filtered.length === 0) {
    container.innerHTML = '<p class="placeholder">No sequences found...</p>';
    return;
  }

  const html = filtered
    .reverse()
    .map(mem => `
      <div class="memory-item ${mem.success ? mem.analysis.type : 'error'}">
        <strong>#${mem.echoId}</strong> | 
        ${mem.success ? `
          <span>${mem.analysis.type}</span> | 
          <span>${mem.sequence.join(', ')}</span> → 
          <strong>${mem.analysis.nextNumber.toFixed(2)}</strong>
        ` : `
          <span style="color: #fca5a5;">Error: ${mem.error}</span>
        `}
      </div>
    `)
    .join('');

  container.innerHTML = html;
}

async function clearAllMemories() {
  if (!confirm('Are you sure you want to clear all memories?')) return;

  try {
    const response = await fetch('/api/memories', { method: 'DELETE' });
    const data = await response.json();

    if (data.success) {
      await loadMemories();
      showStatus('All memories cleared! 🔄', 'success');
    }
  } catch (error) {
    showStatus(`Error: ${error.message}`, 'error');
  }
}

// ============================================================================
// ANALYTICS TAB
// ============================================================================

async function refreshAnalytics() {
  updateStatistics();
  await updateDistributionChart();
  await updateTimelineChart();
  await updateConfidenceChart();
}

function updateStatistics() {
  const successful = state.memories.filter(m => m.success).length;
  const failed = state.memories.filter(m => !m.success).length;
  const total = state.memories.length;
  const rate = total > 0 ? ((successful / total) * 100).toFixed(1) : 0;

  document.getElementById('statTotal').textContent = total;
  document.getElementById('statSuccess').textContent = successful;
  document.getElementById('statFailed').textContent = failed;
  document.getElementById('statRate').textContent = `${rate}%`;
}

async function updateDistributionChart() {
  try {
    const response = await fetch('/api/visualization/pattern-distribution');
    const data = await response.json();

    if (!data.success) return;

    const ctx = document.getElementById('distributionChart');
    if (!ctx) return;

    if (state.charts.distributionChart) {
      state.charts.distributionChart.destroy();
    }

    state.charts.distributionChart = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: data.labels.map(l => {
          const names = { arithmetic: 'AP', geometric: 'GP', fibonacci: 'Fibonacci', polynomial: 'Polynomial' };
          return names[l] || l;
        }),
        datasets: [{
          data: data.data,
          backgroundColor: data.colors,
          borderColor: '#1e293b',
          borderWidth: 2
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { labels: { color: '#f1f5f9' } }
        }
      }
    });
  } catch (error) {
    console.error('Error updating distribution chart:', error);
  }
}

async function updateTimelineChart() {
  try {
    const response = await fetch('/api/visualization/success-timeline');
    const data = await response.json();

    if (!data.success || !data.timeline) return;

    const ctx = document.getElementById('timelineChart');
    if (!ctx) return;

    if (state.charts.timelineChart) {
      state.charts.timelineChart.destroy();
    }

    state.charts.timelineChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: data.timeline.map(item => `#${item.index}`),
        datasets: [{
          label: 'Success',
          data: data.timeline.map(item => item.success),
          backgroundColor: data.timeline.map(item => item.success ? '#10b981' : '#ef4444'),
          borderRadius: 5
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        indexAxis: 'x',
        plugins: {
          legend: { display: false }
        },
        scales: {
          y: {
            beginAtZero: true,
            max: 1,
            ticks: { color: '#cbd5e1', stepSize: 1 },
            grid: { color: 'rgba(99, 102, 241, 0.1)' }
          },
          x: { ticks: { color: '#cbd5e1' } }
        }
      }
    });
  } catch (error) {
    console.error('Error updating timeline chart:', error);
  }
}

async function updateConfidenceChart() {
  try {
    const response = await fetch('/api/visualization/confidence-scores');
    const data = await response.json();

    if (!data.success || !data.data) return;

    const ctx = document.getElementById('confidenceChart');
    if (!ctx) return;

    if (state.charts.confidenceChart) {
      state.charts.confidenceChart.destroy();
    }

    state.charts.confidenceChart = new Chart(ctx, {
      type: 'scatter',
      data: {
        datasets: [{
          label: 'Confidence Scores',
          data: data.data.map((item, i) => ({ x: i + 1, y: item.confidence })),
          backgroundColor: '#6366f1',
          borderColor: '#8b5cf6',
          borderWidth: 2,
          pointRadius: 5
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { labels: { color: '#f1f5f9' } } },
        scales: {
          y: {
            beginAtZero: true,
            max: 1,
            ticks: { color: '#cbd5e1' },
            grid: { color: 'rgba(99, 102, 241, 0.1)' }
          },
          x: { ticks: { color: '#cbd5e1' } }
        }
      }
    });
  } catch (error) {
    console.error('Error updating confidence chart:', error);
  }
}

// ============================================================================
// DATA EXPORT
// ============================================================================

async function exportData(format) {
  try {
    if (format === 'json') {
      const response = await fetch('/api/export/json');
      const blob = await response.blob();
      downloadFile(blob, 'echo-chamber-export.json');
      showStatus('📥 Data exported as JSON', 'success');
    } else if (format === 'csv') {
      const csv = convertToCSV(state.memories);
      const blob = new Blob([csv], { type: 'text/csv' });
      downloadFile(blob, 'echo-chamber-export.csv');
      showStatus('📋 Data exported as CSV', 'success');
    } else if (format === 'stats') {
      const stats = {
        exportDate: new Date().toISOString(),
        totalTests: state.memories.length,
        successful: state.memories.filter(m => m.success).length,
        failed: state.memories.filter(m => !m.success).length
      };
      const blob = new Blob([JSON.stringify(stats, null, 2)], { type: 'application/json' });
      downloadFile(blob, 'echo-chamber-stats.json');
      showStatus('📊 Statistics exported', 'success');
    }
  } catch (error) {
    showStatus(`Error: ${error.message}`, 'error');
  }
}

function convertToCSV(memories) {
  let csv = 'ID,Sequence,Pattern,NextValue,Success,Timestamp\n';
  memories.forEach(mem => {
    const seq = mem.sequence.join(' ');
    const pattern = mem.success ? mem.analysis.type : 'ERROR';
    const nextVal = mem.success ? mem.analysis.nextNumber : 'N/A';
    const success = mem.success ? 'Yes' : 'No';
    csv += `${mem.echoId},"${seq}",${pattern},${nextVal},${success},${mem.timestamp}\n`;
  });
  return csv;
}

function downloadFile(blob, filename) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// ============================================================================
// SETTINGS
// ============================================================================

function loadSettings() {
  const saved = localStorage.getItem('echoSettings');
  if (saved) {
    state.settings = JSON.parse(saved);
    document.getElementById('autoVisualize').checked = state.settings.autoVisualize;
    document.getElementById('showFormulas').checked = state.settings.showFormulas;
    document.getElementById('groupByType').checked = state.settings.groupByType;
    document.getElementById('darkMode').checked = state.settings.darkMode;
    document.getElementById('animationsEnabled').checked = state.settings.animationsEnabled;
  }
}

function saveSettings() {
  localStorage.setItem('echoSettings', JSON.stringify(state.settings));
}

function applySetting(setting, value) {
  if (setting === 'darkMode') {
    document.body.classList.toggle('light-mode', !value);
  } else if (setting === 'animationsEnabled') {
    document.body.style.animation = value ? 'auto' : 'none';
  }
}

// ============================================================================
// CHARTS INITIALIZATION
// ============================================================================

function initializeCharts() {
  // Set Chart.js default colors
  Chart.defaults.color = '#cbd5e1';
  Chart.defaults.borderColor = 'rgba(99, 102, 241, 0.1)';
}

// ============================================================================
// DEVELOPER TOOLS
// ============================================================================

function openConsole() {
  alert('Console opened! Check browser developer tools (F12)');
  console.log('Echo Chamber Advanced Debug Console', state);
}

async function healthCheck() {
  try {
    const response = await fetch('/api/health');
    const data = await response.json();
    alert(`Health Status: ${data.status}\nUptime: ${data.uptime.toFixed(2)}s\nMemories: ${data.memories}`);
  } catch (error) {
    showStatus(`Health check failed: ${error.message}`, 'error');
  }
}

function showApiDocs() {
  const docs = `
Echo Chamber API Documentation

Available Endpoints:

POST /api/test - Test a sequence
POST /api/analyze - Analyze without storing
POST /api/predict-batch - Test multiple sequences
GET /api/memories - Get all memories
GET /api/memories/:type - Get memories by type
DELETE /api/memories - Clear all memories
GET /api/stats - Get statistics
GET /api/trends - Get historical trends
GET /api/export - Export all data
GET /api/visualization/pattern-distribution
GET /api/visualization/success-timeline
GET /api/visualization/confidence-scores
GET /api/health - Health check

For full documentation, visit: http://localhost:3000/api
  `;
  alert(docs);
}

// ============================================================================
// UTILITIES
// ============================================================================

function showStatus(message, type = 'info') {
  const statusBar = document.getElementById('statusBar');
  const messageEl = document.createElement('div');
  messageEl.className = `status-message ${type}`;
  messageEl.textContent = message;
  statusBar.appendChild(messageEl);

  setTimeout(() => {
    messageEl.style.animation = 'slideOut 0.3s ease-out forwards';
    setTimeout(() => messageEl.remove(), 300);
  }, 3000);
}
