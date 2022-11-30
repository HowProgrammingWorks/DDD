'use strict';

const fsp = require('node:fs').promises;
const path = require('node:path');
const pg = require('pg');
const metasql = require('metasql');
const config = require('./config.js');

const DB = path.join(process.cwd(), './db');
const SCHEMAS = path.join(process.cwd(), './schemas');

const read = (name) => fsp.readFile(path.join(DB, name), 'utf8');

const execute = async (client, sql) => {
  try {
    await client.query(sql);
  } catch (err) {
    console.error(err);
  }
};

const notEmpty = (s) => s.trim() !== '';

const executeFile = async (client, name) => {
  console.log(`Execute file: ${name}`);
  const sql = await read(name);
  const commands = sql.split(';\n').filter(notEmpty);
  for (const command of commands) {
    await execute(client, command);
  }
};

(async () => {
  await metasql.create(SCHEMAS, DB);
  const inst = new pg.Client({ ...config.db, ...config.pg });
  await inst.connect();
  await executeFile(inst, 'install.sql');
  await inst.end();
  const db = new pg.Client(config.db);
  await db.connect();
  await executeFile(db, 'structure.sql');
  await executeFile(db, 'data.sql');
  await db.end();
})().catch((err) => {
  console.error(err);
});
