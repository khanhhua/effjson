import type {
  Datum,
  Deflation,
  Meta,
  Schema
} from './types';

import { Flag, PrimitiveType } from './types';

export function inflate({ schema, data }: Deflation): object[] {
  const result = <any>[];
  const refHead: [number] = [0];

  while (refHead[0] < data.length) {
    const item = readin(schema.root, schema, refHead, data);
    result.push(item);
  }

  return result;
}

export function readin(metalist: Meta[], schema: Schema, refHead: [number], data: Datum[]): object {
  let result = {} as { [k: string]: any };

  for (const { name, type, flag } of metalist) {
    if (flag === Flag.Single) {
      const [head] = refHead;

      if (type === PrimitiveType.StringType || type === PrimitiveType.NumberType) {
        result[name] = parse(type, data.at(head) as Datum);
        refHead[0] += 1;
      } else {
        const subMetalist = schema[type];
        if (!subMetalist) throw new Error('TypeDeflationError');

        result[name] = readin(subMetalist, schema, refHead, data);
      }
    } else if (flag === Flag.Multiple) {
      const [head] = refHead;
      const size = data.at(head) as number;

      if (!size) throw new Error('TypeDeflationError');

      refHead[0] += 1;

      if (type === PrimitiveType.StringType || type === PrimitiveType.NumberType) {
        const sliced = <any[]>data.slice(refHead[0], refHead[0] + size);
        result[name] = sliced.map(item => parse(type, item));

        refHead[0] += size;
      } else {
        const subMetalist = schema[type];
        if (!subMetalist) throw new Error('TypeDeflationError');

        const list = new Array(size);
        for (let i = 0; i < size; i++) {
          list[i] = readin(subMetalist, schema, refHead, data);
        }
        result[name] = list;
      }
    }
  }

  return result;
}

function parse(type: PrimitiveType, datum: Datum): string | number {
  switch (type) {
    case PrimitiveType.StringType: return datum as string;
    case PrimitiveType.NumberType: return parseInt(datum as string, 10) as number;
  }

  throw new Error('ParseError');
}

