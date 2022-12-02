'use strict';

const http = require('node:http');
const path = require('node:path');
const fs = require('node:fs');

const MIME_TYPES = {
  html: 'text/html; charset=UTF-8',
  json: 'application/json; charset=UTF-8',
  js: 'application/javascript; charset=UTF-8',
  css: 'text/css',
  png: 'image/png',
  ico: 'image/x-icon',
  svg: 'image/svg+xml',
};

const HEADERS = {
  'X-XSS-Protection': '1; mode=block',
  'X-Content-Type-Options': 'nosniff',
  'Strict-Transport-Security': 'max-age=31536000; includeSubdomains; preload',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

module.exports = (root, port, console) => {
  http
    .createServer(async (req, res) => {
      const url = req.url === '/' ? '/index.html' : req.url;
      const filePath = path.join(root, url);
      try {
        const data = await fs.promises.readFile(filePath);
        const fileExt = path.extname(filePath).substring(1);
        const mimeType = MIME_TYPES[fileExt] || MIME_TYPES.html;
        res.writeHead(200, { ...HEADERS, 'Content-Type': mimeType });
        res.end(data);
      } catch (err) {
        res.statusCode = 404;
        res.end('"File is not found"');
      }
    })
    .listen(port);

  console.log(`Static on port ${port}`);
};
