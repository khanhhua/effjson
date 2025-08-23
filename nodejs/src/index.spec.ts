import fs from 'node:fs/promises';

import { describe, it, before } from "node:test";
import assert from "node:assert";
import { deflate, inflate } from './index';

describe('deflate-inflate', () => {
  const sampleFiles = [
    '../../samples/sample1.json',
    '../../samples/sample2.json'
  ];

  for (const file of sampleFiles) {
    it(`sample: ${file}`, async () => {
      const url = new URL(file, import.meta.url);
      const sample = await fs.readFile(url, { encoding: 'utf8' }).then(JSON.parse);
      const deflation = deflate(sample);
      const actual = inflate(deflation);

      assert.deepStrictEqual(actual, sample);
    });
  };
});

