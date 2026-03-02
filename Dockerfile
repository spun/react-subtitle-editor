FROM node:lts-alpine@sha256:4f696fbf39f383c1e486030ba6b289a5d9af541642fc78ab197e584a113b9c03 AS development-dependencies-env
COPY . /app
WORKDIR /app
RUN npm ci

FROM node:lts-alpine@sha256:4f696fbf39f383c1e486030ba6b289a5d9af541642fc78ab197e584a113b9c03 AS build-env
COPY . /app/
COPY --from=development-dependencies-env /app/node_modules /app/node_modules
WORKDIR /app
RUN npm run build

FROM docker.io/nginxinc/nginx-unprivileged:1.29.5-alpine@sha256:e93571f3d08325964770168617743bcce2d308255ded81e38172fb1803407e74
COPY --from=build-env /app/build/client /usr/share/nginx/html
EXPOSE 8080
