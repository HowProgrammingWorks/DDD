export function hash(password: string): Promise<string>;

declare global {
  namespace api {}
  namespace common {
    const hash: typeof hash;
  }
  namespace db {}
}
