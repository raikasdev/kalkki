import { calculate } from '@/math/index';
import { LargeNumber } from '@/math/internal/large-number';

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
  const [exp, ans, ind, deg] = req.data;
  await LargeNumber.init();

  self.postMessage(JSON.stringify({
    id: req.id,
    ...calculate(exp, new LargeNumber(ans), new LargeNumber(ind), deg)
  }));
}