'use strict';

const http = require('node:http');

const NOT_FOUND = 'Not found';

const receiveArgs = async (req) => {
  const buffers = [];
  for await (const chunk of req) buffers.push(chunk);
  const data = Buffer.concat(buffers).toString();
  return JSON.parse(data);
};

const crud = { get: 'read', post: 'create', put: 'update', delete: 'delete' };

module.exports = (routing, port) => {
  http.createServer(async (req, res) => {
    const { url, socket, method } = req;
    const [name, id] = url.substring(1).split('/');
    const entity = routing[name];
    if (!entity) return res.end(NOT_FOUND);
    const procedure = crud[method.toLowerCase()];
    const handler = entity[procedure];
    if (!handler) return res.end(NOT_FOUND);
    const src = handler.toString();
    const signature = src.substring(0, src.indexOf(')'));
    const args = [];
    if (signature.includes('(id')) args.push(id);
    if (signature.includes('{')) args.push(await receiveArgs(req));
    console.log(`${socket.remoteAddress} ${method} ${url}`);
    const result = await handler(...args);
    res.end(JSON.stringify(result.rows));
  }).listen(port);

  console.log(`API on port ${port}`);
};
