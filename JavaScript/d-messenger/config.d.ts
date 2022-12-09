declare namespace config {
  const static: {
    port: number;
  };
  const api: {
    port: number;
    transport: 'http' | 'https';
  };
  const sandbox: {
    timeout: number;
    displayErrors: boolean;
  };
  const db: {
    host: string;
    port: number;
    database: string;
    user: string;
    password: string;
  };
  const pg: {
    database: string;
    user: string;
    password: string;
  };
}
