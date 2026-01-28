/**
 * Echo Chamber - A Magical Number Sequence Prediction Puzzle
 * 
 * This application solves the legendary Echo Chamber puzzle where you must predict
 * the next number in magical arithmetic progressions. The room remembers every echo
 * (sequence) that has been tested, and you must understand the pattern of the numbers
 * to predict what comes next.
 * 
 * Usage: node index.js
 */

// ============================================================================
// ECHO CHAMBER STORY & CONTEXT
// ============================================================================

const STORY = `
╔════════════════════════════════════════════════════════════════════════════╗
║                   🔮 THE CHAMBER OF ECHOES 🔮                              ║
║                                                                            ║
║  You enter a mystical chamber where magical numbers resonate through       ║
║  the air. Each number is an echo of the one before it, following a        ║
║  hidden pattern that repeats infinitely.                                   ║
║                                                                            ║
║  Your task: Understand the pattern and predict the next echo!             ║
║                                                                            ║
║  The chamber will test your ability to recognize arithmetic progressions. ║
║  Can you hear the rhythm of the numbers?                                   ║
╚════════════════════════════════════════════════════════════════════════════╝
`;

// ============================================================================
// ECHO CHAMBER SEQUENCE PREDICTOR
// ============================================================================

class EchoChamber {
  /**
   * Initialize the Echo Chamber with memory storage
   */
  constructor() {
    // Store the memories (echoes) of all sequences tested
    this.memories = [];
    this.testCount = 0;
  }

  /**
   * Validate that a sequence is a valid arithmetic progression
   * An arithmetic progression has a constant difference between consecutive numbers
   * 
   * @param {number[]} sequence - The sequence to validate
   * @returns {object} { isValid: boolean, difference: number, error: string }
   */
  validateSequence(sequence) {
    // Check if sequence exists and has minimum length
    if (!Array.isArray(sequence)) {
      return { isValid: false, difference: null, error: 'Input must be an array of numbers' };
    }

    if (sequence.length < 2) {
      return { isValid: false, difference: null, error: 'Sequence must contain at least 2 numbers' };
    }

    // Validate all elements are numbers
    if (!sequence.every(num => typeof num === 'number' && !isNaN(num))) {
      return { isValid: false, difference: null, error: 'All elements must be valid numbers' };
    }

    // Calculate the difference between first two numbers
    const firstDifference = sequence[1] - sequence[0];

    // Verify all consecutive differences are the same
    for (let i = 2; i < sequence.length; i++) {
      const currentDifference = sequence[i] - sequence[i - 1];
      if (currentDifference !== firstDifference) {
        return {
          isValid: false,
          difference: null,
          error: `Not an arithmetic progression. Expected difference of ${firstDifference}, but found ${currentDifference} between positions ${i - 1} and ${i}`
        };
      }
    }

    return { isValid: true, difference: firstDifference, error: null };
  }

  /**
   * Predict the next number in an arithmetic progression
   * 
   * @param {number[]} sequence - The arithmetic progression
   * @returns {object} { nextNumber: number, sequence: number[] }
   */
  predictNextNumber(sequence) {
    const validation = this.validateSequence(sequence);

    if (!validation.isValid) {
      throw new Error(`Invalid sequence: ${validation.error}`);
    }

    // The next number is: last number + common difference
    const nextNumber = sequence[sequence.length - 1] + validation.difference;
    return {
      nextNumber,
      sequence,
      commonDifference: validation.difference
    };
  }

  /**
   * Test a sequence and store the result in memory
   * 
   * @param {number[]} sequence - The sequence to test
   * @returns {object} Result object with prediction and memory info
   */
  testSequence(sequence) {
    this.testCount++;

    try {
      const result = this.predictNextNumber(sequence);
      const memory = {
        echoId: this.testCount,
        sequence: result.sequence,
        commonDifference: result.commonDifference,
        predictedNext: result.nextNumber,
        timestamp: new Date().toLocaleTimeString(),
        success: true
      };

      this.memories.push(memory);
      return memory;
    } catch (error) {
      const failedMemory = {
        echoId: this.testCount,
        sequence,
        error: error.message,
        timestamp: new Date().toLocaleTimeString(),
        success: false
      };

      this.memories.push(failedMemory);
      throw error;
    }
  }

  /**
   * Get all memories stored in the chamber
   * @returns {object[]} Array of all memories
   */
  getMemories() {
    return this.memories;
  }

  /**
   * Clear all memories from the chamber
   */
  clearMemories() {
    this.memories = [];
    this.testCount = 0;
  }
}

// ============================================================================
// CONSOLE INTERFACE & TESTING
// ============================================================================

/**
 * Format a memory record for console display
 */
function formatMemory(memory) {
  const sequenceDisplay = Array.isArray(memory.sequence) 
    ? `[${memory.sequence.join(', ')}]`
    : `${JSON.stringify(memory.sequence)}`;
    
  if (memory.success) {
    return `
  ✓ Echo #${memory.echoId} [${memory.timestamp}]
    Sequence: ${sequenceDisplay}
    Common Difference: ${memory.commonDifference}
    Predicted Next: ${memory.predictedNext}`;
  } else {
    return `
  ✗ Echo #${memory.echoId} [${memory.timestamp}]
    Sequence: ${sequenceDisplay}
    Error: ${memory.error}`;
  }
}

/**
 * Main function to demonstrate the Echo Chamber
 */
