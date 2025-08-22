import { describe, it } from "node:test";
import assert from "node:assert";

import { readin, inflate } from './inflate.js';
import type { Meta, Schema } from "./types.js";

describe('readin non-nested structure', () => {
  it('should restore singleton', () => {
    const metalist = [{ name: 'name', type: 'string' }];
    const schema = <Schema>{ root: metalist };
    const refHead = <[number]>[0];
    const data = ['Tom'];
    const actual = readin(metalist, schema, refHead, data);

    assert.deepStrictEqual(actual, { name: 'Tom' });
    assert.strictEqual(refHead[0], 1);
  });

  it('should restore array of two items', () => {
    const metalist = [{ name: 'name', type: 'string' }];
    const schema = <Schema>{ root: metalist };
    const refHead = <[number]>[0];
    const data = ['Tom', 'Jerry'];
    const actual1 = readin(metalist, schema, refHead, data);
    const actual2 = readin(metalist, schema, refHead, data);

    assert.deepStrictEqual(actual1, { name: 'Tom' });
    assert.deepStrictEqual(actual2, { name: 'Jerry' });
    assert.strictEqual(refHead[0], 2);
  });
});

describe('readin 1. degree nested structure ', () => {
  it('should restore singleton of single attribute', () => {
    const metalist = <Meta[]>[
      { name: 'name', type: 'string' }
    ];
    const schema = <Schema>{
      root: [{ name: 'student', type: '@student' }],
      '@student': metalist
    };
    const refHead = <[number]>[0];
    const data = ['Tom'];
    const actual = readin(schema.root, schema, refHead, data);

    assert.deepStrictEqual(actual, { student: { name: 'Tom' } });
    assert.strictEqual(refHead[0], 1);
  });

  it('should restore singleton of multiple attributes', () => {
    const metalist = <Meta[]>[
      { name: 'name', type: 'string' },
      { name: 'color', type: 'string' }
    ];
    const schema = <Schema>{
      root: [{ name: 'student', type: '@student' }],
      '@student': metalist
    };
    const refHead = <[number]>[0];
    const data = ['Tom', 'blue'];
    const actual = readin(schema.root, schema, refHead, data);

    assert.deepStrictEqual(actual, { student: { name: 'Tom', color: 'blue' } });
    assert.strictEqual(refHead[0], 2);
  });
});

describe('inflate non-nested structure', () => {
  it('should restore singleton', () => {
    const schema = <Schema>{
      root: [{ name: 'name', type: 'string' }]
    };
    const data = ['Tom'];
    const actual = inflate({ schema, data });

    assert.deepStrictEqual(actual, [{ name: 'Tom' }]);
  });

  it('should restore array of two items', () => {
    const schema = <Schema>{
      root: [{ name: 'name', type: 'string' }]
    };
    const data = ['Tom', 'Jerry'];
    const actual = inflate({ schema, data });

    assert.deepStrictEqual(actual,
      [
        { name: 'Tom' },
        { name: 'Jerry' }
      ]);
  });
});

describe('inflate 1. degree nested structure of single attribute', () => {
  it('should restore singleton', () => {
    const schema = <Schema>{
      root: [{ name: 'student', type: '@student' }],
      '@student': [{ name: 'name', type: 'string' }]
    };
    const data = ['Tom'];
    const actual = inflate({ schema, data });

    assert.deepStrictEqual(actual, [{ student: { name: 'Tom' } }]);
  });

  it('should restore array of two structures of single attribute', () => {
    const schema = <Schema>{
      root: [{ name: 'student', type: '@student' }],
      '@student': [{ name: 'name', type: 'string' }]
    };
    const data = ['Tom', 'Jerry'];
    const actual = inflate({ schema, data });

    assert.deepStrictEqual(actual, [
      { 'student': { name: 'Tom' } },
      { 'student': { name: 'Jerry' } },
    ]);
  });
});

describe('inflate 1. degree nested structure of multiple attributes', () => {
  it('should restore singleton', () => {
    const schema = <Schema>{
      root: [{ name: 'student', type: '@student' }],
      '@student': [{ name: 'name', type: 'string' }]
    };
    const data = ['Tom'];
    const actual = inflate({ schema, data });

    assert.deepStrictEqual(actual, [{ student: { name: 'Tom' } }]);
  });

  it('should restore array of two structures of multiple attributes', () => {
    const schema = <Schema>{
      root: [{ name: 'student', type: '@student' }],
      '@student': [
        { name: 'name', type: 'string' },
        { name: 'color', type: 'string' },
      ]
    };
    const data = ['Tom', 'blue', 'Jerry', 'orange'];
    const actual = inflate({ schema, data });

    assert.deepStrictEqual(actual, [
      { 'student': { name: 'Tom', color: 'blue' } },
      { 'student': { name: 'Jerry', color: 'orange' } },
    ]);
  });
});
