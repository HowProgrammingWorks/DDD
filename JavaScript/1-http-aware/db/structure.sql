CREATE TABLE "users" (
  "id" bigint generated always as identity,
  "login" varchar NOT NULL,
  "password" varchar NOT NULL
);

ALTER TABLE "users" ADD CONSTRAINT pkUsers PRIMARY KEY (id);
CREATE UNIQUE INDEX akUsersLogin ON "users" (login);

CREATE TABLE "session" (
  "id" bigint generated always as identity,
  "user" integer NOT NULL,
  "token" varchar(64) NOT NULL,
  "ip" varchar(45) NOT NULL,
  "data" text
);

ALTER TABLE "session" ADD CONSTRAINT pkSession PRIMARY KEY (id);
CREATE UNIQUE INDEX akSession ON "session" (token);
ALTER TABLE "session" ADD CONSTRAINT fkSessionUserId FOREIGN KEY ("user") REFERENCES "users" (id) ON DELETE CASCADE;

CREATE TABLE "country" (
  "id" bigint generated always as identity,
  "name" varchar NOT NULL
);

ALTER TABLE "country" ADD CONSTRAINT "pkCountry" PRIMARY KEY ("id");

CREATE UNIQUE INDEX "akCountry" ON "country" ("name");

CREATE TABLE "city" (
  "id" bigint generated always as identity,
  "name" varchar NOT NULL,
  "country" bigint NOT NULL
);

ALTER TABLE "city" ADD CONSTRAINT "pkCity" PRIMARY KEY ("id");

CREATE UNIQUE INDEX "akCity" ON "city" ("name");

ALTER TABLE "city" ADD CONSTRAINT "fkCityCountry" FOREIGN KEY ("country") REFERENCES "country" ("id") ON DELETE CASCADE;
