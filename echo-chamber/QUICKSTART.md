# 🚀 Quick Start Guide - Echo Chamber v2.0

## ⚡ 30-Second Setup

```bash
cd /workspaces/ocastilloAdventures/echo-chamber
npm run web-advanced
# → Open http://localhost:3000 ✨
```

## 🎯 First Steps

### 1. Try a Simple Pattern
1. Go to **Analyzer Tab**
2. Enter: `2, 4, 6, 8`
3. Click **Analyze**
4. See: "Arithmetic progression with next number: **10**"

### 2. Try More Complex Patterns
- **Geometric**: `2, 6, 18, 54` → Next: 162
- **Fibonacci**: `1, 1, 2, 3, 5` → Next: 8
- **Quadratic**: `1, 4, 9, 16` → Next: 25

### 3. Explore Features
- **Gallery Tab**: View all tested sequences
- **Analytics Tab**: See statistics and charts
- **Settings Tab**: Customize preferences

## 📚 What Can It Detect?

| Pattern | Example | Next | Confidence |
|---------|---------|------|-----------|
| **Arithmetic** | 2, 4, 6, 8 | 10 | 100% |
| **Geometric** | 2, 6, 18, 54 | 162 | 100% |
| **Fibonacci** | 1, 1, 2, 3, 5 | 8 | 100% |
| **Quadratic** | 1, 4, 9, 16 | 25 | 95% |
| **Polynomial** | 1, 8, 27, 64 | 125 | 95% |

## 🔗 Key URLs

| Purpose | URL |
|---------|-----|
| Web Interface | http://localhost:3000 |
| API Health | http://localhost:3000/api/health |
| Get Stats | http://localhost:3000/api/stats |
| Export Data | http://localhost:3000/api/export |

## 💡 Tips & Tricks

### Batch Testing
1. Go to Analyzer tab
2. Click "Batch Testing"
3. Enter multiple sequences (one per line)
4. Click "Test Batch"

Example:
```
2, 4, 6, 8
1, 1, 2, 3, 5
100, 50, 25, 12.5
```

### Export Your Data
1. Go to Analytics tab
2. Click "Export JSON" or "Export CSV"
3. File downloads automatically

### Filter Memories
1. Go to Gallery tab
2. Select pattern type from dropdown
3. View only that type of sequences

## 🧪 Run Tests

```bash
# Full test suite (29 tests)
npm test
# Expected: 28 passing ✅

# Basic tests
npm test:basic
```

## 📊 API Examples

### Test a Sequence
```bash
curl -X POST http://localhost:3000/api/test \
  -H "Content-Type: application/json" \
  -d '{"sequence": [2, 4, 6, 8]}'
```

### Get Statistics
```bash
curl http://localhost:3000/api/stats
```

### Get Pattern Distribution
```bash
curl http://localhost:3000/api/visualization/pattern-distribution
```

## ⚙️ Server Scripts

```bash
# Advanced server (recommended)
npm run web-advanced

# Original server
npm run web

# Development mode
npm run dev

# Test suite
npm test

# Help
npm run --help
```

## 🎨 Customize Settings

In the **Settings Tab**:
- ✓ Auto-visualize sequences
- ✓ Show mathematical formulas
- ✓ Group memories by type
- ✓ Enable dark mode
- ✓ Enable animations

## 🔍 Keyboard Shortcuts

- **Enter**: Analyze current sequence
- **Ctrl+Enter**: Test batch sequences
- **Escape**: Clear input

## 💻 Browser Requirements

- Chrome/Chromium (recommended)
- Firefox
- Safari
- Edge

Works best on modern browsers with ES6+ support.

## 🆘 Troubleshooting

### Port Already in Use
```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9

# Then restart
npm run web-advanced
```

### Charts Not Showing
- Refresh the page (Ctrl+R or Cmd+R)
- Check browser console (F12)
- Ensure JavaScript is enabled

### Sequences Not Saving
- Check browser storage (Settings)
- Clear browser cache
- Restart server

## 📖 Learn More

For comprehensive documentation:
- `DOCUMENTATION-ADVANCED.md` - Full API docs
- `README-ADVANCED.md` - Feature overview
- `ENHANCEMENT-SUMMARY.md` - What's new in v2.0

## 🎓 Example Workflows

### Workflow 1: Understanding Patterns
1. Analyzer Tab → Enter `2, 4, 6, 8`
2. See detection: Arithmetic
3. See formula: `a(n) = 2 + (n-1) × 2`
4. See visualization
5. Repeat with other patterns

### Workflow 2: Batch Analysis
1. Analyzer Tab → Batch Testing
2. Enter multiple sequences
3. Click "Test Batch"
4. Go to Gallery Tab
5. View all tested sequences
6. Check Analytics for trends

### Workflow 3: Export Results
1. Test several sequences
2. Go to Analytics Tab
3. Review statistics
4. Click "Export JSON" or "Export CSV"
5. Analyze exported data

## 🌟 Cool Features

- **Real-time Charts**: Watch visualizations update
- **Pattern Recognition**: 5 different math patterns
- **Batch Processing**: Test 100+ sequences at once
- **Smart Caching**: Instant results for repeated patterns
- **Responsive UI**: Works on phone, tablet, desktop
- **Export Options**: JSON, CSV, or statistics

## 🚀 Next Steps

1. ✅ Run `npm run web-advanced`
2. ✅ Open http://localhost:3000
3. ✅ Try the analyzer with example sequences
4. ✅ Explore all tabs
5. ✅ Export some data
6. ✅ Read DOCUMENTATION-ADVANCED.md for deep dive

---

**Enjoy exploring Echo Chamber v2.0! 🏰✨**

For issues or questions, check the full documentation or use Developer Tools in Settings.
