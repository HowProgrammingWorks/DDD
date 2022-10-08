'use strict';

module.exports = {
  async say(message) {
    console.log({ message });
    return { status: 'ok' };
  },
};
