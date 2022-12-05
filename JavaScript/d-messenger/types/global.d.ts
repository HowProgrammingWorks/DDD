import * as Config from 'config';

declare global {
  namespace api {}
  namespace common {
    function hash(password: string): Promise<string>;
  }
  const config: typeof Config;
  namespace db {}
}
