import { calculate } from '@/math/index';
import { LargeNumber } from '@/math/internal/large-number';
import { deserializeUserspace, serializeUserspace } from '@/util';
import { ok } from 'neverthrow';

type Request = {
  type: 'init' | 'calculate';
  id?: string;
  data?: [string, string, string, 'deg' | 'rad'];
}

self.onmessage = async function(e) {
  const req: Request = JSON.parse(e.data);
  if (req.type === 'init') {
    await LargeNumber.init();
    return;
  }
  if (!req.data || !req.id) return;
  const [exp, ans, userSpace, deg] = req.data;
  await LargeNumber.init();

  const res = calculate(exp, new LargeNumber(ans), deserializeUserspace(JSON.parse(userSpace)), deg);
  if (res.isErr()) {
    self.postMessage(JSON.stringify({
      id: req.id,
      ...res,
    }));
  } else {
    const val: Record<string, unknown> = { value: res.value.value?.toString() };
    if (res.value.userSpace) {
      val.userSpace = JSON.stringify(serializeUserspace(res.value.userSpace));
    }
    self.postMessage(JSON.stringify({
      id: req.id,
      ...ok(val),
    }));
  }
  }