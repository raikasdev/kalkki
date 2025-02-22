import Decimal from 'decimal.js';
import { init, type GMPLib } from 'gmp-wasm';

// Allows us to chain operations and run them in one go
type Operation = 'abs' | 'acos' | 'acosh' | 'add' | 'agm' | 'ai' | 'asin' | 'asinh' | 'atan' | 'atanh' | 'beta' | 'cbrt' | 'ceil' | 'cos' | 'cosh' | 'cot' | 'coth' | 'csc' | 'csch' | 'digamma' | 'div' | 'eint' | 'erf' | 'erfc' | 'exp' | 'exp10' | 'exp2' | 'factorial' | 'floor' | 'fmod' | 'frac' | 'gamma' | 'invSqrt' | 'j0' | 'j1' | 'li2' | 'ln' | 'lngamma' | 'log10' | 'log2' | 'mul' | 'neg' | 'nextAbove' | 'nextBelow' | 'pow' | 'remainder' | 'round' | 'roundEven' | 'sec' | 'sech' | 'sin' | 'sinh' | 'sqrt' | 'sub' | 'tan' | 'tanh' | 'trunc' | 'y0' | 'y1' | 'zeta';

type OperationNum = LargeNumber | LargeNumberOperation;
type NumberOperation = {
    type: Operation;
    value?: OperationNum;
}

/**
 * Wrapper for math operations
 */
export class LargeNumberOperation {
    private operations: NumberOperation[] = [];
    private value: LargeNumber;

    constructor(num: LargeNumber) {
        this.value = num;
    }

    private op(type: Operation, value?: OperationNum) {
        this.operations.push({
            type,
            value,
        });
        return this;
    }

    add(v: OperationNum): LargeNumberOperation { return this.op("add", v); }
    agm(v: OperationNum): LargeNumberOperation { return this.op("agm", v); }
    beta(v: OperationNum): LargeNumberOperation { return this.op("beta", v); }
    div(v: OperationNum): LargeNumberOperation { return this.op("div", v); }
    fmod(v: OperationNum): LargeNumberOperation { return this.op("fmod", v); }
    mul(v: OperationNum): LargeNumberOperation { return this.op("mul", v); }
    pow(v: OperationNum): LargeNumberOperation { return this.op("pow", v); }
    remainder(v: OperationNum): LargeNumberOperation { return this.op("remainder", v); }
    sub(v: OperationNum): LargeNumberOperation { return this.op("sub", v); }
    abs(): LargeNumberOperation { return this.op("abs"); }
    acos(): LargeNumberOperation { return this.op("acos"); }
    acosh(): LargeNumberOperation { return this.op("acosh"); }
    ai(): LargeNumberOperation { return this.op("ai"); }
    asin(): LargeNumberOperation { return this.op("asin"); }
    asinh(): LargeNumberOperation { return this.op("asinh"); }
    atan(): LargeNumberOperation { return this.op("atan"); }
    atanh(): LargeNumberOperation { return this.op("atanh"); }
    cbrt(): LargeNumberOperation { return this.op("cbrt"); }
    ceil(): LargeNumberOperation { return this.op("ceil"); }
    cos(): LargeNumberOperation { return this.op("cos"); }
    cosh(): LargeNumberOperation { return this.op("cosh"); }
    cot(): LargeNumberOperation { return this.op("cot"); }
    coth(): LargeNumberOperation { return this.op("coth"); }
    csc(): LargeNumberOperation { return this.op("csc"); }
    csch(): LargeNumberOperation { return this.op("csch"); }
    digamma(): LargeNumberOperation { return this.op("digamma"); }
    eint(): LargeNumberOperation { return this.op("eint"); }
    erf(): LargeNumberOperation { return this.op("erf"); }
    erfc(): LargeNumberOperation { return this.op("erfc"); }
    exp(): LargeNumberOperation { return this.op("exp"); }
    exp10(): LargeNumberOperation { return this.op("exp10"); }
    exp2(): LargeNumberOperation { return this.op("exp2"); }
    factorial(): LargeNumberOperation { return this.op("factorial"); }
    floor(): LargeNumberOperation { return this.op("floor"); }
    frac(): LargeNumberOperation { return this.op("frac"); }
    gamma(): LargeNumberOperation { return this.op("gamma"); }
    invSqrt(): LargeNumberOperation { return this.op("invSqrt"); }
    j0(): LargeNumberOperation { return this.op("j0"); }
    j1(): LargeNumberOperation { return this.op("j1"); }
    li2(): LargeNumberOperation { return this.op("li2"); }
    ln(): LargeNumberOperation { return this.op("ln"); }
    lngamma(): LargeNumberOperation { return this.op("lngamma"); }
    log10(): LargeNumberOperation { return this.op("log10"); }
    log2(): LargeNumberOperation { return this.op("log2"); }
    neg(): LargeNumberOperation { return this.op("neg"); }
    nextAbove(): LargeNumberOperation { return this.op("nextAbove"); }
    nextBelow(): LargeNumberOperation { return this.op("nextBelow"); }
    round(): LargeNumberOperation { return this.op("round"); }
    roundEven(): LargeNumberOperation { return this.op("roundEven"); }
    sec(): LargeNumberOperation { return this.op("sec"); }
    sech(): LargeNumberOperation { return this.op("sech"); }
    sin(): LargeNumberOperation { return this.op("sin"); }
    sinh(): LargeNumberOperation { return this.op("sinh"); }
    sqrt(): LargeNumberOperation { return this.op("sqrt"); }
    tan(): LargeNumberOperation { return this.op("tan"); }
    tanh(): LargeNumberOperation { return this.op("tanh"); }
    trunc(): LargeNumberOperation { return this.op("trunc"); }
    y0(): LargeNumberOperation { return this.op("y0"); }
    y1(): LargeNumberOperation { return this.op("y1"); }
    zeta(): LargeNumberOperation { return this.op("zeta"); }

