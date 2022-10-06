const country = db('country');

({
  read(id) {
    console.log({ db });
    return country.read(id);
  },

  find(mask) {
    const sql = 'SELECT * from country where name like $1';
    return country.query(sql, [mask]);
  },
});
