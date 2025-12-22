FROM node:lts-alpine@sha256:c921b97d4b74f51744057454b306b418cf693865e73b8100559189605f6955b8 AS development-dependencies-env
COPY . /app
WORKDIR /app
RUN npm ci

FROM node:lts-alpine@sha256:c921b97d4b74f51744057454b306b418cf693865e73b8100559189605f6955b8 AS build-env
COPY . /app/
COPY --from=development-dependencies-env /app/node_modules /app/node_modules
WORKDIR /app
RUN npm run build

FROM docker.io/nginxinc/nginx-unprivileged:1.29.3-alpine@sha256:11cab1801e5b195e6e6aab60b4dce008081bb096ab919233b75265b6b3d8ea47
COPY --from=build-env /app/build/client /usr/share/nginx/html
EXPOSE 8080