    run(precisionBits = 170): LargeNumber {
        if (LargeNumber.calculate == null) throw new Error('WASM not loaded');
        const result = LargeNumber.calculate((g) => {
            let val = g.Float(this.value.toString());
            type Float = typeof val;
            function parseValue(val: OperationNum) {
                if (val instanceof LargeNumber) {
                    return g.Float(val.toString());
                } else {
                    return g.Float(val.run().toString());
                }
            }
            for (const operation of this.operations) {
                switch (operation.type) {
                    // One param
                    case 'add':
                    case 'agm':
                    case 'beta':
                    case 'div':
                    case 'fmod':
                    case 'mul':
                    case 'remainder':
                    case 'sub':
                    case 'pow':
                        if (!operation.value) throw new Error('Invalid operation');
                        val = val[operation.type](parseValue(operation.value)) as Float;
                        break;
                    // Paramless
                    case 'abs':
                    case 'acos':
                    case 'acosh':
                    case 'ai':
                    case 'asin':
                    case 'asinh':
                    case 'atan':
                    case 'atanh':
                    case 'cbrt':
                    case 'ceil':
                    case 'cos':
                    case 'cosh':
                    case 'cot':
                    case 'coth':
                    case 'csc':
                    case 'csch':
                    case 'digamma':
                    case 'eint':
                    case 'erf':
                    case 'erfc':
                    case 'exp':
                    case 'exp10':
                    case 'exp2':
                    case 'factorial':
                    case 'floor':
                    case 'frac':
                    case 'gamma':
                    case 'invSqrt':
                    case 'j0':
                    case 'j1':
                    case 'li2':
                    case 'ln':
                    case 'lngamma':
                    case 'log10':
                    case 'log2':
                    case 'neg':
                    case 'nextAbove':
                    case 'nextBelow':
                    case 'round':
                    case 'roundEven':
                    case 'sec':
                    case 'sech':
                    case 'sin':
                    case 'sinh':
                    case 'sqrt':
                    case 'tan':
                    case 'tanh':
                    case 'trunc':
                    case 'y0':
                    case 'y1':
                    case 'zeta':
                        if (operation.value) throw new Error('Invalid operation');;
                        val = val[operation.type]() as Float;
                        break;
                    default:
                        throw new Error('Unsupported operation');
                }                
            }    
            return val;
        }, { precisionBits }) as any; // 170 = ~51 digits
        return new LargeNumber(result);
    };
}

/**
 * Wrapper for massive nums
 */
export class LargeNumber {
    public static PI: LargeNumber | LargeNumberOperation = new LargeNumber(-1).acos();
    public static E: LargeNumber | LargeNumberOperation = new LargeNumber(1).exp();
    public static RAD_DEG_RATIO: LargeNumber | LargeNumberOperation = new LargeNumber(180).div(LargeNumber.PI);
    public static TAN_PRECISION: LargeNumber | LargeNumberOperation = new LargeNumber(1).div(new LargeNumber("1000000000"));
    public static calculate: GMPLib['calculate'] | null = null;
    public static inited: boolean | Promise<void> = false;
    public static async init() {
        if (LargeNumber.inited instanceof Promise) {
            await LargeNumber.inited;
            return;
        }
        if (LargeNumber.calculate !== null) return;
        LargeNumber.inited = new Promise(async (resolve) => {
            const module = await init();
            LargeNumber.calculate = module.calculate;
            LargeNumber.PI = (LargeNumber.PI as LargeNumberOperation).run();
            LargeNumber.E = (LargeNumber.E as LargeNumberOperation).run();
            LargeNumber.RAD_DEG_RATIO = (LargeNumber.RAD_DEG_RATIO as LargeNumberOperation).run();
            LargeNumber.TAN_PRECISION = (LargeNumber.TAN_PRECISION as LargeNumberOperation).run();
            LargeNumber.inited = true;
            resolve();
        });
        return LargeNumber.inited;
    }

    private value: string;
    constructor(number: number | string = 0) {
        this.value = `${number}`; // Number is stored as string to not lose precision, and because WASM gives it as such
    }

    toString() {
        return this.value;
    }

