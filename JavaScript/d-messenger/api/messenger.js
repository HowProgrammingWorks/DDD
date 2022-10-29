({
  async method({ arg }) {
    console.log({ method: 'messenger.method', arg });
    return { status: 'ok' };
  },
});
