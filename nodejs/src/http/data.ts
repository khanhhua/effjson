import type { Datum } from '../types';

export function encodeData(data: [Datum]): string {
  return data.map(encodeDatum).join(' ');
}

function encodeDatum(datum: Datum): string {
  return JSON.stringify(datum);
}

export function decodeData(text: string): [Datum] {
  return text.split(' ').map(s => JSON.parse(s) as Datum);
}

