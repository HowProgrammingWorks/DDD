start: ## start the database
start:
	@docker-compose up -d db

stop: ## stop the database
stop:
	@docker-compose stop db

logs: ## show logs
logs:
	@docker-compose logs -f db

psql: ## run psql
psql: start
psql:
	@docker-compose exec db sh -c 'psql -U $$POSTGRES_USER $$POSTGRES_DB'
