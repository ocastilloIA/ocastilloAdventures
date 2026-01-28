/**
 * Comprehensive Test Suite for Echo Chamber Advanced
 * Tests all pattern types with edge cases and performance scenarios
 */

const AdvancedEchoChamber = require('./advanced.js');

// ============================================================================
// TEST UTILITIES
// ============================================================================

class TestRunner {
  constructor() {
    this.tests = [];
    this.passed = 0;
    this.failed = 0;
    this.startTime = null;
  }

  run(name, testFn) {
    this.tests.push({ name, testFn });
  }

  async execute() {
    this.startTime = Date.now();
    console.log('\n' + '='.repeat(70));
    console.log('🧪 ECHO CHAMBER COMPREHENSIVE TEST SUITE');
    console.log('='.repeat(70) + '\n');

    for (const test of this.tests) {
      try {
        await test.testFn();
        this.passed++;
        console.log(`✅ ${test.name}`);
      } catch (error) {
        this.failed++;
        console.log(`❌ ${test.name}`);
        console.log(`   Error: ${error.message}\n`);
      }
    }

    const duration = Date.now() - this.startTime;
    this.printSummary(duration);
  }

  printSummary(duration) {
    const total = this.passed + this.failed;
    const percentage = total > 0 ? ((this.passed / total) * 100).toFixed(1) : 0;

    console.log('\n' + '='.repeat(70));
    console.log('📊 TEST SUMMARY');
    console.log('='.repeat(70));
    console.log(`Total Tests: ${total}`);
    console.log(`Passed: ${this.passed} ✅`);
    console.log(`Failed: ${this.failed} ❌`);
    console.log(`Success Rate: ${percentage}%`);
    console.log(`Duration: ${duration}ms`);
    console.log('='.repeat(70) + '\n');
  }

  assert(condition, message) {
    if (!condition) throw new Error(message);
  }

  assertClose(actual, expected, tolerance = 0.0001, message = '') {
    const diff = Math.abs(actual - expected);
    if (diff > tolerance) {
      throw new Error(
        `${message}\nExpected: ${expected}, Got: ${actual}, Diff: ${diff}`
      );
    }
  }

  assertDeepEqual(actual, expected) {
    if (JSON.stringify(actual) !== JSON.stringify(expected)) {
      throw new Error(
        `Expected: ${JSON.stringify(expected)}\nGot: ${JSON.stringify(actual)}`
      );
    }
  }
}

// ============================================================================
// TEST CASES
// ============================================================================

const runner = new TestRunner();
const chamber = new AdvancedEchoChamber();

// --------
// ARITHMETIC PROGRESSION TESTS
// --------

runner.run('AP: Basic arithmetic progression', () => {
  chamber.clearMemories();
  const seq = [2, 4, 6, 8];
  const result = chamber.analyzeSequence(seq);
  runner.assert(result.type === 'arithmetic', 'Should identify arithmetic progression');
  runner.assertClose(result.difference, 2, 0.0001, 'Difference should be 2');
  runner.assertClose(result.nextNumber, 10, 0.0001, 'Next number should be 10');
});

runner.run('AP: Negative difference', () => {
  const seq = [100, 90, 80, 70];
  const result = chamber.analyzeSequence(seq);
  runner.assert(result.type === 'arithmetic', 'Should identify arithmetic progression');
  runner.assertClose(result.difference, -10, 0.0001, 'Difference should be -10');
  runner.assertClose(result.nextNumber, 60, 0.0001, 'Next number should be 60');
});

runner.run('AP: Decimal differences', () => {
  const seq = [1.5, 2.5, 3.5, 4.5];
  const result = chamber.analyzeSequence(seq);
  runner.assert(result.type === 'arithmetic', 'Should identify arithmetic progression');
  runner.assertClose(result.difference, 1, 0.0001, 'Difference should be 1');
  runner.assertClose(result.nextNumber, 5.5, 0.0001, 'Next number should be 5.5');
});

runner.run('AP: Large numbers', () => {
  const seq = [1000000, 2000000, 3000000, 4000000];
  const result = chamber.analyzeSequence(seq);
  runner.assertClose(result.difference, 1000000, 0.0001);
  runner.assertClose(result.nextNumber, 5000000, 0.0001);
});

// --------
// GEOMETRIC PROGRESSION TESTS
// --------

runner.run('GP: Basic geometric progression', () => {
  const seq = [2, 6, 18, 54];
  const result = chamber.analyzeSequence(seq);
  runner.assert(result.type === 'geometric', 'Should identify geometric progression');
  runner.assertClose(result.ratio, 3, 0.0001, 'Ratio should be 3');
  runner.assertClose(result.nextNumber, 162, 0.0001, 'Next number should be 162');
});

