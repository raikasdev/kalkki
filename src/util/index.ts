import { LexicalError } from "../math/internal/tokeniser";
import { EvalError, UserObject } from "../math/internal/evaluator";
import { LargeNumber } from "@/math/internal/large-number";

export type MathError = EvalError | LexicalError;
export function parseError(error: MathError) {
  if (error.type === 'UNKNOWN_TOKEN') {
    // LexicalError
    return `tuntematon symboli kohdassa ${error.idx}`;
  }

  switch (error.type) {
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
    case "PRECISION_OVERFLOW":
      return 'liian suuri numero laskettavaksi';
    case "TIMEOUT":
      return "virhe: laskuoperaatio kesti liian kauan";
    case "UNKNOWN_NAME":
      return `${error.name}: tuntematon muuttuja tai funktio`;
    case "RESERVED_NAME":
      return `${error.name} on järjestelmän varaama nimi`;
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

export function serializeUserspace(userSpace: Map<string, UserObject>) {
  const obj: Record<string, unknown> = {};

  for (const [name, value] of userSpace.entries()) {
    if (value.type === 'variable') {
      obj[name] = {
        ...value,
        value: value.value.toString(),
      };
    } else {
      obj[name] = {
        ...value,
        value: value.value.map((i) => {
          return i.type === 'litr' ? {
            ...i,
            value: i.value.toString(),
          } : i
        }),
      };
    }
  }

  return obj;
}

export function deserializeUserspace(userSpace: Record<string, any>): Map<string, UserObject> {
  const obj: Map<string, UserObject> = new Map();

  for (const [name, value] of Object.entries(userSpace)) {
    if (value.type === 'variable') {
      obj.set(name, {
        ...value,
        value: new LargeNumber(value.value),
      });
    } else {
      obj.set(name, {
        ...value,
        value: value.value.map((i: any) => {
          return i.type === 'litr' ? {
            ...i,
            value: new LargeNumber(i.value),
          } : i
        }),
      });
    }
  }

  return obj;
}