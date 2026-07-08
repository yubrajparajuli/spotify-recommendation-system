build:
	docker compose -f docker-compose.prod.yml build

up:
	docker compose -f docker-compose.prod.yml up

up-d:
	docker compose -f docker-compose.prod.yml up -d

down:
	docker compose -f docker-compose.prod.yml down

restart:
	docker compose -f docker-compose.prod.yml restart

logs:
	docker logs -f spotify-backend

clean:
	docker compose -f docker-compose.prod.yml down -v