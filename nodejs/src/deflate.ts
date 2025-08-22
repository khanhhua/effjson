import type {
  Datum,
  Deflation,
} from './types';

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
          type: `@${k}`
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
            type: typeof (v),
          });
          headerSet.add(k);
        }

        deflation.data.push(v as Datum);
      }
    }
  }

  return deflation;
}

function isObject(value: any) {
  return Object.prototype.toString.call(value) === '[object Object]';
}
