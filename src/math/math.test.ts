import { test, describe, expect } from 'bun:test';
import evaluate, { replaceDecimalComma } from '.';

const commaSeparatorValues = {
  "105.5": "105.5",
  "105,5": "105.5",
  "55,55,55": "55,55,55",
  "10;5,5;5.2;9,2,1;6,1": "10;5.5;5.2;9,2,1;6.1",
  "5,167": "5.167",
  "A[2:4, 1]": "A[2:4, 1]"
}

describe('Decimal separator comma', () => {
  for (const [val, exp] of Object.entries(commaSeparatorValues)) {
    test(val, () => {
      expect(replaceDecimalComma(val)).toBe(exp);
    });
  }
});


const roundOffValues = {
  "0.2 + 0.1": "0.3",
  "1 / 3 * 3": "1",
}
describe('Round-off', () => {
  for (const [val, exp] of Object.entries(roundOffValues)) {
    test(val, () => {
      expect(evaluate(val)).toBe(exp);
    });
  }
});
