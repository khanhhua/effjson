import { describe, it } from 'node:test';
import assert from 'node:assert';

import { readin, inflate } from './inflate.js';
import type { Meta, Schema } from "./types.js";

describe('readin non-nested structure', () => {
  it('should restore singleton', () => {
    const metalist = [{ name: 'name', type: 'string', flag: 0 }];
    const schema = <Schema>{ root: metalist };
    const refHead = <[number]>[0];
    const data = ['Tom'];
    const actual = readin(metalist, schema, refHead, data);

    assert.deepStrictEqual(actual, { name: 'Tom' });
    assert.strictEqual(refHead[0], 1);
  });

  it('should restore array of two items', () => {
    const metalist = [{ name: 'name', type: 'string', flag: 0 }];
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

describe('readin non-nested primitive array', () => {
  it('should restore singleton', () => {
    const metalist = <Meta[]>[{ name: 'names', type: 'string', flag: 1 }];
    const schema = <Schema>{ root: metalist };
    const refHead = <[number]>[0];
    const data = [1, 'Tom'];
    const actual = readin(metalist, schema, refHead, data);

    assert.deepStrictEqual(actual, { names: ['Tom'] });
  });
});

describe('readin 1. degree nested structure ', () => {
  it('should restore singleton of single attribute', () => {
    const metalist = <Meta[]>[
      { name: 'name', type: 'string', flag: 0 }
    ];
    const schema = <Schema>{
      root: [{ name: 'student', type: '@student', flag: 0 }],
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
      { name: 'name', type: 'string', flag: 0 },
      { name: 'color', type: 'string', flag: 0 }
    ];
    const schema = <Schema>{
      root: [{ name: 'student', type: '@student', flag: 0 }],
      '@student': metalist
    };
    const refHead = <[number]>[0];
    const data = ['Tom', 'blue'];
    const actual = readin(schema.root, schema, refHead, data);

    assert.deepStrictEqual(actual, { student: { name: 'Tom', color: 'blue' } });
    assert.strictEqual(refHead[0], 2);
  });

  it('should restore singleton with 1 array attribute of complex structure of size 1', () => {
    const metalist = <Meta[]>[
      { name: 'name', type: 'string', flag: 0 },
      { name: 'color', type: 'string', flag: 0 }
    ];
    const schema = <Schema>{
      root: [{ name: 'students', type: '@students', flag: 1 }],
      '@students': metalist
    };
    const refHead = <[number]>[0];
    const data = [1, 'Tom', 'blue'];
    const actual = readin(schema.root, schema, refHead, data);

    assert.deepStrictEqual(actual, { students: [{ name: 'Tom', color: 'blue' }] });
    assert.strictEqual(refHead[0], 3);
  });

  it('should restore singleton with 1 array attribute of complex structure of size 2', () => {
    const metalist = <Meta[]>[
      { name: 'name', type: 'string', flag: 0 },
      { name: 'color', type: 'string', flag: 0 }
    ];
    const schema = <Schema>{
      root: [{ name: 'students', type: '@students', flag: 1 }],
      '@students': metalist
    };
    const refHead = <[number]>[0];
    const data = [2, 'Tom', 'blue', 'Jerry', 'orange'];
    const actual = readin(schema.root, schema, refHead, data);

    assert.deepStrictEqual(actual, {
      students: [
        { name: 'Tom', color: 'blue' },
        { name: 'Jerry', color: 'orange' }
      ]
    });
    assert.strictEqual(refHead[0], 5);
  });

  it('should restore singleton of multiple attributes with array of size 1', () => {
    const metalist = <Meta[]>[
      { name: 'name', type: 'string', flag: 0 },
      { name: 'colors', type: 'string', flag: 1 }
    ];
    const schema = <Schema>{
      root: [{ name: 'student', type: '@student', flag: 0 }],
      '@student': metalist
    };
    const refHead = <[number]>[0];
    const data = ['Tom', 1, 'blue'];
    const actual = readin(schema.root, schema, refHead, data);

    assert.deepStrictEqual(actual, { student: { name: 'Tom', colors: ['blue'] } });
    assert.strictEqual(refHead[0], 3);
  });

  it('should restore singleton of multiple attributes with array of size 2', () => {
    const metalist = <Meta[]>[
      { name: 'name', type: 'string', flag: 0 },
      { name: 'colors', type: 'string', flag: 1 }
    ];
    const schema = <Schema>{
      root: [{ name: 'student', type: '@student', flag: 0 }],
      '@student': metalist
    };
    const refHead = <[number]>[0];
    const data = ['Tom', 2, 'blue', 'white'];
    const actual = readin(schema.root, schema, refHead, data);

    assert.deepStrictEqual(actual, { student: { name: 'Tom', colors: ['blue', 'white'] } });
    assert.strictEqual(refHead[0], 4);
  });

  it('should restore singleton of multiple attributes with array of size 2', () => {
    const metalist = <Meta[]>[
      { name: 'name', type: 'string', flag: 0 },
      { name: 'colors', type: 'string', flag: 1 }
    ];
    const schema = <Schema>{
      root: [{ name: 'students', type: '@students', flag: 1 }],
      '@students': metalist
    };
    const refHead = <[number]>[0];
    const data = [2, 'Tom', 1, 'blue', 'Jerry', 1, 'orange'];
    const actual = readin(schema.root, schema, refHead, data);

    assert.deepStrictEqual(actual, {
      students: [
        { name: 'Tom', colors: ['blue'] },
        { name: 'Jerry', colors: ['orange'] }
      ]
    });
    assert.strictEqual(refHead[0], 7);
  });
});

describe('inflate non-nested structure', () => {
  it('should restore singleton', () => {
    const schema = <Schema>{
      root: [{ name: 'name', type: 'string', flag: 0 }]
    };
    const data = ['Tom'];
    const actual = inflate({ schema, data });

    assert.deepStrictEqual(actual, [{ name: 'Tom' }]);
  });

  it('should restore array of two items', () => {
    const schema = <Schema>{
      root: [{ name: 'name', type: 'string', flag: 0 }]
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
      root: [{ name: 'student', type: '@student', flag: 0 }],
      '@student': [{ name: 'name', type: 'string', flag: 0 }]
    };
    const data = ['Tom'];
    const actual = inflate({ schema, data });

    assert.deepStrictEqual(actual, [{ student: { name: 'Tom' } }]);
  });

  it('should restore array of two structures of single attribute', () => {
    const schema = <Schema>{
      root: [{ name: 'student', type: '@student', flag: 0 }],
      '@student': [{ name: 'name', type: 'string', flag: 0 }]
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
      root: [{ name: 'student', type: '@student', flag: 0 }],
      '@student': [{ name: 'name', type: 'string', flag: 0 }]
    };
    const data = ['Tom'];
    const actual = inflate({ schema, data });

    assert.deepStrictEqual(actual, [{ student: { name: 'Tom' } }]);
  });

  it('should restore array of two structures of multiple attributes', () => {
    const schema = <Schema>{
      root: [{ name: 'student', type: '@student', flag: 0 }],
      '@student': [
        { name: 'name', type: 'string', flag: 0 },
        { name: 'color', type: 'string', flag: 0 },
      ]
    };
    const data = ['Tom', 'blue', 'Jerry', 'orange'];
    const actual = inflate({ schema, data });

    assert.deepStrictEqual(actual, [
      { 'student': { name: 'Tom', color: 'blue' } },
      { 'student': { name: 'Jerry', color: 'orange' } },
    ]);
  });

  it('should restore structure of array of multiple complex', () => {
    const schema = <Schema>{
      root: [{ name: 'students', type: '@students', flag: 1 }],
      '@students': [
        { name: 'name', type: 'string', flag: 0 },
        { name: 'color', type: 'string', flag: 0 },
      ]
    };
    const data = [2, 'Tom', 'blue', 'Jerry', 'orange'];
    const actual = inflate({ schema, data });

    assert.deepStrictEqual(actual, [
      {
        'students': [
          { name: 'Tom', color: 'blue' },
          { name: 'Jerry', color: 'orange' }]
      }
    ]);
  });

  it('should restore structure of array of multiple complex with one attribute as array', () => {
    const schema = <Schema>{
      root: [{ name: 'students', type: '@students', flag: 1 }],
      '@students': [
        { name: 'name', type: 'string', flag: 0 },
        { name: 'colors', type: 'string', flag: 1 },
      ]
    };
    const data = [2, 'Tom', 1, 'blue', 'Jerry', 1, 'orange'];
    const actual = inflate({ schema, data });

    assert.deepStrictEqual(actual, [
      {
        'students': [
          { name: 'Tom', colors: ['blue'] },
          { name: 'Jerry', colors: ['orange'] }]
      }
    ]);
  });
});

