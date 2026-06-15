FROM node:lts-alpine@sha256:fb71d01345f11b708a3553c66e7c74074f2d506400ea81973343d915cb64eef0 AS development-dependencies-env
COPY . /app
WORKDIR /app
RUN npm ci

FROM node:lts-alpine@sha256:fb71d01345f11b708a3553c66e7c74074f2d506400ea81973343d915cb64eef0 AS build-env
COPY . /app/
COPY --from=development-dependencies-env /app/node_modules /app/node_modules
WORKDIR /app
RUN npm run build

FROM docker.io/nginxinc/nginx-unprivileged:1.31.1-alpine@sha256:cc300bd2e8776708a8c2c8686a74f06eadf221c5ce01e85d0e821955d7a730ab
COPY --from=build-env /app/build/client /usr/share/nginx/html
EXPOSE 8080
