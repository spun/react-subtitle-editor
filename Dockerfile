FROM node:lts-alpine@sha256:6bd9ab43c0ec0190ca7b2d193906cb8b7edf6e7f4afa43ddeccd6452710bffb5 AS development-dependencies-env
COPY . /app
WORKDIR /app
RUN npm ci

FROM node:lts-alpine@sha256:6bd9ab43c0ec0190ca7b2d193906cb8b7edf6e7f4afa43ddeccd6452710bffb5 AS build-env
COPY . /app/
COPY --from=development-dependencies-env /app/node_modules /app/node_modules
WORKDIR /app
RUN npm run build

FROM docker.io/nginx/nginx-unprivileged:1.31.9-alpine@sha256:60214a103e6f38e953ff957f34b1f2e97a9db801ab2df3821da955d0fe6cadd6
COPY --from=build-env /app/build/client /usr/share/nginx/html
EXPOSE 8080
