import { describe, it } from "node:test";
import assert from "node:assert";

import { deflate } from './deflate.js';

describe('deflate non-nested single object', () => {
  it('deflate empty object', () => {
    const actual = deflate({});

    assert.deepStrictEqual(actual.schema.root, []);
    assert.deepStrictEqual(actual.data, []);
  });


  it('deflate string:string map', () => {
    const actual = deflate({ name: 'Tom' });

    assert.deepStrictEqual(actual.schema.root, [{ name: 'name', type: 'string', flag: 0 }]);
    assert.deepStrictEqual(actual.data, ['Tom']);
  });

  it('deflate string:[string array of 1 element] map', () => {
    const actual = deflate({ names: ['Tom'] });
    assert.deepStrictEqual(actual.schema.root, [{ name: 'names', type: 'string', flag: 1 }]);
    assert.deepStrictEqual(actual.data, [1, 'Tom'])
  });

  it('deflate string:[string array of 2 elements] map', () => {
    const actual = deflate({ names: ['Tom', 'Jerry'] });
    assert.deepStrictEqual(actual.schema.root, [{ name: 'names', type: 'string', flag: 1 }]);
    assert.deepStrictEqual(actual.data, [2, 'Tom', 'Jerry'])
  });
});

describe('deflate non-nested homogenous object array', () => {
  it('deflate string:string map', () => {
    const actual = deflate([{ name: 'Tom' }]);

    assert.deepStrictEqual(actual.schema.root, [{ name: 'name', type: 'string', flag: 0 }]);
    assert.deepStrictEqual(actual.data, ['Tom']);
  });

  it('deflate string:[string array of 1 element] map', () => {
    const actual = deflate([{ names: ['Tom'] }]);

    assert.deepStrictEqual(actual.schema.root, [{ name: 'names', type: 'string', flag: 1 }]);
    assert.deepStrictEqual(actual.data, [1, 'Tom']);
  });

  it('deflate string:[string array of 2 elements] map', () => {
    const actual = deflate([{ names: ['Tom', 'Jerry'] }]);

    assert.deepStrictEqual(actual.schema.root, [{ name: 'names', type: 'string', flag: 1 }]);
    assert.deepStrictEqual(actual.data, [2, 'Tom', 'Jerry']);
  });

  it('deflate string:string maps', () => {
    const actual = deflate([{ name: 'Tom' }, { name: 'Jerry' }]);

    assert.deepStrictEqual(actual.schema.root, [{ name: 'name', type: 'string', flag: 0 }]);
    assert.deepStrictEqual(actual.data, ['Tom', 'Jerry']);
  });

  it('deflate multiple keyed string:string maps', () => {
    const actual = deflate([{ name: 'Tom', color: 'blue' }, { name: 'Jerry', color: 'orange' }]);

    assert.deepStrictEqual(actual.schema.root, [
      { name: 'name', type: 'string', flag: 0 },
      { name: 'color', type: 'string', flag: 0 },
    ]);
    assert.deepStrictEqual(actual.data, ['Tom', 'blue', 'Jerry', 'orange']);
  });

  it('deflate multiple keyed string:{string, [string array]} maps', () => {
    const actual = deflate([
      { name: 'Tom', colors: ['blue', 'white'] },
      { name: 'Jerry', colors: ['orange', 'black'] }
    ]);

    assert.deepStrictEqual(actual.schema.root, [
      { name: 'name', type: 'string', flag: 0 },
      { name: 'colors', type: 'string', flag: 1 },
    ]);
    assert.deepStrictEqual(actual.data, ['Tom', 2, 'blue', 'white', 'Jerry', 2, 'orange', 'black']);
  });
});

describe('deflate 1st degree nested homogenous object', () => {
  it('deflate string:[string:string] map', () => {
    const actual = deflate({ student: { name: 'Tom' } });

    assert.deepStrictEqual(actual.schema.root, [{
      name: 'student',
      type: '@student',
      flag: 0
    }]);
    assert.deepStrictEqual(actual.schema['@student'], [{
      name: 'name',
      type: 'string',
      flag: 0
    }]);
    assert.deepStrictEqual(actual.data, ['Tom']);
  });

  it('deflate string:[string:string; string:string] map', () => {
    const actual = deflate({ student: { name: 'Tom', color: 'blue' } });

    assert.deepStrictEqual(actual.schema.root, [{
      name: 'student',
      type: '@student',
      flag: 0
    }]);
    assert.deepStrictEqual(actual.schema['@student'], [{
      name: 'name',
      type: 'string',
      flag: 0
    },
    {
      name: 'color',
      type: 'string',
      flag: 0
    }]);
    assert.deepStrictEqual(actual.data, ['Tom', 'blue']);
  });
});

