'use strict';

const http = require('node:http');

const answerNotFound = (res, headers) => {
  res.writeHead(404, headers);
  res.end('Not found');
};

const receiveArgs = async (req) => {
  const buffers = [];
  for await (const chunk of req) buffers.push(chunk);
  const data = Buffer.concat(buffers).toString();
  return JSON.parse(data);
};

module.exports = (routing, port, console) => {
  http
    .createServer(async (req, res) => {
      const headers = {
        'Access-Control-Allow-Origin':
          '*' /* @dev First, read about security */,
        'Access-Control-Allow-Methods': 'POST',
        'Access-Control-Max-Age': 2592000, // 30 days
        /** add other headers as per requirement */
      };

      const { url, socket } = req;
      const [name, method, id] = url.substring(1).split('/');
      const entity = routing[name];
      if (!entity) return void answerNotFound(res, headers);
      const handler = entity[method];
      if (!handler) return void answerNotFound(res, headers);

      res.writeHead(200, headers);
      const src = handler.toString();
      const signature = src.substring(0, src.indexOf(')'));
      const args = [];
      if (signature.includes('(id')) args.push(id);
      args.push(...(await receiveArgs(req)));
      console.log(`${socket.remoteAddress} ${req.method} ${url}`);
      const result = await handler(...args);
      res.end(JSON.stringify(result.rows));
    })
    .listen(port);

  console.log(`API on port ${port}`);
};
