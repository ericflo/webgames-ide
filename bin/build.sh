#!/usr/bin/env bash

docker buildx create --use --name webgames-builder
docker buildx inspect --bootstrap

docker buildx build \
  --platform linux/arm64 \
  --push \
  -t ghcr.io/ericflo/webgames:latest .

docker buildx rm webgames-builder

docker run -it --rm --pull always ghcr.io/ericflo/webgames:latest