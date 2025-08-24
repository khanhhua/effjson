import assert from 'node:assert';
import { describe, it } from 'node:test';
import { encodeSchema, decodeSchema } from './schema';
import type { Schema } from '../types';


describe('schema serialization as http header compatible text', () => {
  it('serialize single meta root', () => {
    const schema = <Schema>{
      root: [{ name: 'name', type: 'string', flag: 0 }]
    };
    const actual = encodeSchema(schema);

    assert.strictEqual(actual, 'name string')
  });

  it('serialize multi meta root with one array type', () => {
    const schema = <Schema>{
      root: [
        { name: 'name', type: 'string', flag: 0 },
        { name: 'colors', type: 'string', flag: 1 }
      ]
    };
    const actual = encodeSchema(schema);

    assert.strictEqual(actual, 'name string,colors string+')
  });

  it('serialize multi-schema', () => {
    const schema = <Schema>{
      root: [
        { name: 'students', type: '@students', flag: 1 },
      ],
      '@students': [
        { name: 'name', type: 'string', flag: 0 },
        { name: 'colors', type: 'string', flag: 1 },
      ]
    };
    const actual = encodeSchema(schema);

    assert.strictEqual(actual,
      'students @students+;' +
      '@students name string,colors string+'
    )
  });
});

describe('schema deserialization from http header compatible text', () => {
  it('deserialize to single meta root schema of 1 primitive field', () => {
    const actual = decodeSchema('name string');

    assert.deepStrictEqual(actual, {
      root: [{
        name: 'name',
        type: 'string',
        flag: 0
      }]
    });
  });

  it('deserialize to single meta root schema of 1 primitive array field', () => {
    const actual = decodeSchema('name string+');

    assert.deepStrictEqual(actual, {
      root: [{
        name: 'name',
        type: 'string',
        flag: 1
      }]
    });
  });

  it('deserialize to single meta root schema of 2 primitive fields', () => {
    const actual = decodeSchema('name string,color string');

    assert.deepStrictEqual(actual, {
      root: [{
        name: 'name',
        type: 'string',
        flag: 0
      },
      {
        name: 'color',
        type: 'string',
        flag: 0
      }]
    });
  });

  it('deserialize to single meta root schema of 1 primitive and 1 primitive array field', () => {
    const actual = decodeSchema('name string,colors string+');

    assert.deepStrictEqual(actual, {
      root: [{
        name: 'name',
        type: 'string',
        flag: 0
      },
      {
        name: 'colors',
        type: 'string',
        flag: 1
      }]
    });
  });

  it('deserialize to complex schema with simple referenced type', () => {
    const actual = decodeSchema('students @students+;@students name string,color string');

    assert.deepStrictEqual(actual, {
      root: [{
        name: 'students',
        type: '@students',
        flag: 1
      }],
      '@students': [{
        name: 'name',
        type: 'string',
        flag: 0
      },
      {
        name: 'color',
        type: 'string',
        flag: 0
      }]
    });
  });

  it('deserialize to complex schema with complex referenced type', () => {
    const actual = decodeSchema('students @students+;@students name string,colors string+');

    assert.deepStrictEqual(actual, {
      root: [{
        name: 'students',
        type: '@students',
        flag: 1
      }],
      '@students': [{
        name: 'name',
        type: 'string',
        flag: 0
      },
      {
        name: 'colors',
        type: 'string',
        flag: 1
      }]
    });
  });
});

