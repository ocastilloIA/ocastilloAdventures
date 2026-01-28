/**
 * Echo Chamber - Advanced Pattern Recognition Engine
 * 
 * Extended version with support for:
 * - Arithmetic Progressions (AP)
 * - Geometric Progressions (GP)
 * - Polynomial Sequences
 * - Fibonacci-like sequences
 * - Custom patterns
 */

// ============================================================================
// ADVANCED SEQUENCE ANALYZER
// ============================================================================

class AdvancedEchoChamber {
  /**
   * Initialize the Advanced Echo Chamber
   */
  constructor() {
    this.memories = [];
    this.testCount = 0;
    this.analysisCache = new Map();
  }

  /**
   * Main analysis function - detects pattern type automatically
   */
  analyzeSequence(sequence) {
    // Validate input
    const validation = this.validateInput(sequence);
    if (!validation.isValid) {
      throw new Error(validation.error);
    }

    // Check if in cache
    const cacheKey = JSON.stringify(sequence);
    if (this.analysisCache.has(cacheKey)) {
      return this.analysisCache.get(cacheKey);
    }

    // Try to identify pattern
    let analysis = null;

    // Order of detection: AP, GP, Fibonacci, Polynomial, Custom
    if (this.isArithmeticProgression(sequence)) {
      analysis = this.analyzeArithmetic(sequence);
      analysis.type = 'arithmetic';
    } else if (this.isGeometricProgression(sequence)) {
      analysis = this.analyzeGeometric(sequence);
      analysis.type = 'geometric';
    } else if (this.isFibonacciLike(sequence)) {
      analysis = this.analyzeFibonacci(sequence);
      analysis.type = 'fibonacci';
    } else if (this.isPolynomial(sequence)) {
      analysis = this.analyzePolynomial(sequence);
      analysis.type = 'polynomial';
    } else if (this.isQuadratic(sequence)) {
      analysis = this.analyzeQuadratic(sequence);
      analysis.type = 'quadratic';
    } else {
      analysis = { type: 'unknown', error: 'Pattern not recognized' };
    }

    // Cache result
    this.analysisCache.set(cacheKey, analysis);
    return analysis;
  }

  /**
   * Validate input
   */
  validateInput(sequence) {
    if (!Array.isArray(sequence)) {
      return { isValid: false, error: 'Input must be an array' };
    }

    if (sequence.length < 2) {
      return { isValid: false, error: 'Minimum 2 numbers required' };
    }

    if (!sequence.every(num => typeof num === 'number' && !isNaN(num))) {
      return { isValid: false, error: 'All elements must be valid numbers' };
    }

    return { isValid: true };
  }

  // ========================================================================
  // ARITHMETIC PROGRESSION
  // ========================================================================

  isArithmeticProgression(sequence) {
    if (sequence.length < 2) return false;
    
    const diff = sequence[1] - sequence[0];
    for (let i = 2; i < sequence.length; i++) {
      if (Math.abs((sequence[i] - sequence[i - 1]) - diff) > 1e-10) {
        return false;
      }
    }
    return true;
  }

  analyzeArithmetic(sequence) {
    const difference = sequence[1] - sequence[0];
    const nextNumber = sequence[sequence.length - 1] + difference;
    const formula = `a(n) = ${sequence[0]} + (n-1) * ${difference}`;
    const sum = this.arithmeticSum(sequence.length, sequence[0], difference);

    return {
      type: 'arithmetic',
      difference,
      nextNumber,
      formula,
      sum,
      confidence: 1.0,
      description: `Arithmetic progression with common difference ${difference}`
    };
  }

  arithmeticSum(n, a1, d) {
    return (n / 2) * (2 * a1 + (n - 1) * d);
  }

  // ========================================================================
  // GEOMETRIC PROGRESSION
  // ========================================================================

  isGeometricProgression(sequence) {
    if (sequence.length < 2) return false;
    
    // Check for zero values (can't have in GP)
    if (sequence.some(num => num === 0)) return false;

    const ratio = sequence[1] / sequence[0];
    for (let i = 2; i < sequence.length; i++) {
      if (Math.abs((sequence[i] / sequence[i - 1]) - ratio) > 1e-10) {
        return false;
      }
    }
    return true;
  }

