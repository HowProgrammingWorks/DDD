({
  signin: {
    parameters: {
      login: 'string',
      password: 'string',
    },
    returns: {
      status: 'string',
      token: 'string',
    },
  },

  signout: {
    returns: { status: 'string' },
  },

  restore: {
    parameters: { token: string },
    returns: { status: string },
  },
});
