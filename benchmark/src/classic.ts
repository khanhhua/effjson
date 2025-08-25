import { createServer } from 'http';
import { fetchJson, requestPath } from './util.js';

export default createServer(async (req, res) => {
  try {
    const path = requestPath(req)
    const json = JSON.parse(await fetchJson(path));

    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/json');
    res.end(JSON.stringify(json));
  } catch (e: Error) {
    res.statusCode = 400;
    res.end(e.message);
  }
});


