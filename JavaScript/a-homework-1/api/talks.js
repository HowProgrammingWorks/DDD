const talksRoutes = ({ console }) => ({
  async say(message) {
    console.log({ message });
    return { status: 'ok' };
  },
});

module.exports = talksRoutes;
