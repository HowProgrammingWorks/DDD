## Working with database

The script runs PostgresSQL 14 in Docker.

To run database locally use the following commands:

* it runs the database server:
```bash
make start
# or
docker-compose up -d db
```

* it stops the database server:
```bash
make stop
#or
docker-compose stop db
```

* it shows logs from the database server:
```bash
make logs
#or
docker-compose logs -f db
```

* it runs psql:
```bash
make psql
#or
docker-compose exec db sh -c 'psql -U $$POSTGRES_USER $$POSTGRES_DB'
```