  analyzeGeometric(sequence) {
    const ratio = sequence[1] / sequence[0];
    const nextNumber = sequence[sequence.length - 1] * ratio;
    const formula = `a(n) = ${sequence[0]} * ${ratio}^(n-1)`;
    const sum = this.geometricSum(sequence.length, sequence[0], ratio);

    return {
      type: 'geometric',
      ratio,
      nextNumber,
      formula,
      sum,
      confidence: 1.0,
      description: `Geometric progression with common ratio ${ratio}`
    };
  }

  geometricSum(n, a1, r) {
    if (Math.abs(r - 1) < 1e-10) {
      return n * a1;
    }
    return a1 * (1 - Math.pow(r, n)) / (1 - r);
  }

  // ========================================================================
  // FIBONACCI-LIKE SEQUENCES
  // ========================================================================

  isFibonacciLike(sequence) {
    if (sequence.length < 3) return false;

    for (let i = 2; i < sequence.length; i++) {
      if (Math.abs(sequence[i] - (sequence[i - 1] + sequence[i - 2])) > 1e-10) {
        return false;
      }
    }
    return true;
  }

  analyzeFibonacci(sequence) {
    const nextNumber = sequence[sequence.length - 1] + sequence[sequence.length - 2];
    const formula = `a(n) = a(n-1) + a(n-2)`;
    const ratio = sequence[sequence.length - 1] / sequence[sequence.length - 2];
    const goldenRatio = (1 + Math.sqrt(5)) / 2;
    const isGolden = Math.abs(ratio - goldenRatio) < 0.1;

    return {
      type: 'fibonacci',
      nextNumber,
      formula,
      confidence: 1.0,
      goldenRatio: ratio,
      isGoldenSequence: isGolden,
      description: `Fibonacci-like sequence where each term is sum of previous two`
    };
  }

  // ========================================================================
  // POLYNOMIAL SEQUENCES
  // ========================================================================

  isPolynomial(sequence) {
    // Check differences up to order 3
    for (let order = 1; order <= Math.min(3, sequence.length - 1); order++) {
      const diffs = this.getDifferences(sequence, order);
      if (this.isConstant(diffs)) {
        return true;
      }
    }
    return false;
  }

  getDifferences(sequence, order = 1) {
    let diffs = [...sequence];
    for (let i = 0; i < order; i++) {
      diffs = [];
      for (let j = 1; j < sequence.length - i; j++) {
        diffs.push(sequence[j + i] - sequence[j + i - 1]);
      }
      sequence = [...diffs];
    }
    return diffs;
  }

  isConstant(sequence) {
    if (sequence.length === 0) return false;
    const first = sequence[0];
    return sequence.every(num => Math.abs(num - first) < 1e-10);
  }

  analyzePolynomial(sequence) {
    // Determine polynomial degree
    let degree = 1;
    for (let order = 1; order <= Math.min(3, sequence.length - 1); order++) {
      const diffs = this.getDifferences(sequence, order);
      if (this.isConstant(diffs)) {
        degree = order;
        break;
      }
    }

    const nextNumber = this.predictPolynomial(sequence, degree);
    const degreeNames = ['constant', 'linear', 'quadratic', 'cubic'];

    return {
      type: 'polynomial',
      degree,
      degreeType: degreeNames[degree] || `degree ${degree}`,
      nextNumber,
      confidence: 0.95,
      description: `${degreeNames[degree] || 'Polynomial'} sequence (degree ${degree})`
    };
  }

  predictPolynomial(sequence, degree) {
    // Use Lagrange interpolation for prediction
    const n = sequence.length;
    const x = Array.from({length: n}, (_, i) => i);
    
    // Simple forward difference method
    let diffs = [sequence];
    for (let i = 1; i < degree + 1; i++) {
      const nextDiff = [];
      for (let j = 1; j < diffs[i - 1].length; j++) {
        nextDiff.push(diffs[i - 1][j] - diffs[i - 1][j - 1]);
      }
      diffs.push(nextDiff);
    }

    // Predict next value
    let nextVal = sequence[sequence.length - 1];
    for (let i = 1; i <= degree; i++) {
      nextVal += diffs[i][diffs[i].length - 1];
    }

    return nextVal;
  }

