'use strict';

const server = require('./http.js');
const db = require('./db.js');

const routing = {
  user: require('./user.js'),
  country: db('country'),
  city: db('city'),
};

server(routing, 8000);
