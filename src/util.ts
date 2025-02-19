import { LexicalError } from "./math/internal/tokeniser";
import { EvalErrorId } from "./math/internal/evaluator";

export type MathError = EvalErrorId | { error: LexicalError };
export function parseError(error: MathError) {
  if (typeof error === 'object' && error.error.type === 'UNKNOWN_TOKEN') {
    // LexicalError
    return `tuntematon symboli kohdassa ${error.error.idx}`;
  }

  switch (error) {
    case "INFINITY":
      return 'liian suuri tai ääretön arvo';
    case "INVALID_ARG_COUNT":
      return 'metodi sai virheellisen määrän argumentteja';
    case "NOT_A_NUMBER":
      return 'vastaus ei ole numero';
    case "NO_LHS_BRACKET":
      return 'vasen sulje puuttuu';
    case "NO_RHS_BRACKET":
      return 'oikea sulje puuttuu';
    case "TRIG_PRECISION":
      return 'trigonometrinen tarkkuusvirhe';
    case "UNEXPECTED_EOF":
      return 'odottamaton lausekkeen loppu';
    case "UNEXPECTED_TOKEN":
      return 'odottamaton symboli';
  }

  console.error('Unhandled error!', error);
  return 'käsittelyvirhe';
}

/**
 * Tries to get the function user is currently typing
 * @returns {string | null} Function name or null 
 */
export function getOpenFunction(expression: string): string | null {
  if (expression[expression.length - 1] !== '(') return null;

  const funcName = [];
  for (let i = expression.length - 2; i >= 0; i--) {
    const char = expression[i];
    if (!/[a-z]/.test(char)) {
      if (funcName.length === 0) return null;
      else return funcName.reverse().join("");
    }

    funcName.push(char);
  }

  return funcName.length === 0 ? null : funcName.reverse().join("");
}
