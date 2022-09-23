'use strict';

const common = require('./common.js');
const db = require('./db.js')('session');

class Session {
  constructor(token, channel, data) {
    this.token = token;
    this.channel = channel;
    this.channels = new Map([channel]);
    this.data = data;
    this.context = new Proxy(data, {
      get: (data, key) => {
        if (key === 'token') return token;
        if (key === 'client') return channel.client;
        return Reflect.get(data, key);
      },
      set: (data, key, value) => {
        const res = Reflect.set(data, key, value);
        const sql = `UPDATE session SET data = ${1} WHERE token = ${2}`;
        db.query(sql, [JSON.stringify(data), token]);
        return res;
      },
    });
  }
}

const sessions = new Map();
const channels = new Map();

class Client {
  get ip() {
    return channels.get(this).ip;
  }

  async startSession(user) {
    const channel = channels.get(this);
    const token = common.generateToken();
    db.create({ token, data: '{}', ip: channel.ip, user });
    const session = new Session(token, channel, {});
    channel.session = session;
    sessions.set(token, session);
    return token;
  }

  async getUser(login) {
    const sql = `SELECT id, login, password FROM users WHERE login = ${1}`;
    return db.query(sql, ['login']);
  }

  async restoreSession(token) {
    let session = sessions.get(token);
    const channel = channels.get(this);
    if (!session) {
      const sql = `SELECT data FROM session WHERE token = ${1}`;
      const [record] = await db.query(sql, [token]);
      if (!record || !record.data) return null;
      session = new Session(token, channel, record.data);
      sessions.set(token, session);
    }
    channel.session = session;
    return session;
  }
}

class Channel {
  constructor(req, res, connection) {
    this.req = req;
    this.res = res;
    this.ip = req.socket.remoteAddress;
    this.connection = connection;
    const client = new Client();
    this.client = client;
    channels.set(client, this);
    this.session = null;
  }

  get token() {
    if (this.session === null) return 'anonymous';
    return this.session.token;
  }

  destroy() {
    if (!this.session) return;
    const token = this.session.token;
    sessions.delete(token);
  }
}

module.exports = { Channel, channels };
