/**
 * Echo Chamber Advanced Web Server
 * 
 * Enhanced Express.js server with:
 * - Multi-pattern support (AP, GP, Polynomial, Fibonacci)
 * - Advanced analytics and trends
 * - Performance metrics
 * - Visualization data endpoints
 */

const express = require('express');
const path = require('path');
const AdvancedEchoChamber = require('./advanced.js');
const fs = require('fs');

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.static('public'));

// Create global Advanced Echo Chamber instance
const chamber = new AdvancedEchoChamber();

// Performance monitoring
const metrics = {
  requests: 0,
  avgResponseTime: 0,
  responseTimes: []
};

// ============================================================================
// MIDDLEWARE
// ============================================================================

// Performance tracking middleware
app.use((req, res, next) => {
  const start = performance.now();
  
  res.on('finish', () => {
    const duration = performance.now() - start;
    metrics.requests++;
    metrics.responseTimes.push(duration);
    
    // Keep only last 100 response times
    if (metrics.responseTimes.length > 100) {
      metrics.responseTimes.shift();
    }
    
    metrics.avgResponseTime = metrics.responseTimes.reduce((a, b) => a + b, 0) / metrics.responseTimes.length;
  });
  
  next();
});

// ============================================================================
// ROUTES - MAIN ENDPOINTS
// ============================================================================

/**
 * GET / - Serve the main HTML page
 */
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

/**
 * POST /api/test - Test a sequence (auto-detect pattern)
 */
