/**
 * Echo Chamber Web Interface - Frontend JavaScript
 * 
 * Handles all frontend interactions, API calls, and dynamic UI updates
 */

// ============================================================================
// GLOBAL STATE
// ============================================================================

let appState = {
  isLoading: false,
  memories: [],
  stats: {
    totalEchoes: 0,
    successful: 0,
    failed: 0,
    successRate: 0
  }
};

// ============================================================================
// DOM ELEMENTS
// ============================================================================

const elements = {
  sequenceInput: document.getElementById('sequenceInput'),
  testBtn: document.getElementById('testBtn'),
  resultArea: document.getElementById('resultArea'),
  resultContent: document.getElementById('resultContent'),
  memoriesList: document.getElementById('memoriesList'),
  totalEchoes: document.getElementById('totalEchoes'),
  successfulEchoes: document.getElementById('successfulEchoes'),
  failedEchoes: document.getElementById('failedEchoes'),
  successRate: document.getElementById('successRate'),
  clearMemoriesBtn: document.getElementById('clearMemoriesBtn')
};

// ============================================================================
// EVENT LISTENERS
// ============================================================================

document.addEventListener('DOMContentLoaded', () => {
  console.log('🔮 Echo Chamber Web Interface Loaded');
  
  // Event listeners
  elements.testBtn.addEventListener('click', testSequence);
  elements.sequenceInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') testSequence();
  });
  elements.clearMemoriesBtn.addEventListener('click', clearMemories);

  // Initial load
  loadMemories();
  loadStats();
});

// ============================================================================
// API FUNCTIONS
// ============================================================================

/**
 * Parse sequence string into array of numbers
 */
function parseSequence(input) {
  return input
    .split(',')
    .map(num => num.trim())
    .filter(num => num !== '')
    .map(num => parseFloat(num));
}

/**
 * Test a sequence via API
 */
async function testSequence() {
  const input = elements.sequenceInput.value.trim();

  // Validation
  if (!input) {
    showError('Please enter a sequence (e.g., 3, 6, 9, 12)');
    return;
  }

  // Parse sequence
  const sequence = parseSequence(input);

  if (sequence.length === 0) {
    showError('Please enter valid numbers separated by commas');
    return;
  }

  if (sequence.some(num => isNaN(num))) {
    showError('All values must be valid numbers');
    return;
  }

  // Disable button and show loading
  setButtonLoading(true);

  try {
    const response = await fetch('/api/test', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ sequence })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to test sequence');
    }

    const data = await response.json();
    
    if (data.success) {
      showSuccess(data.result);
      elements.sequenceInput.value = '';
      
      // Reload memories and stats
      await loadMemories();
      await loadStats();
    } else {
      showError(data.error);
    }
  } catch (error) {
    showError(error.message);
  } finally {
    setButtonLoading(false);
  }
}

/**
 * Load memories from API
 */
async function loadMemories() {
  try {
    const response = await fetch('/api/memories');
    const data = await response.json();

    appState.memories = data.memories;
    updateMemoriesList();
  } catch (error) {
    console.error('Error loading memories:', error);
  }
}

/**
 * Load statistics from API
 */
async function loadStats() {
  try {
    const response = await fetch('/api/stats');
    const data = await response.json();

    appState.stats = data;
    updateStatsDisplay();
  } catch (error) {
    console.error('Error loading stats:', error);
  }
}

/**
 * Clear all memories
 */
async function clearMemories() {
  if (!confirm('Are you sure you want to clear all echoes from the chamber?')) {
    return;
  }

  try {
    const response = await fetch('/api/memories', {
      method: 'DELETE'
    });

    if (response.ok) {
      appState.memories = [];
      updateMemoriesList();
      loadStats();
      showInfo('All echoes have been cleared from the chamber');
    }
  } catch (error) {
    showError('Failed to clear memories: ' + error.message);
  }
}

// ============================================================================
// UI UPDATE FUNCTIONS
// ============================================================================

/**
 * Show success result
 */
