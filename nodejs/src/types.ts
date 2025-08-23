export enum PrimitiveType {
  StringType = 'string',
  NumberType = 'number'
}

export interface Meta {
  name: string;
  type: PrimitiveType | string;
  flag: Flag;
}

export type Datum = string | number | null;

export enum Flag {
  Single, Multiple
}

export interface Schema {
  root: Meta[];
  [k: string]: Meta[];
}

export interface Deflation {
  schema: Schema;
  data: Datum[];
}
