import { Flag, type Meta, type Schema } from '../types.js';

function metaToText(meta: Meta): string {
  if (meta.flag === Flag.Single) {
    return `${meta.name} ${meta.type}`;
  }

  if (meta.flag === Flag.Multiple) {
    return `${meta.name} ${meta.type}+`;
  }

  throw new Error('SerializationError');
}

export function encodeSchema(schema: Schema): string {
  const { root, ...rest } = schema;
  const rootS = schema.root.map(metaToText).join(',');
  const restS = Object.entries(rest).map(([k, metalist]) => {
    return `${k} ${metalist.map(metaToText).join(',')}`;
  });

  return [rootS, ...restS].join(';');
}

function decodeMeta(text: string): Meta {
  const [name, raw] = text.split(' ') as [string, string]
  if (!raw) throw new Error('DeserializationError');

  const [type, empty] = raw.split('+');
  if (!type) throw new Error('DeserializationError');

  return {
    name,
    type,
    flag: empty === '' ? 1 : 0
  }
}

export function decodeSchema(text: string): Schema {
  const raws = text.split(';');
  if (!raws[0]) throw new Error('DeserializationError');

  const root = raws[0].split(',').map(decodeMeta);

  const subMetalist = raws.slice(1).reduce((acc, raw) => {
    const [name] = raw.split(' ', 1);
    if (!name) throw new Error('DeserializationError');

    const rawMetalist = raw.substring(name.length + 1)
    if (!rawMetalist) throw new Error('DeserializationError');

    return { ...acc, [name]: rawMetalist.split(',').map(decodeMeta) };
  }, {});


  const schema = <Schema>{
    ...subMetalist,
    root
  };


  return schema;
}

