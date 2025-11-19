# Tests

This directory contains test suites for the P4RS3LT0NGV3 project.

## Test Files

### `test_universal.js`
Comprehensive test suite for the universal decoder and all transformers.

**What it tests:**
- Encoding/decoding round-trips for all transformers
- Universal decoder detection accuracy
- Edge cases and special characters
- Unicode and emoji handling

**Run:**
```bash
npm run test:universal
# or
npm test
```

### `test_steganography_options.js`
Test suite for steganography advanced options round-trip.

**What it tests:**
- Encoding/decoding with all advanced option combinations:
  - Bit order (MSB/LSB)
  - Variation selector mapping (VS15/VS16)
  - Initial presentation options
  - Inter-bit zero-width characters
  - Trailing zero-width characters
  - Complex combinations of all options

**Run:**
```bash
npm run test:steg
```

## Running All Tests

```bash
npm test              # Run universal decoder tests
npm run test:steg     # Run steganography tests
```

## Test Structure

Tests use Node.js `vm` module to create sandboxed environments that mirror the browser context, allowing tests to run without a browser.

## Adding New Tests

When adding new test files:
1. Place them in this `tests/` directory
2. Use `path.resolve(__dirname, '..')` to get the project root
3. Use `path.join(projectRoot, '...')` for all file paths
4. Add a corresponding npm script in `package.json`

