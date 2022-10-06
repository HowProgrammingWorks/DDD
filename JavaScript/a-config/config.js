const TRANSPORT = "http"; // "http" or "ws"
const STATIC_PORT = 8000;
const API_PORT = 8001;
const HASH_SALT_SIZE = 16;
const HASH_SIZE = 64;
const LOGS_PATH = "./log";

// Database config
const DB_HOST = "127.0.0.1";
const DB_PORT = 5432;
const DB_NAME = "example";
const DB_USER = "marcus";
const DB_PASSWORD = "password";

module.exports = {
  TRANSPORT,
  STATIC_PORT,
  API_PORT,
  HASH_SALT_SIZE,
  HASH_SIZE,
  LOGS_PATH,
  DB_HOST,
  DB_PORT,
  DB_NAME,
  DB_USER,
  DB_PASSWORD,
};