async function main() {
  // Display the story
  console.log(STORY);
  console.log('\n');

  // Create the Echo Chamber
  const chamber = new EchoChamber();

  // ========================================================================
  // TEST SUITE
  // ========================================================================

  console.log('═══════════════════════════════════════════════════════════════════════════════');
  console.log('TEST 1: The Primary Echo - [3, 6, 9, 12]');
  console.log('═══════════════════════════════════════════════════════════════════════════════\n');

  try {
    const test1Result = chamber.testSequence([3, 6, 9, 12]);
    console.log(`✓ SUCCESS: The next echo is ${test1Result.predictedNext}`);
    console.log(`  Pattern: Each number increases by ${test1Result.commonDifference}\n`);
  } catch (error) {
    console.log(`✗ FAILED: ${error.message}\n`);
  }

  // ========================================================================

  console.log('═══════════════════════════════════════════════════════════════════════════════');
  console.log('TEST 2: Negative Progression - [10, 7, 4, 1]');
  console.log('═══════════════════════════════════════════════════════════════════════════════\n');

  try {
    const test2Result = chamber.testSequence([10, 7, 4, 1]);
    console.log(`✓ SUCCESS: The next echo is ${test2Result.predictedNext}`);
    console.log(`  Pattern: Each number decreases by ${Math.abs(test2Result.commonDifference)}\n`);
  } catch (error) {
    console.log(`✗ FAILED: ${error.message}\n`);
  }

  // ========================================================================

  console.log('═══════════════════════════════════════════════════════════════════════════════');
  console.log('TEST 3: Large Steps - [100, 150, 200, 250]');
  console.log('═══════════════════════════════════════════════════════════════════════════════\n');

  try {
    const test3Result = chamber.testSequence([100, 150, 200, 250]);
    console.log(`✓ SUCCESS: The next echo is ${test3Result.predictedNext}`);
    console.log(`  Pattern: Each number increases by ${test3Result.commonDifference}\n`);
  } catch (error) {
    console.log(`✗ FAILED: ${error.message}\n`);
  }

  // ========================================================================

  console.log('═══════════════════════════════════════════════════════════════════════════════');
  console.log('TEST 4: Zero Difference - [5, 5, 5, 5]');
  console.log('═══════════════════════════════════════════════════════════════════════════════\n');

  try {
    const test4Result = chamber.testSequence([5, 5, 5, 5]);
    console.log(`✓ SUCCESS: The next echo is ${test4Result.predictedNext}`);
    console.log(`  Pattern: All numbers are the same (difference of ${test4Result.commonDifference})\n`);
  } catch (error) {
    console.log(`✗ FAILED: ${error.message}\n`);
  }

  // ========================================================================

  console.log('═══════════════════════════════════════════════════════════════════════════════');
  console.log('TEST 5: Invalid Sequence - [1, 2, 4, 8] (NOT arithmetic progression)');
  console.log('═══════════════════════════════════════════════════════════════════════════════\n');

  try {
    const test5Result = chamber.testSequence([1, 2, 4, 8]);
    console.log(`✓ SUCCESS: The next echo is ${test5Result.predictedNext}`);
    console.log(`  Pattern: Each number increases by ${test5Result.commonDifference}\n`);
  } catch (error) {
    console.log(`✗ EXPECTED ERROR CAUGHT: ${error.message}\n`);
    console.log('  This sequence is actually a geometric progression, not arithmetic!\n');
  }

  // ========================================================================

  console.log('═══════════════════════════════════════════════════════════════════════════════');
  console.log('TEST 6: Edge Case - Only Two Numbers [7, 14]');
  console.log('═══════════════════════════════════════════════════════════════════════════════\n');

  try {
    const test6Result = chamber.testSequence([7, 14]);
    console.log(`✓ SUCCESS: The next echo is ${test6Result.predictedNext}`);
    console.log(`  Pattern: Each number increases by ${test6Result.commonDifference}\n`);
  } catch (error) {
    console.log(`✗ FAILED: ${error.message}\n`);
  }

  // ========================================================================

  console.log('═══════════════════════════════════════════════════════════════════════════════');
  console.log('TEST 7: Invalid Input - Not an Array');
  console.log('═══════════════════════════════════════════════════════════════════════════════\n');

  try {
    const test7Result = chamber.testSequence('not an array');
    console.log(`✓ SUCCESS: The next echo is ${test7Result.predictedNext}\n`);
  } catch (error) {
    console.log(`✗ EXPECTED ERROR CAUGHT: ${error.message}\n`);
    console.log('  Input validation is working correctly!\n');
  }

  // ========================================================================

  console.log('═══════════════════════════════════════════════════════════════════════════════');
  console.log('CHAMBER MEMORIES - All Echoes Recorded');
  console.log('═══════════════════════════════════════════════════════════════════════════════\n');

  const memories = chamber.getMemories();
  console.log(`Total echoes tested: ${memories.length}\n`);

  memories.forEach(memory => {
    console.log(formatMemory(memory));
  });

  console.log('\n\n');
  console.log('═══════════════════════════════════════════════════════════════════════════════');
  console.log('✨ ECHO CHAMBER TEST SUITE COMPLETED ✨');
  console.log('═══════════════════════════════════════════════════════════════════════════════\n');

  // Summary statistics
  const successfulEchoes = memories.filter(m => m.success).length;
  const failedEchoes = memories.filter(m => !m.success).length;

  console.log(`Summary:`);
  console.log(`  ✓ Successful echoes: ${successfulEchoes}`);
  console.log(`  ✗ Failed echoes: ${failedEchoes}`);
  console.log(`  📊 Success rate: ${((successfulEchoes / memories.length) * 100).toFixed(1)}%\n`);
}

// ============================================================================
// EXPORT & EXECUTION
// ============================================================================

// Export the EchoChamber class for use as a module
module.exports = EchoChamber;

// Run the test suite if this file is executed directly
if (require.main === module) {
  main().catch(console.error);
}