runner.run('GP: Fractional ratio', () => {
  const seq = [100, 50, 25, 12.5];
  const result = chamber.analyzeSequence(seq);
  runner.assert(result.type === 'geometric', 'Should identify geometric progression');
  runner.assertClose(result.ratio, 0.5, 0.0001, 'Ratio should be 0.5');
  runner.assertClose(result.nextNumber, 6.25, 0.0001, 'Next number should be 6.25');
});

runner.run('GP: Negative ratio', () => {
  const seq = [2, -4, 8, -16];
  const result = chamber.analyzeSequence(seq);
  runner.assert(result.type === 'geometric', 'Should identify geometric progression');
  runner.assertClose(result.ratio, -2, 0.0001, 'Ratio should be -2');
  runner.assertClose(result.nextNumber, 32, 0.0001, 'Next number should be 32');
});

// --------
// FIBONACCI-LIKE TESTS
// --------

runner.run('Fibonacci: Classic Fibonacci sequence', () => {
  const seq = [1, 1, 2, 3, 5, 8];
  const result = chamber.analyzeSequence(seq);
  runner.assert(result.type === 'fibonacci', 'Should identify Fibonacci');
  runner.assertClose(result.nextNumber, 13, 0.0001, 'Next number should be 13');
  runner.assert(result.isGoldenSequence === true, 'Should be Golden sequence');
});

runner.run('Fibonacci: Starting with different numbers', () => {
  const seq = [2, 3, 5, 8, 13];
  const result = chamber.analyzeSequence(seq);
  runner.assert(result.type === 'fibonacci', 'Should identify Fibonacci-like');
  runner.assertClose(result.nextNumber, 21, 0.0001, 'Next number should be 21');
});

// --------
// POLYNOMIAL TESTS
// --------

runner.run('Polynomial: Quadratic sequence', () => {
  const seq = [1, 4, 9, 16]; // 1², 2², 3², 4²
  const result = chamber.analyzeSequence(seq);
  runner.assert(result.type === 'polynomial' || result.type === 'quadratic', 'Should identify polynomial');
  runner.assert(result.nextNumber > 20 && result.nextNumber < 30, 'Next number should be around 25');
});

runner.run('Polynomial: Cubic sequence', () => {
  const seq = [1, 8, 27, 64]; // 1³, 2³, 3³, 4³
  const result = chamber.analyzeSequence(seq);
  runner.assert(result.type === 'polynomial', 'Should identify polynomial');
});

runner.run('Polynomial: Linear is arithmetic', () => {
  const seq = [5, 10, 15, 20];
  const result = chamber.analyzeSequence(seq);
  // Should be identified as arithmetic first
  runner.assert(result.type === 'arithmetic', 'Linear should be arithmetic');
});

// --------
// EDGE CASES
// --------

runner.run('Edge: Single element sequence (should error)', () => {
  try {
    chamber.analyzeSequence([5]);
    throw new Error('Should have thrown error');
  } catch (error) {
    runner.assert(error.message.includes('Minimum 2'), 'Should require minimum 2 elements');
  }
});

runner.run('Edge: Non-number elements (should error)', () => {
  try {
    chamber.analyzeSequence([1, 'two', 3]);
    throw new Error('Should have thrown error');
  } catch (error) {
    runner.assert(error.message.includes('must be valid numbers'), 'Should reject non-numbers');
  }
});

runner.run('Edge: NaN values (should error)', () => {
  try {
    chamber.analyzeSequence([1, NaN, 3]);
    throw new Error('Should have thrown error');
  } catch (error) {
    runner.assert(error.message.includes('must be valid numbers'), 'Should reject NaN');
  }
});

runner.run('Edge: Infinity values (should error)', () => {
  try {
    chamber.analyzeSequence([1, Infinity, 3]);
    throw new Error('Should have thrown error');
  } catch (error) {
    runner.assert(error.message.includes('must be valid numbers'), 'Should reject Infinity');
  }
});

runner.run('Edge: Very large differences', () => {
  const seq = [1e10, 2e10, 3e10, 4e10];
  const result = chamber.analyzeSequence(seq);
  runner.assert(result.type === 'arithmetic', 'Should handle very large numbers');
});

runner.run('Edge: Very small differences', () => {
  const seq = [0.0001, 0.0002, 0.0003, 0.0004];
  const result = chamber.analyzeSequence(seq);
  runner.assert(result.type === 'arithmetic', 'Should handle very small numbers');
});

runner.run('Edge: Negative numbers', () => {
  const seq = [-10, -5, 0, 5];
  const result = chamber.analyzeSequence(seq);
  runner.assert(result.type === 'arithmetic', 'Should handle negative numbers');
});

