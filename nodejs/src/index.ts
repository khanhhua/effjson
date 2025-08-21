export interface Meta {
  name: string;
  type: string;
}

export type Datum = string | number | null;

export interface Deflation {
  headers: Meta[];
  data: Datum[];
}

export function deflate(input: object): Deflation {
  const deflation = {
    headers: [],
    data: []
  } as Deflation;
  const headerSet = new Set<String>();

  const monoidal = Array.isArray(input) ? input : [input];

  for (const item of monoidal) {
    const entries = Object.entries(item);

    for (const [k, v] of entries) {
      if (!headerSet.has(k)) {
        deflation.headers.push({
          name: k,
          type: typeof (v),
        });
        headerSet.add(k);
      }

      deflation.data.push(v as Datum);
    }
  }

  return deflation;
}
