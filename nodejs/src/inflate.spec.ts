import { describe, it } from "node:test";
import assert from "node:assert";

import { readin } from './inflate.js';
import type { Schema } from "./types.js";

describe('readin non-nested structure', () => {
  it('should restore single array', () => {
    const metalist = [{ name: 'name', type: 'string' }];
    const schema = <Schema>{ root: metalist };
    const refHead = <[number]>[0];
    const data = ['Tom'];
    const actual = readin(metalist, schema, refHead, data);

    assert.deepStrictEqual(actual, { name: 'Tom' });
    assert.strictEqual(refHead[0], 1);
  });
});
