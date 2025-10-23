FROM node:lts-alpine@sha256:bd26af08779f746650d95a2e4d653b0fd3c8030c44284b6b98d701c9b5eb66b9 AS development-dependencies-env
COPY . /app
WORKDIR /app
RUN npm ci

FROM node:lts-alpine@sha256:bd26af08779f746650d95a2e4d653b0fd3c8030c44284b6b98d701c9b5eb66b9 AS build-env
COPY . /app/
COPY --from=development-dependencies-env /app/node_modules /app/node_modules
WORKDIR /app
RUN npm run build

FROM docker.io/nginxinc/nginx-unprivileged:1.29.2@sha256:9bb4992c102c73a31958c75a12c110ed36fb85b4827242197a74f42cdc596954
COPY --from=build-env /app/build/client /usr/share/nginx/html
EXPOSE 8080
