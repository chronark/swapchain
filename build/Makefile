export BASE_IMAGE = swapchain/base
export DOCKER_BUILDKIT = 1
export COMPOSE_DOCKER_CLI_BUILD = 1 

build:
	docker-compose build

up: build
	docker-compose up


daemon: build
	docker-compose up -d