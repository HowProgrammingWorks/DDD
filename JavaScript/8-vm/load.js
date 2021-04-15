'use strict';

const fs = require('fs').promises;
const vm = require('vm');

const RUN_OPTIONS = { timeout: 5000, displayErrors: false };

module.exports = async (filePath, sandbox) => {
  const src = await fs.readFile(filePath, 'utf8');
  const code = `'use strict';\n${src}`;
  const script = new vm.Script(code);
  const context = vm.createContext(sandbox);
  return script.runInContext(context, RUN_OPTIONS);
};
