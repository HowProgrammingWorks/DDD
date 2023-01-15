({
  async read(id) {
    const output = await db('users').read(id, ['id', 'login']);
    return output.rows;
  },

  async create({ login, password }) {
    const passwordHash = await common.hash(password);
    const output = await db('users').create({ login, password: passwordHash });
    return output.rows;
  },

  async update(id, { login, password }) {
    const passwordHash = await common.hash(password);
    const output = await db('users').update(id, { login, password: passwordHash });
    return output.rows;
  },

  async delete(id) {
    const output = await db('users').delete(id);
    return output.rows;
  },

  async find(mask) {
    const sql = 'SELECT login from users where login like $1';
    const output = await db('users').query(sql, [mask]);
    return output.rows;
  },
});
