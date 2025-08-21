import { describe, it } from "node:test";
import assert from "node:assert";

import { deflate } from './index.ts';

describe('deflate non-nested single object', () => {
  it('deflate empty object', () => {
    const actual = deflate({});

    assert.deepStrictEqual(actual.headers, []);
    assert.deepStrictEqual(actual.data, []);
  });


  it('deflate string:string map', () => {
    const actual = deflate({ name: 'Tom' });

    assert.deepStrictEqual(actual.headers, [{ name: 'name', type: 'string' }]);
    assert.deepStrictEqual(actual.data, ['Tom']);
  });
});

describe('deflate non-nested homogenous object array', () => {
  it('deflate string:string map', () => {
    const actual = deflate([{ name: 'Tom' }]);

    assert.deepStrictEqual(actual.headers, [{ name: 'name', type: 'string' }]);
    assert.deepStrictEqual(actual.data, ['Tom']);
  });

  it('deflate string:string maps', () => {
    const actual = deflate([{ name: 'Tom' }, { name: 'Jerry' }]);

    assert.deepStrictEqual(actual.headers, [{ name: 'name', type: 'string' }]);
    assert.deepStrictEqual(actual.data, ['Tom', 'Jerry']);
  });

  it('deflate multiple keyed string:string maps', () => {
    const actual = deflate([{ name: 'Tom', color: 'blue' }, { name: 'Jerry', color: 'orange' }]);

    assert.deepStrictEqual(actual.headers, [
      { name: 'name', type: 'string' },
      { name: 'color', type: 'string' },
    ]);
    assert.deepStrictEqual(actual.data, ['Tom', 'blue', 'Jerry', 'orange']);
  });
});