    toSignificantDigits(digits: number) {
        const significant = new Decimal(this.value).toSignificantDigits(digits);
        // If the number has a scientific notation of exactly the bit precision (170 = 51), we should count it as zero (for example sin(pi) != 0)
        if (significant.toString().endsWith('-51')) {
            return new Decimal(0);
        }

        return significant;
    }

    // Checks
    isNaN() {
        return this.value === 'NaN';
    }

    isFinite() {
        return this.value !== 'Infinity' && this.value !== '-Infinity';
    }

    isNegative() {
        return this.value.startsWith('-');
    }

    isInteger(): boolean {
        if (LargeNumber.calculate == null) throw new Error('WASM not loaded');
        return LargeNumber.calculate((g) => g.Float(this.value.toString()).isInteger(), { precisionBits: 170 }) as any === 'true';
    }

    // Comparations
    lt(num: LargeNumber): boolean {
        if (LargeNumber.calculate == null) throw new Error('WASM not loaded');
        return LargeNumber.calculate((g) => {
            let val = g.Float(this.value.toString());
            return val.lessThan(num.toString());
        }, { precisionBits: 170 }) as any === 'true';
    }

    gt(num: LargeNumber): boolean {
        if (LargeNumber.calculate == null) throw new Error('WASM not loaded');
        return LargeNumber.calculate((g) => {
            let val = g.Float(this.value.toString());
            return val.greaterThan(num.toString());
        }, { precisionBits: 170 }) as any === 'true';
    }

    lte(num: LargeNumber): boolean {
        if (LargeNumber.calculate == null) throw new Error('WASM not loaded');
        return LargeNumber.calculate((g) => {
            let val = g.Float(this.value.toString());
            return val.lessOrEqual(num.toString());
        }, { precisionBits: 170 }) as any === 'true';
    }

    gte(num: LargeNumber): boolean {
        if (LargeNumber.calculate == null) throw new Error('WASM not loaded');
        return LargeNumber.calculate((g) => {
            let val = g.Float(this.value.toString());
            return val.greaterOrEqual(num.toString());
        }, { precisionBits: 170 }) as any === 'true';
    }

    // Arbitrary logarithm
    log(base: LargeNumber) {
        return this.op().ln().div(base.ln());
    }

    // Operations: modify value
    op(): LargeNumberOperation {
        return new LargeNumberOperation(this);
    }

    add(v: OperationNum) { return this.op().add(v); }
    agm(v: OperationNum) { return this.op().agm(v); }
    beta(v: OperationNum) { return this.op().beta(v); }
    div(v: OperationNum) { return this.op().div(v); }
    fmod(v: OperationNum) { return this.op().fmod(v); }
    mul(v: OperationNum) { return this.op().mul(v); }
    pow(v: OperationNum) { return this.op().pow(v); }
    remainder(v: OperationNum) { return this.op().remainder(v); }
    sub(v: OperationNum) { return this.op().sub(v); }
    abs() { return this.op().abs(); }
    acos() { return this.op().acos(); }
    acosh() { return this.op().acosh(); }
    ai() { return this.op().ai(); }
    asin() { return this.op().asin(); }
    asinh() { return this.op().asinh(); }
    atan() { return this.op().atan(); }
    atanh() { return this.op().atanh(); }
    cbrt() { return this.op().cbrt(); }
    ceil() { return this.op().ceil(); }
    cos() { return this.op().cos(); }
    cosh() { return this.op().cosh(); }
    cot() { return this.op().cot(); }
    coth() { return this.op().coth(); }
    csc() { return this.op().csc(); }
    csch() { return this.op().csch(); }
    digamma() { return this.op().digamma(); }
    eint() { return this.op().eint(); }
    erf() { return this.op().erf(); }
    erfc() { return this.op().erfc(); }
    exp() { return this.op().exp(); }
    exp10() { return this.op().exp10(); }
    exp2() { return this.op().exp2(); }
    factorial() { return this.op().factorial(); }
    floor() { return this.op().floor(); }
    frac() { return this.op().frac(); }
    gamma() { return this.op().gamma(); }
    invSqrt() { return this.op().invSqrt(); }
    j0() { return this.op().j0(); }
    j1() { return this.op().j1(); }
    li2() { return this.op().li2(); }
    ln() { return this.op().ln(); }
    lngamma() { return this.op().lngamma(); }
    log10() { return this.op().log10(); }
    log2() { return this.op().log2(); }
    neg() { return this.op().neg(); }
    nextAbove() { return this.op().nextAbove(); }
    nextBelow() { return this.op().nextBelow(); }
    round() { return this.op().round(); }
    roundEven() { return this.op().roundEven(); }
    sec() { return this.op().sec(); }
    sech() { return this.op().sech(); }
    sin() { return this.op().sin(); }
    sinh() { return this.op().sinh(); }
    sqrt() { return this.op().sqrt(); }
    tan() { return this.op().tan(); }
    tanh() { return this.op().tanh(); }
    trunc() { return this.op().trunc(); }
    y0() { return this.op().y0(); }
    y1() { return this.op().y1(); }
    zeta() { return this.op().zeta(); }
}
