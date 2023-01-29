const countryRoutes = ({ db }) => {
  const country = db("country");

  return {
    read(id) {
      return country.read(id);
    },

    find(mask) {
      const sql = "SELECT * from country where name like $1";
      return country.query(sql, [mask]);
    },
  };
};

module.exports = countryRoutes;
