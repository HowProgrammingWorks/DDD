type QueryResult = Promise<object[]>;

function deleteRecord(id: number): QueryResult;

declare namespace db {
  export function query(sql: string, args: Array<string>): QueryResult;
  export function read(id: number, fields: Array<string>): QueryResult;
  export function create(record: object): QueryResult;
  export function update(id: number, record: object): QueryResult;
  export { deleteRecord as delete };
}
