export enum PrimitiveType {
  StringType = 'string',
  NumberType = 'number'
}

export interface Meta {
  name: string;
  type: PrimitiveType | string;
}

export type Datum = string | number | null;

export interface Schema {
  root: Meta[];
  [k: string]: Meta[];
}

export interface Deflation {
  schema: Schema;
  data: Datum[];
}
