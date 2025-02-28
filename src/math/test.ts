import evaluate from './internal/evaluator';
import { LargeNumber } from './internal/large-number';
import tokens from './internal/tokeniser';

await LargeNumber.init();
function test(input: string) {
    console.log(input)
    const res = tokens(input);

    if (res.isErr()) {
        console.log(res.error);
        console.log(input.substring(res.error.idx));
    } else {
        const val = evaluate(res.value, new LargeNumber(0), new LargeNumber(0), "deg");
        console.log(res.value.map((i) => JSON.stringify(i)).join("\n"));
        if (val.isErr()) {
            console.log(val.error);
        } else {
            console.log('Success', val.value.toString())
        }
    }
}

test('5 × π')