describe('deflate 2nd degree nested homogenous object', () => {
  it('deflate string: [string:[string:string]] map', () => {
    const actual = deflate({ room: { student: { name: 'Tom' } } });

    assert.deepStrictEqual(actual.schema.root, [{
      name: 'room',
      type: '@room',
      flag: 0
    }]);
    assert.deepStrictEqual(actual.schema['@room'], [{
      name: 'student',
      type: '@student',
      flag: 0
    }]);
    assert.deepStrictEqual(actual.schema['@student'], [{
      name: 'name',
      type: 'string',
      flag: 0
    }]);
    assert.deepStrictEqual(actual.data, ['Tom']);
  });

  it('deflate string: [string: [string:string; string:string]] map', () => {
    const actual = deflate({ room: { student: { name: 'Tom', color: 'blue' } } });

    assert.deepStrictEqual(actual.schema.root, [{
      name: 'room',
      type: '@room',
      flag: 0
    }]);
    assert.deepStrictEqual(actual.schema['@room'], [{
      name: 'student',
      type: '@student',
      flag: 0
    }]);
    assert.deepStrictEqual(actual.schema['@student'], [{
      name: 'name',
      type: 'string',
      flag: 0
    },
    {
      name: 'color',
      type: 'string',
      flag: 0
    }]);
    assert.deepStrictEqual(actual.data, ['Tom', 'blue']);

    it('deflate string: [string: array of [string:string; string:string]] map', () => {
      const actual = deflate({
        room: {
          students: [
            { name: 'Tom', color: 'blue' },
            { name: 'Jerry', color: 'orange' }
          ]
        }
      });

      assert.deepStrictEqual(actual.schema.root, [{
        name: 'room',
        type: '@room',
        flag: 0
      }]);
      assert.deepStrictEqual(actual.schema['@room'], [{
        name: 'students',
        type: '@students',
        flag: 1
      }]);
      assert.deepStrictEqual(actual.schema['@students'], [{
        name: 'name',
        type: 'string',
        flag: 0
      },
      {
        name: 'color',
        type: 'string',
        flag: 0
      }]);
      assert.deepStrictEqual(actual.data, [2, 'Tom', 'blue', 'Jerry', 'orange']);
    });
  });

  it('deflate string: [string: array of [string:string; string: string array of size 1]] map', () => {
    const actual = deflate({
      room: {
        students: [
          { name: 'Tom', colors: ['blue'] },
          { name: 'Jerry', colors: ['orange'] }
        ]
      }
    });

    assert.deepStrictEqual(actual.schema.root, [{
      name: 'room',
      type: '@room',
      flag: 0
    }]);
    assert.deepStrictEqual(actual.schema['@room'], [{
      name: 'students',
      type: '@students',
      flag: 1
    }]);
    assert.deepStrictEqual(actual.schema['@students'], [{
      name: 'name',
      type: 'string',
      flag: 0
    },
    {
      name: 'colors',
      type: 'string',
      flag: 1
    }]);
    assert.deepStrictEqual(actual.data, [2, 'Tom', 1, 'blue', 'Jerry', 1, 'orange']);
  });

  it('deflate string: [string: array of [string:string; string: string array]] map', () => {
    const actual = deflate({
      room: {
        students: [
          { name: 'Tom', colors: ['blue', 'white'] },
          { name: 'Jerry', colors: ['orange', 'black'] }
        ]
      }
    });

    assert.deepStrictEqual(actual.schema.root, [{
      name: 'room',
      type: '@room',
      flag: 0
    }]);
    assert.deepStrictEqual(actual.schema['@room'], [{
      name: 'students',
      type: '@students',
      flag: 1
    }]);
    assert.deepStrictEqual(actual.schema['@students'], [{
      name: 'name',
      type: 'string',
      flag: 0
    },
    {
      name: 'colors',
      type: 'string',
      flag: 1
    }]);
    assert.deepStrictEqual(actual.data, [2, 'Tom', 2, 'blue', 'white', 'Jerry', 2, 'orange', 'black']);
  });
});

