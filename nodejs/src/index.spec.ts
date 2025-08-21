import { describe, it } from "node:test";
import assert from "node:assert";

import { deflate } from './index.ts';

describe('deflate non-nested single object', () => {
  it('deflate empty object', () => {
    const actual = deflate({});

    assert.deepStrictEqual(actual.schema.root, []);
    assert.deepStrictEqual(actual.data, []);
  });


  it('deflate string:string map', () => {
    const actual = deflate({ name: 'Tom' });

    assert.deepStrictEqual(actual.schema.root, [{ name: 'name', type: 'string' }]);
    assert.deepStrictEqual(actual.data, ['Tom']);
  });
});

describe('deflate non-nested homogenous object array', () => {
  it('deflate string:string map', () => {
    const actual = deflate([{ name: 'Tom' }]);

    assert.deepStrictEqual(actual.schema.root, [{ name: 'name', type: 'string' }]);
    assert.deepStrictEqual(actual.data, ['Tom']);
  });

  it('deflate string:string maps', () => {
    const actual = deflate([{ name: 'Tom' }, { name: 'Jerry' }]);

    assert.deepStrictEqual(actual.schema.root, [{ name: 'name', type: 'string' }]);
    assert.deepStrictEqual(actual.data, ['Tom', 'Jerry']);
  });

  it('deflate multiple keyed string:string maps', () => {
    const actual = deflate([{ name: 'Tom', color: 'blue' }, { name: 'Jerry', color: 'orange' }]);

    assert.deepStrictEqual(actual.schema.root, [
      { name: 'name', type: 'string' },
      { name: 'color', type: 'string' },
    ]);
    assert.deepStrictEqual(actual.data, ['Tom', 'blue', 'Jerry', 'orange']);
  });
});

describe('deflate 1st degree nested homogenous object', () => {
  it('deflate string:[string:string] map', () => {
    const actual = deflate({ student: { name: 'Tom' } });

    assert.deepStrictEqual(actual.schema.root, [{
      name: 'student',
      type: '@student'
    }]);
    assert.deepStrictEqual(actual.schema['@student'], [{
      name: 'name',
      type: 'string'
    }]);
    assert.deepStrictEqual(actual.data, ['Tom']);
  });

  it('deflate string:[string:string; string:string] map', () => {
    const actual = deflate({ student: { name: 'Tom', color: 'blue' } });

    assert.deepStrictEqual(actual.schema.root, [{
      name: 'student',
      type: '@student'
    }]);
    assert.deepStrictEqual(actual.schema['@student'], [{
      name: 'name',
      type: 'string'
    },
    {
      name: 'color',
      type: 'string'
    }]);
    assert.deepStrictEqual(actual.data, ['Tom', 'blue']);
  });
});

describe('deflate 2nd degree nested homogenous object', () => {
  it('deflate string: [string:[string:string]] map', () => {
    const actual = deflate({ room: { student: { name: 'Tom' } } });

    assert.deepStrictEqual(actual.schema.root, [{
      name: 'room',
      type: '@room'
    }]);
    assert.deepStrictEqual(actual.schema['@room'], [{
      name: 'student',
      type: '@student'
    }]);
    assert.deepStrictEqual(actual.schema['@student'], [{
      name: 'name',
      type: 'string'
    }]);
    assert.deepStrictEqual(actual.data, ['Tom']);
  });

  it('deflate string: [string: [string:string; string:string]] map', () => {
    const actual = deflate({ room: { student: { name: 'Tom', color: 'blue' } } });

    assert.deepStrictEqual(actual.schema.root, [{
      name: 'room',
      type: '@room'
    }]);
    assert.deepStrictEqual(actual.schema['@room'], [{
      name: 'student',
      type: '@student'
    }]);
    assert.deepStrictEqual(actual.schema['@student'], [{
      name: 'name',
      type: 'string'
    },
    {
      name: 'color',
      type: 'string'
    }]);
    assert.deepStrictEqual(actual.data, ['Tom', 'blue']);
  });
});

