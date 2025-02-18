import { create, all } from 'mathjs';

// BigNumber / decimal.js
const math = create(all, {
  number: 'BigNumber',
  precision: 64,
  relTol: 1e-60,
  absTol: 1e-63
});

export function replaceDecimalComma(expression: string) {
  return expression.replace(/(?<![\d,])(\d+),(\d+)(?![\d,])/g, '$1.$2');;
}

export default function evaluate(expression: string) {
  // Replace decimal separator commas. Checks before and after to avoid interfering with lists/arguments
  expression = replaceDecimalComma(expression);
  // Clean/trim it up
  expression = expression.trim();

  const res = math.evaluate(expression);
  return math.format(res, { precision: 8 });
}
