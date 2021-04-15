'use strict';

const http = require('http');
const db = require('./db.js');

const PORT = 8000;

const routing = {
  user: require('./user.js'),
  country: db('country'),
  city: db('city'),
};

const crud = { get: 'read', post: 'create', put: 'update', delete: 'delete' };

const receiveArgs = async (req) => {
  const buffers = [];
  for await (const chunk of req) buffers.push(chunk);
  const data = Buffer.concat(buffers).toString();
  return JSON.parse(data);
};

http.createServer(async (req, res) => {
  const { method, url, socket } = req;
  const [name, id] = url.substring(1).split('/');
  const entity = routing[name];
  if (!entity) return res.end('Not found');
  const procedure = crud[method.toLowerCase()];
  const handler = entity[procedure];
  if (!handler) return res.end('Not found');
  const src = handler.toString();
  const signature = src.substring(0, src.indexOf(')'));
  const args = [];
  if (signature.includes('(id')) args.push(id);
  if (signature.includes('{')) args.push(await receiveArgs(req));
  console.log(`${socket.remoteAddress} ${method} ${url}`);
  const result = await handler(...args);
  res.end(JSON.stringify(result.rows));
}).listen(PORT);

console.log(`Listen on port ${PORT}`);
