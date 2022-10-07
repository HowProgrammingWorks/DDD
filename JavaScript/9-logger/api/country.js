module.exports = ({ db }) => {

  const countriesRepository = db('country');

  return {
    read(id) {
      return countriesRepository.read(id);
    },

    find(mask) {
      const sql = 'SELECT * from country where name like $1';
      return countriesRepository.query(sql, [mask]);
    },
  }
};
