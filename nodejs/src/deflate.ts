import assert from 'node:assert';
import type {
  Datum,
  Deflation,
} from './types';
import { Flag } from './types';
import type { Meta, Schema } from './types.js';

export function deflate(input: object, level: number = 0): Deflation {
  const deflation = {
    schema: {
      root: [],
    },
    data: []
  } as Deflation;
  const headerSet = new Set<String>();

  const monoidal = Array.isArray(input) ? input : [input];

  for (const item of monoidal) {
    const entries = Object.entries(item);

    for (const [k, v] of entries) {
      if (isObject(v)) {
        const sub = deflate(v as object, level + 1);
        deflation.schema.root.push({
          name: k,
          type: `@${k}`,
          flag: Flag.Single
        });

        const { root: subRoot, ...rest } = sub.schema;
        deflation.schema = {
          ...deflation.schema,
          ...rest,
          [`@${k}`]: subRoot
        }

        deflation.data.push(...sub.data);
      } else if (isArray(v)) {
        const array = <any[]>v;
        if (isObject(array[0])) {
          const sub = deflateArray(v as object[], level + 1);
          deflation.schema.root.push({
            name: k,
            type: `@${k}`,
            flag: Flag.Multiple
          });

          const { root: subRoot, ...rest } = sub.schema;
          deflation.schema = {
            ...deflation.schema,
            ...rest,
            [`@${k}`]: subRoot
          }

          deflation.data.push(...sub.data);
        } else {
          if (!headerSet.has(k)) {
            deflation.schema.root.push({
              name: k,
              type: typeof (array[0]),
              flag: Flag.Multiple
            });
            headerSet.add(k);
          }

          deflation.data.push(array.length, ...array);
        }
      } else {
        if (!headerSet.has(k)) {
          deflation.schema.root.push({
            name: k,
            type: typeof (v),
            flag: Flag.Single
          });
          headerSet.add(k);
        }

        deflation.data.push(v as Datum);
      }
    }
  }

  return deflation;
}

function deflateArray(array: object[], level: number): Deflation {
  let zero: Deflation | null = null;

  for (const item of array) {
    const itemDeflation = deflate(item, level);

    if (!zero) {
      zero = itemDeflation;
      zero.data.unshift(array.length); // Mark the first item of data stride with header-length
    } else {
      assertSchemaEq(zero.schema, itemDeflation.schema);
      zero.data.push(...itemDeflation.data);
    }
  }

  assert.ok(zero, 'ArrayDeflationError');
  return zero;
}

function assertSchemaEq(a: Schema, b: Schema) {
  assert.deepStrictEqual(a, b, 'HomogeneityError');
}

function isObject(value: any) {
  return Object.prototype.toString.call(value) === '[object Object]';
}

function isArray(value: any): boolean {
  return Object.prototype.toString.call(value) === '[object Array]';
}

