module.exports = ({ db, common }) => {

  const usersRepository = db('users');

  return {
    read(id) {
      return usersRepository.read(id, ['id', 'login']);
    },

    async create({ login, password }) {
      const passwordHash = await common.hash(password);
      return usersRepository.create({ login, password: passwordHash });
    },

    async update(id, { login, password }) {
      const passwordHash = await common.hash(password);
      return usersRepository.update(id, { login, password: passwordHash });
    },

    delete(id) {
      return usersRepository.delete(id);
    },

    find(mask) {
      const sql = 'SELECT login from users where login like $1';
      return usersRepository.query(sql, [mask]);
    },
  }
}
