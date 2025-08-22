import type {
  Datum,
  Deflation,
  Meta,
  Schema
} from './types.d.ts';

import { PrimitiveType } from './types';

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

  for (const { name, type } of metalist) {
    const [head] = refHead;

    if (type === PrimitiveType.StringType) {
      result[name] = parse(type, data.at(head) as Datum);
      refHead[0] += 1;
    } else if (type === PrimitiveType.NumberType) {
      result[name] = parse(type, data.at(head) as Datum);
      refHead[0] += 1;
    } else {
      const subMetalist = schema[type];
      if (!subMetalist) throw new Error('TypeDeflationError');

      result[name] = readin(subMetalist, schema, refHead, data);
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

