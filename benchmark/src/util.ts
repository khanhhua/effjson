import { readFile } from "node:fs/promises";

export function requestPath(req) {
  const [path] = req.url?.substring(1).split('?') as [string];

  if (!path) {
    throw new Error('BadRequest');
  }

  return path;
}

const cache: { [k: string]: string } = {};

export async function fetchJson(path: string) {
  const url = new URL(`../../samples/${path}.json`, import.meta.url);

  if (path in cache) {
    return cache[path];
  }

  const content = await readFile(url, { encoding: 'utf8' });
  cache[path] = content;

  return content;
}
