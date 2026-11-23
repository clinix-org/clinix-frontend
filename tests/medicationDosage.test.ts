import assert from 'node:assert/strict';
import test from 'node:test';
import { parseMedicationDosage } from '../src/utils/medicationDosage.ts';

for (const [input, expected] of [
  ['500', 500], ['500.0', 500], ['000500.000000', 500],
  ['0.000001', 0.000001], ['.25', 0.25], ['25.', 25],
  [' 0.125000 ', 0.125], ['999999999999', 999999999999],
  ['123456789012.125', 123456789012.125],
] as const) {
  test(`preserves the JSON decimal for ${input}`, () => {
    const value = parseMedicationDosage(input);
    assert.equal(value, expected);
    assert.equal(JSON.parse(JSON.stringify(value)), expected);
  });
}

for (const input of ['123456789012.123456', '999999999999.999999']) {
  test(`rejects silent rounding of ${input}`, () => {
    assert.throws(() => parseMedicationDosage(input), /perderia precisão/);
  });
}

for (const input of ['', ' ', 'abc', 'NaN', 'Infinity', '1e-6', '0,25', '-1',
  '0', '0.000000', '0.0000001', '1000000000000']) {
  test(`rejects invalid dosage ${JSON.stringify(input)}`, () => {
    assert.throws(() => parseMedicationDosage(input));
  });
}
