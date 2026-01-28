/**
 * Echo Chamber Web Server
 * 
 * This Express.js server provides a web interface for the Echo Chamber
 * application, allowing users to test sequences through a beautiful UI
 * instead of just the command line.
 */

const express = require('express');
const path = require('path');
const EchoChamber = require('./index.js');

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.static('public'));

// Create global Echo Chamber instance
const chamber = new EchoChamber();

// ============================================================================
// ROUTES
// ============================================================================

/**
 * GET / - Serve the main HTML page
 */
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

/**
 * POST /api/test - Test a sequence
 * 
 * Request body: { sequence: [number] }
 * Response: { success: boolean, result: object, error: string }
 */
app.post('/api/test', (req, res) => {
  try {
    const { sequence } = req.body;

    // Validate request
    if (!sequence) {
      return res.status(400).json({
        success: false,
        error: 'Sequence is required'
      });
    }

    // Test the sequence
    const memory = chamber.testSequence(sequence);

    res.json({
      success: true,
      result: {
        echoId: memory.echoId,
        sequence: memory.sequence,
        commonDifference: memory.commonDifference,
        predictedNext: memory.predictedNext,
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
 * GET /api/memories - Get all stored memories
 * 
 * Response: { memories: object[] }
 */
app.get('/api/memories', (req, res) => {
  const memories = chamber.getMemories();
  res.json({ memories });
});

/**
 * DELETE /api/memories - Clear all memories
 * 
 * Response: { success: boolean, message: string }
 */
app.delete('/api/memories', (req, res) => {
  chamber.clearMemories();
  res.json({
    success: true,
    message: 'All echoes have been cleared from the chamber'
  });
});

/**
 * GET /api/stats - Get chamber statistics
 * 
 * Response: { totalEchoes: number, successful: number, failed: number, successRate: number }
 */
app.get('/api/stats', (req, res) => {
  const memories = chamber.getMemories();
  const successful = memories.filter(m => m.success).length;
  const failed = memories.filter(m => !m.success).length;
  const successRate = memories.length > 0 ? (successful / memories.length) * 100 : 0;

  res.json({
    totalEchoes: memories.length,
    successful,
    failed,
    successRate: parseFloat(successRate.toFixed(1))
  });
});

/**
 * GET /api/validate - Validate a sequence without storing
 * 
 * Query params: sequence=1,2,3,4
 * Response: { valid: boolean, difference: number, error: string }
 */
app.get('/api/validate', (req, res) => {
  try {
    const { sequence } = req.query;
    
    if (!sequence) {
      return res.status(400).json({
        valid: false,
        error: 'Sequence is required'
      });
    }

    // Parse sequence string
    const parsed = sequence.split(',').map(num => parseFloat(num.trim()));
    
    // Create temporary chamber for validation
    const tempChamber = new EchoChamber();
    const validation = tempChamber.validateSequence(parsed);

    res.json({
      valid: validation.isValid,
      difference: validation.difference,
      error: validation.error
    });
  } catch (error) {
    res.status(400).json({
      valid: false,
      error: error.message
    });
  }
});

// ============================================================================
// ERROR HANDLING
// ============================================================================

/**
 * 404 Handler
 */
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Route not found'
  });
});

/**
 * Error Handler
 */
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({
    success: false,
    error: 'Internal server error'
  });
});

// ============================================================================
// START SERVER
// ============================================================================

app.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════════════════════════════════════════╗
║                   🔮 ECHO CHAMBER WEB SERVER 🔮                            ║
║                                                                            ║
║  The magical web interface is now running!                                ║
║                                                                            ║
║  Open your browser and visit:                                             ║
║                                                                            ║
║      http://localhost:${PORT}                                                  ║
║                                                                            ║
║  The Echo Room awaits your sequences...                                    ║
╚════════════════════════════════════════════════════════════════════════════╝
  `);
});

// Export for testing
module.exports = { app, chamber };
