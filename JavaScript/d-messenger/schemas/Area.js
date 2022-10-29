({
  Entity: {},

  name: { type: 'string', unique: true },
  owner: 'Account',
  members: { many: 'Account' },
});