function showSuccess(result) {
  const { sequence, commonDifference, predictedNext } = result;
  
  const html = `
    <div class="result-content result-success">
      <div class="result-label">✓ Sequence Analyzed</div>
      <div class="result-value">${sequence.join(', ')}</div>
      
      <div style="margin-bottom: 10px;">
        <div class="result-label">Common Difference</div>
        <div class="result-value" style="color: #8b5cf6;">${commonDifference}</div>
      </div>
      
      <div>
        <div class="result-label">🔮 Predicted Next Echo</div>
        <div class="result-value" style="color: #10b981; font-size: 1.8rem;">
          ${predictedNext}
        </div>
      </div>
    </div>
  `;

  elements.resultContent.innerHTML = html;
  elements.resultArea.classList.remove('hidden');
  elements.resultArea.scrollIntoView({ behavior: 'smooth' });
}

/**
 * Show error result
 */
function showError(message) {
  const html = `
    <div class="result-content result-error">
      <div class="result-label">✗ Error</div>
      <div class="result-error-msg">${escapeHtml(message)}</div>
    </div>
  `;

  elements.resultContent.innerHTML = html;
  elements.resultArea.classList.remove('hidden');
  elements.resultArea.scrollIntoView({ behavior: 'smooth' });
}

/**
 * Show info message
 */
function showInfo(message) {
  const html = `
    <div class="result-content" style="border-left-color: #3b82f6;">
      <div class="result-label">ℹ Info</div>
      <div style="color: #3b82f6;">${escapeHtml(message)}</div>
    </div>
  `;

  elements.resultContent.innerHTML = html;
  elements.resultArea.classList.remove('hidden');
}

/**
 * Update memories list display
 */
function updateMemoriesList() {
  if (appState.memories.length === 0) {
    elements.memoriesList.innerHTML = '<p class="empty-message">No echoes recorded yet. Test a sequence to begin!</p>';
    return;
  }

  const html = appState.memories.map(memory => {
    const sequenceStr = memory.sequence.join(', ');
    const isSuccess = memory.success;
    const status = isSuccess ? '✓' : '✗';
    const statusClass = isSuccess ? 'success' : 'error';

    if (isSuccess) {
      return `
        <div class="memory-item ${statusClass}">
          <div class="memory-header">
            <span class="memory-echo-id">${status} Echo #${memory.echoId}</span>
            <span class="memory-timestamp">${memory.timestamp}</span>
          </div>
          <div class="memory-sequence">[${sequenceStr}]</div>
          <div>
            <span style="color: #94a3b8;">Diff: </span>
            <span class="memory-result">${memory.commonDifference}</span>
            <span style="color: #94a3b8;"> → Next: </span>
            <span class="memory-result">${memory.predictedNext}</span>
          </div>
        </div>
      `;
    } else {
      return `
        <div class="memory-item ${statusClass}">
          <div class="memory-header">
            <span class="memory-echo-id">${status} Echo #${memory.echoId}</span>
            <span class="memory-timestamp">${memory.timestamp}</span>
          </div>
          <div class="memory-sequence">[${sequenceStr}]</div>
          <div class="memory-error">${escapeHtml(memory.error)}</div>
        </div>
      `;
    }
  }).reverse().join('');

  elements.memoriesList.innerHTML = html;
}

/**
 * Update statistics display
 */
function updateStatsDisplay() {
  const { totalEchoes, successful, failed, successRate } = appState.stats;

  elements.totalEchoes.textContent = totalEchoes;
  elements.successfulEchoes.textContent = successful;
  elements.failedEchoes.textContent = failed;
  elements.successRate.textContent = successRate + '%';
}

/**
 * Set button loading state
 */
function setButtonLoading(isLoading) {
  appState.isLoading = isLoading;
  elements.testBtn.disabled = isLoading;
  
  if (isLoading) {
    elements.testBtn.classList.add('loading');
    elements.testBtn.textContent = 'Testing...';
  } else {
    elements.testBtn.classList.remove('loading');
    elements.testBtn.textContent = 'Test Sequence';
  }
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Escape HTML special characters
 */
function escapeHtml(text) {
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };
  return text.replace(/[&<>"']/g, m => map[m]);
}

/**
 * Set example sequence in input
 */
function setExample(example) {
  elements.sequenceInput.value = example;
  elements.sequenceInput.focus();
}

// ============================================================================
// KEYBOARD SHORTCUTS
// ============================================================================

document.addEventListener('keydown', (e) => {
  // Ctrl/Cmd + Enter to test
  if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
    testSequence();
  }

  // Escape to hide result
  if (e.key === 'Escape') {
    elements.resultArea.classList.add('hidden');
  }
});

// ============================================================================
// INITIALIZATION
// ============================================================================

console.log('✨ Echo Chamber Web Interface Ready ✨');
