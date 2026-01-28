/**
 * Example Usage - Echo Chamber
 * 
 * This file demonstrates various ways to use the Echo Chamber module
 * in your own projects.
 */

const EchoChamber = require('./index.js');

// ===========================================================================
// EXAMPLE 1: Basic Usage - Single Sequence Prediction
// ===========================================================================
console.log('═══════════════════════════════════════════════════════════════');
console.log('EXAMPLE 1: Basic Usage - Single Sequence Prediction');
console.log('═══════════════════════════════════════════════════════════════\n');

const chamber1 = new EchoChamber();

try {
  const result = chamber1.testSequence([2, 4, 6, 8, 10]);
  console.log(`Input: [2, 4, 6, 8, 10]`);
  console.log(`Common Difference: ${result.commonDifference}`);
  console.log(`Predicted Next: ${result.predictedNext}\n`);
} catch (error) {
  console.error(`Error: ${error.message}\n`);
}

// ===========================================================================
// EXAMPLE 2: Multiple Sequence Testing with Memory Tracking
// ===========================================================================
console.log('═══════════════════════════════════════════════════════════════');
console.log('EXAMPLE 2: Multiple Sequence Testing with Memory Tracking');
console.log('═══════════════════════════════════════════════════════════════\n');

const chamber2 = new EchoChamber();
const sequences = [
  [1, 3, 5, 7, 9],
  [100, 90, 80, 70],
  [0, 0, 0, 0],
  [-10, -5, 0, 5, 10]
];

sequences.forEach(seq => {
  try {
    const result = chamber2.testSequence(seq);
    console.log(`✓ [${seq}] → Next: ${result.predictedNext}`);
  } catch (error) {
    console.log(`✗ [${seq}] → Error: ${error.message}`);
  }
});

console.log(`\nTotal echoes tested: ${chamber2.getMemories().length}\n`);

// ===========================================================================
// EXAMPLE 3: Validation Without Storage
// ===========================================================================
console.log('═══════════════════════════════════════════════════════════════');
console.log('EXAMPLE 3: Validation Without Storage (Direct Prediction)');
console.log('═══════════════════════════════════════════════════════════════\n');

const chamber3 = new EchoChamber();

const testSequence = [5, 10, 15, 20];
try {
  const result = chamber3.predictNextNumber(testSequence);
  console.log(`Sequence: [${result.sequence}]`);
  console.log(`Common Difference: ${result.commonDifference}`);
  console.log(`Prediction: ${result.nextNumber}\n`);
} catch (error) {
  console.error(`Error: ${error.message}\n`);
}

// ===========================================================================
// EXAMPLE 4: Batch Testing with Error Handling
// ===========================================================================
console.log('═══════════════════════════════════════════════════════════════');
console.log('EXAMPLE 4: Batch Testing with Error Handling');
console.log('═══════════════════════════════════════════════════════════════\n');

const chamber4 = new EchoChamber();

const testCases = [
  { name: 'Valid Progression', sequence: [3, 6, 9, 12] },
  { name: 'Negative Difference', sequence: [20, 16, 12, 8] },
  { name: 'Large Numbers', sequence: [1000, 2000, 3000] },
  { name: 'Invalid Progression', sequence: [1, 1, 2, 3, 5] },
  { name: 'Empty Array', sequence: [] }
];

const results = [];

testCases.forEach(testCase => {
  try {
    const memory = chamber4.testSequence(testCase.sequence);
    results.push({
      name: testCase.name,
      status: 'SUCCESS',
      prediction: memory.predictedNext
    });
    console.log(`✓ ${testCase.name}: Next = ${memory.predictedNext}`);
  } catch (error) {
    results.push({
      name: testCase.name,
      status: 'FAILED',
      error: error.message
    });
    console.log(`✗ ${testCase.name}: ${error.message}`);
  }
});

console.log(`\nSummary: ${results.filter(r => r.status === 'SUCCESS').length}/${results.length} passed\n`);

// ===========================================================================
// EXAMPLE 5: Extracting Memory Data
// ===========================================================================
console.log('═══════════════════════════════════════════════════════════════');
console.log('EXAMPLE 5: Extracting Memory Data');
console.log('═══════════════════════════════════════════════════════════════\n');

const chamber5 = new EchoChamber();

// Perform some tests
chamber5.testSequence([1, 4, 7, 10]);
chamber5.testSequence([10, 5, 0, -5]);

const memories = chamber5.getMemories();

console.log(`Total Echoes: ${memories.length}`);
memories.forEach(mem => {
  if (mem.success) {
    console.log(`  Echo #${mem.echoId}: [${mem.sequence}] → ${mem.predictedNext}`);
  }
});

// Calculate statistics
const successCount = memories.filter(m => m.success).length;
const failureCount = memories.filter(m => !m.success).length;

console.log(`\nStatistics:`);
console.log(`  Successful: ${successCount}`);
console.log(`  Failed: ${failureCount}`);
console.log(`  Success Rate: ${((successCount / memories.length) * 100).toFixed(1)}%\n`);

// ===========================================================================
// EXAMPLE 6: Working with Different Number Types
// ===========================================================================
console.log('═══════════════════════════════════════════════════════════════');
console.log('EXAMPLE 6: Working with Different Number Types');
console.log('═══════════════════════════════════════════════════════════════\n');

const chamber6 = new EchoChamber();

const numberTypes = [
  { name: 'Integers', seq: [1, 2, 3, 4, 5] },
  { name: 'Decimals', seq: [1.5, 2.5, 3.5, 4.5] },
  { name: 'Negative Numbers', seq: [-30, -20, -10, 0] },
  { name: 'Mixed Signs', seq: [-10, 0, 10, 20] },
  { name: 'Very Large Numbers', seq: [1000000, 2000000, 3000000] }
];

numberTypes.forEach(test => {
  try {
    const result = chamber6.testSequence(test.seq);
    console.log(`✓ ${test.name.padEnd(20)}: ${result.predictedNext}`);
  } catch (error) {
    console.log(`✗ ${test.name.padEnd(20)}: ${error.message}`);
  }
});

console.log('\n');

// ===========================================================================
// EXAMPLE 7: Clearing and Resetting the Chamber
// ===========================================================================
console.log('═══════════════════════════════════════════════════════════════');
console.log('EXAMPLE 7: Clearing and Resetting the Chamber');
console.log('═══════════════════════════════════════════════════════════════\n');

const chamber7 = new EchoChamber();

// Add some echoes
chamber7.testSequence([1, 2, 3, 4]);
chamber7.testSequence([10, 20, 30]);
console.log(`Before clear: ${chamber7.getMemories().length} echoes\n`);

// Clear the chamber
chamber7.clearMemories();
console.log(`After clear: ${chamber7.getMemories().length} echoes`);
console.log(`Chamber has been reset and is ready for new tests!\n`);

// ===========================================================================
console.log('═══════════════════════════════════════════════════════════════');
console.log('All examples completed! ✨');
console.log('═══════════════════════════════════════════════════════════════\n');
