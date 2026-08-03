FROM node:lts-alpine@sha256:f70403e87646dc51b45295f4b8b70cdad0b63d2297c4c9899119b03f7af7a6b3 AS development-dependencies-env
COPY . /app
WORKDIR /app
RUN npm ci

FROM node:lts-alpine@sha256:f70403e87646dc51b45295f4b8b70cdad0b63d2297c4c9899119b03f7af7a6b3 AS build-env
COPY . /app/
COPY --from=development-dependencies-env /app/node_modules /app/node_modules
WORKDIR /app
RUN npm run build

FROM docker.io/nginxinc/nginx-unprivileged:1.31.3-alpine@sha256:59ccf0943b0b8e8d9e6ea9039a39555730f544701a655c596f7df7d096c593f5
COPY --from=build-env /app/build/client /usr/share/nginx/html
EXPOSE 8080