runner.run('Edge: Mixed positive/negative', () => {
  const seq = [-5, 0, 5, 10];
  const result = chamber.analyzeSequence(seq);
  runner.assert(result.type === 'arithmetic', 'Should handle mixed signs');
});

runner.run('Edge: Two element sequence', () => {
  const seq = [10, 20];
  const result = chamber.analyzeSequence(seq);
  runner.assert(result.type === 'arithmetic', 'Should work with 2 elements');
});

// --------
// PERFORMANCE TESTS
// --------

runner.run('Performance: Large sequence (100 elements)', () => {
  const seq = Array.from({length: 100}, (_, i) => i * 2);
  const start = performance.now();
  const result = chamber.analyzeSequence(seq);
  const duration = performance.now() - start;
  runner.assert(result.type === 'arithmetic', 'Should analyze large sequence');
  runner.assert(duration < 100, `Should complete in <100ms (took ${duration.toFixed(2)}ms)`);
});

runner.run('Performance: Large sequence (1000 elements)', () => {
  const seq = Array.from({length: 1000}, (_, i) => i);
  const start = performance.now();
  const result = chamber.analyzeSequence(seq);
  const duration = performance.now() - start;
  runner.assert(result.type === 'arithmetic', 'Should analyze large sequence');
  runner.assert(duration < 500, `Should complete in <500ms (took ${duration.toFixed(2)}ms)`);
});

runner.run('Performance: Repeated analysis (caching)', () => {
  const seq = [1, 2, 3, 4, 5];
  
  // First analysis (uncached)
  const start1 = performance.now();
  chamber.analyzeSequence(seq);
  const duration1 = performance.now() - start1;
  
  // Second analysis (cached)
  const start2 = performance.now();
  chamber.analyzeSequence(seq);
  const duration2 = performance.now() - start2;
  
  runner.assert(duration2 < duration1, 'Cached analysis should be faster');
});

// --------
// MEMORY AND STATISTICS TESTS
// --------

runner.run('Memory: Test tracking', () => {
  chamber.clearMemories();
  chamber.testSequence([1, 2, 3, 4]);
  chamber.testSequence([2, 4, 8, 16]);
  
  const memories = chamber.getMemories();
  runner.assert(memories.length === 2, 'Should track 2 tests');
});

runner.run('Memory: Statistics calculation', () => {
  chamber.clearMemories();
  chamber.testSequence([1, 2, 3, 4]); // Success
  chamber.testSequence([2, 4, 8, 16]); // Success
  
  try {
    chamber.testSequence([1, 'invalid', 3]); // Fail
  } catch (e) {}
  
  const stats = chamber.getStatistics();
  runner.assert(stats.totalTests === 3, 'Should have 3 total tests');
  runner.assert(stats.successful === 2, 'Should have 2 successful');
  runner.assert(stats.failed === 1, 'Should have 1 failed');
  runner.assertClose(stats.successRate, 66.67, 0.1, 'Success rate should be ~66.67%');
});

runner.run('Memory: Type breakdown', () => {
  chamber.clearMemories();
  chamber.testSequence([1, 2, 3, 4]); // Arithmetic
  chamber.testSequence([2, 6, 18, 54]); // Geometric
  chamber.testSequence([1, 1, 2, 3, 5]); // Fibonacci
  
  const stats = chamber.getStatistics();
  runner.assert(stats.typeBreakdown.arithmetic === 1, 'Should have 1 AP');
  runner.assert(stats.typeBreakdown.geometric === 1, 'Should have 1 GP');
  runner.assert(stats.typeBreakdown.fibonacci === 1, 'Should have 1 Fibonacci');
});

runner.run('Memory: Clear functionality', () => {
  chamber.clearMemories();
  chamber.testSequence([1, 2, 3, 4]);
  runner.assert(chamber.getMemories().length === 1, 'Should have 1 memory');
  
  chamber.clearMemories();
  runner.assert(chamber.getMemories().length === 0, 'Should clear memories');
});

// --------
// DATA EXPORT TESTS
// --------

runner.run('Export: Export data structure', () => {
  chamber.clearMemories();
  chamber.testSequence([1, 2, 3, 4]);
  
  const exported = chamber.exportData();
  runner.assert(exported.version === '2.0', 'Should have version');
  runner.assert(exported.exportDate, 'Should have export date');
  runner.assert(exported.statistics, 'Should have statistics');
  runner.assert(exported.memories, 'Should have memories');
  runner.assert(exported.trends, 'Should have trends');
});

// ============================================================================
// RUN ALL TESTS
// ============================================================================

runner.execute();