app.post('/api/test', (req, res) => {
  try {
    const { sequence } = req.body;

    if (!sequence) {
      return res.status(400).json({
        success: false,
        error: 'Sequence is required'
      });
    }

    const memory = chamber.testSequence(sequence);

    res.json({
      success: true,
      result: {
        echoId: memory.echoId,
        sequence: memory.sequence,
        patternType: memory.analysis.type,
        analysis: memory.analysis,
        timestamp: memory.timestamp
      }
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * POST /api/analyze - Analyze without storing
 */
app.post('/api/analyze', (req, res) => {
  try {
    const { sequence } = req.body;

    if (!sequence) {
      return res.status(400).json({
        success: false,
        error: 'Sequence is required'
      });
    }

    const analysis = chamber.analyzeSequence(sequence);

    res.json({
      success: true,
      analysis
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * GET /api/memories - Get all stored memories
 */
app.get('/api/memories', (req, res) => {
  const memories = chamber.getMemories();
  res.json({
    success: true,
    memories,
    count: memories.length
  });
});

/**
 * GET /api/memories/:type - Get memories by pattern type
 */
app.get('/api/memories/:type', (req, res) => {
  try {
    const { type } = req.params;
    const memories = chamber.getMemoriesByType(type);
    
    res.json({
      success: true,
      patternType: type,
      memories,
      count: memories.length
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * DELETE /api/memories - Clear all memories
 */
app.delete('/api/memories', (req, res) => {
  chamber.clearMemories();
  res.json({
    success: true,
    message: 'All echoes have been cleared from the chamber'
  });
});

// ============================================================================
// ROUTES - STATISTICS AND ANALYTICS
// ============================================================================

/**
 * GET /api/stats - Get comprehensive statistics
 */
app.get('/api/stats', (req, res) => {
  const stats = chamber.getStatistics();
  
  res.json({
    success: true,
    statistics: stats,
    performance: {
      totalRequests: metrics.requests,
      avgResponseTime: metrics.avgResponseTime.toFixed(2) + 'ms'
    }
  });
});

/**
 * GET /api/trends - Get historical trends
 */
app.get('/api/trends', (req, res) => {
  const trends = chamber.getHistoricalTrends();
  
  res.json({
    success: true,
    trends
  });
});

/**
 * GET /api/export - Export all data
 */
app.get('/api/export', (req, res) => {
  const exported = chamber.exportData();
  
  // Add performance metrics
  exported.performance = {
    totalRequests: metrics.requests,
    avgResponseTime: metrics.avgResponseTime
  };
  
  res.json(exported);
});

/**
 * GET /api/export/json - Download as JSON file
 */
app.get('/api/export/json', (req, res) => {
  const exported = chamber.exportData();
  
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Content-Disposition', 'attachment; filename=echo-chamber-export.json');
  res.send(JSON.stringify(exported, null, 2));
});

// ============================================================================
// ROUTES - VISUALIZATION DATA
// ============================================================================

/**
 * GET /api/visualization/pattern-distribution
 * Returns data for pattern type pie chart
 */
app.get('/api/visualization/pattern-distribution', (req, res) => {
  const stats = chamber.getStatistics();
  
  const labels = Object.keys(stats.typeBreakdown);
  const data = Object.values(stats.typeBreakdown);
  const colors = generateColorPalette(labels.length);
  
  res.json({
    success: true,
    labels,
    data,
    colors
  });
});

/**
 * GET /api/visualization/success-timeline
 * Returns data for success/failure timeline
 */
app.get('/api/visualization/success-timeline', (req, res) => {
  const memories = chamber.getMemories();
  
  const timeline = memories.map((mem, index) => ({
    index: index + 1,
    success: mem.success ? 1 : 0,
    type: mem.success ? mem.analysis.type : 'error'
  }));
  
  res.json({
    success: true,
    timeline
  });
});

/**
 * GET /api/visualization/confidence-scores
 * Returns confidence scores for successful predictions
 */
app.get('/api/visualization/confidence-scores', (req, res) => {
  const memories = chamber.getSuccessfulMemories();
  
  const confidenceData = memories.map(mem => ({
    echoId: mem.echoId,
    type: mem.analysis.type,
    confidence: mem.analysis.confidence || 1.0,
    timestamp: mem.timestamp
  }));
  
  res.json({
    success: true,
    data: confidenceData
  });
});

// ============================================================================
// ROUTES - UTILITIES
// ============================================================================

/**
 * GET /api/health - Health check
 */
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    uptime: process.uptime(),
    memories: chamber.getMemories().length,
    stats: chamber.getStatistics()
  });
});

/**
 * POST /api/validate - Validate a sequence
 */
app.post('/api/validate', (req, res) => {
  try {
    const { sequence } = req.body;
    
    const validation = chamber.validateInput(sequence);
    
    res.json({
      success: validation.isValid,
      validation,
      message: validation.isValid ? 'Valid sequence' : validation.error
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * POST /api/predict-batch - Test multiple sequences
 */
app.post('/api/predict-batch', (req, res) => {
  try {
    const { sequences } = req.body;
    
    if (!Array.isArray(sequences)) {
      return res.status(400).json({
        success: false,
        error: 'sequences must be an array'
      });
    }
    
    const results = sequences.map((seq, index) => {
      try {
        const memory = chamber.testSequence(seq);
        return {
          index,
          success: true,
          echoId: memory.echoId,
          analysis: memory.analysis
        };
      } catch (error) {
        return {
          index,
          success: false,
          error: error.message
        };
      }
    });
    
    res.json({
      success: true,
      results,
      successful: results.filter(r => r.success).length,
      failed: results.filter(r => !r.success).length
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
});

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

function generateColorPalette(count) {
  const colors = [
    '#6366f1', // indigo
    '#8b5cf6', // purple
    '#ec4899', // pink
    '#06b6d4', // cyan
    '#10b981', // emerald
    '#f59e0b', // amber
    '#ef4444', // red
    '#3b82f6'  // blue
  ];
  
  const palette = [];
  for (let i = 0; i < count; i++) {
    palette.push(colors[i % colors.length]);
  }
  
  return palette;
}

// ============================================================================
// ERROR HANDLING
// ============================================================================

/**
 * 404 Not Found
 */
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Endpoint not found',
    path: req.path
  });
});

/**
 * Error handler
 */
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  
  res.status(500).json({
    success: false,
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// ============================================================================
// SERVER STARTUP
// ============================================================================

const server = app.listen(PORT, () => {
  console.log('\n' + '='.repeat(70));
  console.log('🔮 ECHO CHAMBER ADVANCED WEB SERVER 🔮');
  console.log('='.repeat(70));
  console.log('\n✨ The magical web interface is now running!');
  console.log(`🌐 Open your browser to: http://localhost:${PORT}`);
  console.log(`📊 API Endpoints available at: http://localhost:${PORT}/api`);
  console.log(`📈 Health check: http://localhost:${PORT}/api/health`);
  console.log('\nFeatures:');
  console.log('  • Multi-pattern detection (AP, GP, Polynomial, Fibonacci)');
  console.log('  • Real-time analytics and statistics');
  console.log('  • Visualization data endpoints');
  console.log('  • Batch sequence testing');
  console.log('  • Data export functionality');
  console.log('\nPress Ctrl+C to stop the server\n');
  console.log('='.repeat(70) + '\n');
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\n\n⏸️ Shutting down the Echo Chamber...');
  server.close(() => {
    console.log('✅ Server closed gracefully');
    process.exit(0);
  });
});

module.exports = app;
