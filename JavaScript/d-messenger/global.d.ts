import * as Common from './lib/common';

declare global {
  namespace api {}
  namespace db {}
  const common: typeof Common;
}
