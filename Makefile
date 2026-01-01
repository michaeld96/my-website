run-dev:
	docker compose -f docker-compose.yml -f docker-compose.dev.yml up -d --build

run-backend:
	(cd backend/src/API && dotnet run)
	

run-frontend:
	(cd frontend/src/website-frontend && npm run dev)

run-db:
	docker compose -f docker-compose.yml up -d db migrator
	
clean-node:
	rm -rf frontend/src/website-frontend/node_modules frontend/src/website-frontend/package-lock.json
	@cd frontend/src/website-frontend && npm cache clean --force
	@cd frontend/src/website-frontend && npm install

stop:
	docker compose down