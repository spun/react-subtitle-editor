FROM node:lts-alpine@sha256:fb71d01345f11b708a3553c66e7c74074f2d506400ea81973343d915cb64eef0 AS development-dependencies-env
COPY . /app
WORKDIR /app
RUN npm ci

FROM node:lts-alpine@sha256:fb71d01345f11b708a3553c66e7c74074f2d506400ea81973343d915cb64eef0 AS build-env
COPY . /app/
COPY --from=development-dependencies-env /app/node_modules /app/node_modules
WORKDIR /app
RUN npm run build

FROM docker.io/nginxinc/nginx-unprivileged:1.31.2-alpine@sha256:054e14f543eb688809d59ec2ad1644d1a61678e247c87a318ad605977eb37eaf
COPY --from=build-env /app/build/client /usr/share/nginx/html
EXPOSE 8080
