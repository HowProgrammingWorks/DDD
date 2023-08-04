'use strict';

module.exports = {
  async say(message) {
    console.log({ message });
    return await { status: 'ok' };
  },
};
