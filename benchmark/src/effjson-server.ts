import { createServer, IncomingMessage } from 'http';
import { deflate, encodeSchema, encodeData } from 'effjson-nodejs';
import { requestPath, fetchJson } from './util.js';

export default createServer(async (req: IncomingMessage, res) => {
  try {
    const path = requestPath(req)

    const json = JSON.parse(await fetchJson(path));
    const deflation = deflate(json);

    res.statusCode = 200;
    res.setHeader('Content-Type', `text/effjson+; schema=${encodeSchema(deflation.schema)}`)
    res.end(encodeData(deflation.data));
  } catch (e: Error) {
    res.statusCode = 400;
    res.end(e.message);
  }
});
