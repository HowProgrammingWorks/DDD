({
  async signIn({ login, password }) {
    const user = await context.client.getUser(login);
    if (user) {
      const hash = common.hash(password);
      if (user.password === hash) {
        console.log(`Logged user: ${login}`);
        const token = await context.client.startSession(user.id);
        return { status: 'logged', token };
      }
    }
    return { status: 'not logged' };
  },

  async restore({ token }) {
    const success = await context.client.restoreSession(token);
    const status = success ? 'logged' : 'not logged';
    return { status };
  },
});
