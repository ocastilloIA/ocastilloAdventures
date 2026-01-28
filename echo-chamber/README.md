# Echo Chamber - Magical Number Sequence Prediction Puzzle

## 🔮 Overview

The Echo Chamber is an interactive Node.js application that solves the legendary puzzle of predicting the next number in magical arithmetic progressions. The application demonstrates core concepts of:

- **Arithmetic Progressions**: Sequences where consecutive numbers have a constant difference
- **Pattern Recognition**: Identifying mathematical patterns in numerical sequences
- **Input Validation**: Ensuring data integrity through comprehensive error handling
- **Memory Management**: Storing and retrieving all tested sequences

## 📋 Features

### Core Functionality
- ✅ **Sequence Prediction**: Calculates the next number in arithmetic progressions
- ✅ **Validation System**: Verifies sequences are valid arithmetic progressions
- ✅ **Memory Storage**: Records all tested sequences with results
- ✅ **Error Handling**: Comprehensive edge case and error handling

### Enhanced Features
- 🎨 **Story-Driven Interface**: Fantasy-themed presentation with engaging narrative
- 📊 **Memory Tracking**: Records each echo with timestamp and results
- 🧪 **Comprehensive Test Suite**: 7 different test scenarios included
- 📈 **Performance Statistics**: Calculates success rates and reports

## 🚀 Quick Start

### Prerequisites
- Node.js installed (version 12 or higher)
- Terminal/Command prompt access

### Installation & Running

```bash
# Navigate to the echo-chamber directory
cd echo-chamber

# Run the application
node index.js
```

## 📚 Usage Examples

### Using as a Module

```javascript
const EchoChamber = require('./index.js');

// Create a new chamber instance
const chamber = new EchoChamber();

// Test a sequence
try {
  const result = chamber.testSequence([3, 6, 9, 12]);
  console.log(`Next number: ${result.predictedNext}`); // Output: 15
} catch (error) {
  console.error(`Error: ${error.message}`);
}

// Get all memories
const memories = chamber.getMemories();
console.log(`Total echoes tested: ${memories.length}`);

// Clear memories
chamber.clearMemories();
```

### Direct Prediction Without Memory

```javascript
const EchoChamber = require('./index.js');
const chamber = new EchoChamber();

// Predict next number directly
const result = chamber.predictNextNumber([100, 150, 200, 250]);
console.log(`Next number: ${result.nextNumber}`); // Output: 300
```

## 🧪 Test Coverage

The application includes 7 comprehensive test scenarios:

| Test | Sequence | Expected Result | Purpose |
|------|----------|-----------------|---------|
| Test 1 | [3, 6, 9, 12] | 15 | Basic positive progression |
| Test 2 | [10, 7, 4, 1] | -2 | Negative progression |
| Test 3 | [100, 150, 200, 250] | 300 | Large step sizes |
| Test 4 | [5, 5, 5, 5] | 5 | Zero difference |
| Test 5 | [1, 2, 4, 8] | Error | Invalid progression detection |
| Test 6 | [7, 14] | 21 | Minimum sequence length |
| Test 7 | 'not an array' | Error | Type validation |

## 🔧 API Reference

### EchoChamber Class

#### Constructor
```javascript
const chamber = new EchoChamber();
```

#### Methods

##### validateSequence(sequence)
Validates if a sequence is a valid arithmetic progression.

**Parameters:**
- `sequence` (number[]): Array of numbers to validate

**Returns:**
- `object`: `{ isValid: boolean, difference: number, error: string }`

**Example:**
```javascript
const validation = chamber.validateSequence([3, 6, 9]);
// Returns: { isValid: true, difference: 3, error: null }
```

---

##### predictNextNumber(sequence)
Predicts the next number in an arithmetic progression.

**Parameters:**
- `sequence` (number[]): Array of numbers

**Returns:**
- `object`: `{ nextNumber: number, sequence: number[], commonDifference: number }`

**Throws:**
- `Error`: If sequence is not a valid arithmetic progression

**Example:**
```javascript
const result = chamber.predictNextNumber([3, 6, 9, 12]);
// Returns: { nextNumber: 15, sequence: [3, 6, 9, 12], commonDifference: 3 }
```

---

##### testSequence(sequence)
Tests a sequence and stores the result in memory.

**Parameters:**
- `sequence` (number[]): Array of numbers to test

**Returns:**
- `object`: Memory object with echo ID, sequence, prediction, and timestamp

**Throws:**
- `Error`: If sequence validation fails

**Example:**
```javascript
const memory = chamber.testSequence([10, 20, 30]);
// Returns: {
//   echoId: 1,
//   sequence: [10, 20, 30],
//   commonDifference: 10,
//   predictedNext: 40,
//   timestamp: "2:35:30 PM",
//   success: true
// }
```

---

##### getMemories()
Retrieves all stored memories from the chamber.

