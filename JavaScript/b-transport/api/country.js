const country = db('country');

({
  async read(id) {
    console.log({ db });
    const output = await country.read(id);
    return output.rows;
  },

  async find(mask) {
    const sql = 'SELECT * from country where name like $1';
    const output = await country.query(sql, [mask]);
    return output.rows;
  },
});
