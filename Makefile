.PHONY: install dev dev-api dev-web docker-up docker-down lint build

install:
	cd backend && pip install -r requirements.txt
	cd frontend && npm install

dev-api:
	cd backend && uvicorn main:app --reload --host 0.0.0.0 --port 8500

dev-web:
	cd frontend && npm run dev

dev:
	@echo "Run start.bat on Windows, or use 'make dev-api' and 'make dev-web' in separate terminals."

docker-up:
	docker compose up -d

docker-down:
	docker compose down

lint:
	cd frontend && npm run lint

build:
	cd frontend && npm run build