**Returns:**
- `object[]`: Array of all memory records

**Example:**
```javascript
const memories = chamber.getMemories();
console.log(`Total tests: ${memories.length}`);
```

---

##### clearMemories()
Clears all memories and resets the chamber.

**Returns:**
- `void`

**Example:**
```javascript
chamber.clearMemories();
```

## 🎯 Mathematical Concepts

### Arithmetic Progression
An arithmetic progression is a sequence where each term after the first is obtained by adding a constant difference (d) to the preceding term.

**Formula:**
```
a(n) = a(1) + (n-1) × d
```

Where:
- `a(n)` = the nth term
- `a(1)` = the first term
- `d` = common difference
- `n` = term number

**Next Element Formula:**
```
next = last + d
```

### Examples

**Example 1: Increasing by 3**
- Sequence: [3, 6, 9, 12]
- Common Difference: 3
- Next: 12 + 3 = **15**

**Example 2: Decreasing by 3**
- Sequence: [10, 7, 4, 1]
- Common Difference: -3
- Next: 1 + (-3) = **-2**

**Example 3: No Change**
- Sequence: [5, 5, 5, 5]
- Common Difference: 0
- Next: 5 + 0 = **5**

## ⚠️ Error Handling

The application handles the following error cases:

### Invalid Input Type
```javascript
chamber.testSequence("not an array");
// Error: Input must be an array of numbers
```

### Insufficient Elements
```javascript
chamber.testSequence([5]);
// Error: Sequence must contain at least 2 numbers
```

### Non-Numeric Values
```javascript
chamber.testSequence([1, "two", 3]);
// Error: All elements must be valid numbers
```

### Invalid Progression
```javascript
chamber.testSequence([1, 2, 4, 8]);
// Error: Not an arithmetic progression. Expected difference of 1, but found 2 between positions 1 and 2
```

## 📊 Output Example

When you run `node index.js`, you'll see:

1. **Story Introduction**: Fantasy-themed context for the puzzle
2. **Test Results**: Individual test outcomes with detailed explanations
3. **Chamber Memories**: Complete history of all tested sequences
4. **Summary Statistics**: Success rate and echo count

## 🛠️ Customization

### Creating Your Own Test Suite

```javascript
const EchoChamber = require('./index.js');

const chamber = new EchoChamber();

// Define custom test sequences
const customTests = [
  [2, 4, 6, 8],
  [-5, -10, -15, -20],
  [1000, 2000, 3000],
];

customTests.forEach(test => {
  try {
    const result = chamber.testSequence(test);
    console.log(`✓ ${test} → ${result.predictedNext}`);
  } catch (error) {
    console.log(`✗ ${test} → Error: ${error.message}`);
  }
});

// Review all memories
console.log(chamber.getMemories());
```

## 📝 Code Structure

- **Story Section**: Fantasy narrative and context
- **EchoChamber Class**: Core logic and algorithm implementation
- **Validation Methods**: Input validation and error checking
- **Prediction Methods**: Mathematical computation and prediction
- **Memory Management**: Recording and retrieval of test results
- **Console Interface**: User-friendly display and formatting
- **Test Suite**: Comprehensive testing with 7 scenarios
- **Export & Execution**: Module export and main execution logic

## 💡 Learning Outcomes

After working with this application, you'll understand:

- How to identify arithmetic progressions
- Algorithm design for sequence prediction
- Input validation strategies
- Error handling best practices
- Object-oriented programming with JavaScript classes
- Test-driven development concepts
- Memory and state management

## 🎭 Fantasy Theme

The Echo Chamber is presented as a magical puzzle room where:
- Each sequence is an "echo" that resonates through the chamber
- The common difference is the "rhythm" of the echoes
- Testing sequences creates "memories" stored in the magical room
- Your task is to understand the pattern and predict what comes next

## 📄 License

This project is part of the CopilotAdventures educational repository.

## 🤝 Contributing

To extend this project:

1. Add new validation rules
2. Implement additional sequence types (geometric progressions, Fibonacci, etc.)
3. Create an interactive CLI for testing custom sequences
4. Build a web interface for the Echo Chamber
5. Add visualization of sequence patterns

## ❓ Frequently Asked Questions

**Q: What's the minimum sequence length?**
A: The minimum is 2 numbers. With just 2 numbers, we can determine the common difference.

**Q: Can the sequence have negative numbers?**
A: Yes! Negative numbers, zero, and any real numbers are supported.

**Q: What if all numbers are the same?**
A: That's a valid arithmetic progression with a common difference of 0. The next number will also be the same.

**Q: Can I use floating-point numbers?**
A: Yes, the application supports floating-point numbers like [1.5, 3.5, 5.5].

**Q: How many sequences can the chamber remember?**
A: There's no hard limit - it depends on your system's available memory.

---

**Enjoy exploring the Echo Chamber! May your predictions be accurate and your patterns clear!** ✨🔮
