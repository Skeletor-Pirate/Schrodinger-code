.PHONY: help dev build test docker-build docker-compose-up docker-compose-down k8s-dev k8s-prod lint clean

help:
	@echo "UNHINGED Development Makefile"
	@echo ""
	@echo "Usage:"
	@echo "  make dev                    Start development environment with docker-compose"
	@echo "  make build                  Build frontend and backend for production"
	@echo "  make test                   Run tests for frontend and backend"
	@echo "  make docker-build           Build Docker images for frontend and backend"
	@echo "  make docker-compose-up      Start all services with docker-compose"
	@echo "  make docker-compose-down    Stop and remove docker-compose services"
	@echo "  make k8s-dev                Deploy to Kubernetes development environment"
	@echo "  make k8s-prod               Deploy to Kubernetes production environment"
	@echo "  make lint                   Run linting for frontend and backend"
	@echo "  make clean                  Remove build artifacts and node modules"

dev:
	docker-compose up --build

build:
	cd backend && npm run build
	cd ../unhinged-web && npm run build

test:
	cd backend && npm test
	cd ../unhinged-web && npm test

docker-build:
	docker-compose build

docker-compose-up:
	docker-compose up -d

docker-compose-down:
	docker-compose down

k8s-dev:
	kubectl apply -k k8s/overlays/dev/ --namespace unhinged
	kubectl rollout status deployment/unhinged-backend --namespace unhinged --timeout=120s
	kubectl rollout status deployment/unhinged-frontend --namespace unhinged --timeout=120s

k8s-prod:
	kubectl apply -k k8s/overlays/prod/ --namespace unhinged
	kubectl rollout status deployment/unhinged-backend --namespace unhinged --timeout=180s
	kubectl rollout status deployment/unhinged-frontend --namespace unhinged --timeout=180s

lint:
	cd backend && npm run lint
	cd ../unhinged-web && npm run lint

clean:
	rm -rf backend/node_modules backend/.next
	rm -rf unhinged-web/node_modules unhinged-web/.next
	docker system prune -f
	kubectl delete -k k8s/overlays/dev/ --namespace unhinged --ignore-not-found=true
	kubectl delete -k k8s/overlays/prod/ --namespace unhinged --ignore-not-found=true