  isQuadratic(sequence) {
    if (sequence.length < 3) return false;

    // Second differences should be constant
    const firstDiffs = [];
    for (let i = 1; i < sequence.length; i++) {
      firstDiffs.push(sequence[i] - sequence[i - 1]);
    }

    const secondDiffs = [];
    for (let i = 1; i < firstDiffs.length; i++) {
      secondDiffs.push(firstDiffs[i] - firstDiffs[i - 1]);
    }

    return this.isConstant(secondDiffs);
  }

  analyzeQuadratic(sequence) {
    // Use three points to find quadratic coefficients
    const n = sequence.length;
    const x = [0, 1, 2];
    const y = [sequence[0], sequence[1], sequence[2]];

    // Solve system: a(0)^2 + b(0) + c = y[0], etc.
    const a = (y[0] - 2*y[1] + y[2]) / 2;
    const b = y[1] - y[0] - a;
    const c = y[0];

    const nextX = n;
    const nextNumber = a * nextX * nextX + b * nextX + c;
    const formula = `a(n) = ${a.toFixed(3)}n² + ${b.toFixed(3)}n + ${c.toFixed(3)}`;

    return {
      type: 'quadratic',
      coefficients: { a, b, c },
      nextNumber,
      formula,
      confidence: 0.95,
      description: `Quadratic sequence: a(n) = ${a.toFixed(3)}n² + ${b.toFixed(3)}n + ${c.toFixed(3)}`
    };
  }

  // ========================================================================
  // TEST AND STORE
  // ========================================================================

  testSequence(sequence) {
    this.testCount++;

    try {
      const analysis = this.analyzeSequence(sequence);

      const memory = {
        echoId: this.testCount,
        sequence,
        analysis,
        timestamp: new Date().toISOString(),
        success: true
      };

      this.memories.push(memory);
      return memory;
    } catch (error) {
      const failedMemory = {
        echoId: this.testCount,
        sequence,
        error: error.message,
        timestamp: new Date().toISOString(),
        success: false
      };

      this.memories.push(failedMemory);
      throw error;
    }
  }

  // ========================================================================
  // MEMORY MANAGEMENT
  // ========================================================================

  getMemories() {
    return this.memories;
  }

  getSuccessfulMemories() {
    return this.memories.filter(m => m.success);
  }

  getMemoriesByType(type) {
    return this.memories.filter(m => m.success && m.analysis.type === type);
  }

  getStatistics() {
    const total = this.memories.length;
    const successful = this.memories.filter(m => m.success).length;
    const failed = total - successful;

    const typeBreakdown = {};
    this.memories.forEach(m => {
      if (m.success) {
        const type = m.analysis.type;
        typeBreakdown[type] = (typeBreakdown[type] || 0) + 1;
      }
    });

    return {
      totalTests: total,
      successful,
      failed,
      successRate: total > 0 ? (successful / total) * 100 : 0,
      typeBreakdown
    };
  }

  clearMemories() {
    this.memories = [];
    this.testCount = 0;
    this.analysisCache.clear();
  }

  // ========================================================================
  // HISTORICAL ANALYSIS
  // ========================================================================

  getHistoricalTrends() {
    const trends = {
      byType: {},
      byTime: [],
      accuracy: []
    };

    this.memories.forEach((mem, index) => {
      if (mem.success) {
        const type = mem.analysis.type;
        if (!trends.byType[type]) {
          trends.byType[type] = [];
        }
        trends.byType[type].push({
          index,
          timestamp: mem.timestamp,
          confidence: mem.analysis.confidence
        });
      }
    });

    return trends;
  }

  exportData() {
    return {
      version: '2.0',
      exportDate: new Date().toISOString(),
      statistics: this.getStatistics(),
      memories: this.memories,
      trends: this.getHistoricalTrends()
    };
  }
}

// ============================================================================
// EXPORT
// ============================================================================

module.exports = AdvancedEchoChamber;
