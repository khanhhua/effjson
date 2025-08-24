import assert from 'node:assert';
import { describe, it } from 'node:test';
import { encodeData } from './data';
import { decodeData } from './data.js';

describe('data serialization as http body compatible text', () => {
  it('serialize single element list of number', () => {
    const actual = encodeData([1]);
    assert.deepStrictEqual(actual, '1');
  });

  it('serialize multiple element list of number', () => {
    const actual = encodeData([1, 2, 3]);
    assert.deepStrictEqual(actual, '1 2 3');
  });

  it('serialize single element list of string', () => {
    const actual = encodeData(['abc']);
    assert.deepStrictEqual(actual, '"abc"');
  });

  it('serialize multiple element list of string', () => {
    const actual = encodeData(['abc', 'def']);
    assert.deepStrictEqual(actual, '"abc" "def"');
  });

  it('serialize multiple element list of datum', () => {
    const actual = encodeData(['abc', 1, 'def', 2, 3, 'xyz']);
    assert.deepStrictEqual(actual, '"abc" 1 "def" 2 3 "xyz"');
  });
});

describe('deserialization of text to list of datum', () => {
  it('deserialize', () => {
    const actual = decodeData('"abc" 1 "def" 2 3 "xyz"');
    assert.deepStrictEqual(actual, ['abc', 1, 'def', 2, 3, 'xyz']);
  });
});

