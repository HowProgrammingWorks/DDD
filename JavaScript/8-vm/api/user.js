({
  read(id) {
    console.log(1);
    let crud = db('user')
    delete crud.read
    console.log(crud);
    return {rows: []}
    //return db('users').read(id, ['id', 'login']);
  },

  async create({ login, password }) {
    const passwordHash = await common.hash(password);
    return db('users').create({ login, password: passwordHash });
  },

  async update(id, { login, password }) {
    const passwordHash = await common.hash(password);
    return db('users').update(id, { login, password: passwordHash });
  },

  delete(id) {
    return db('users').delete(id);
  },

  find(mask) {
    const sql = 'SELECT login from users where login like $1';
    return db('users').query(sql, [mask]);
  },
});
