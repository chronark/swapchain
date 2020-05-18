export BASE_IMAGE = swapchain/base
export DOCKER_BUILDKIT = 1
export COMPOSE_DOCKER_CLI_BUILD = 1 

build-base-image:
	docker build -t $(BASE_IMAGE) -f ../build/Dockerfile.build ..

build: build-base-image
	docker-compose build --build-arg BASE_IMAGE=$(BASE_IMAGE)

up: build
	docker-compose up

