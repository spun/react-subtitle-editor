FROM node:lts-alpine@sha256:06d7adf3e0ef61a13f1d28682726366f97a15aa1888c934d3ecec86c33918b53 AS development-dependencies-env
COPY . /app
WORKDIR /app
RUN npm ci

FROM node:lts-alpine@sha256:06d7adf3e0ef61a13f1d28682726366f97a15aa1888c934d3ecec86c33918b53 AS build-env
COPY . /app/
COPY --from=development-dependencies-env /app/node_modules /app/node_modules
WORKDIR /app
RUN npm run build

FROM docker.io/nginx/nginx-unprivileged:1.31.8-alpine@sha256:03df07e5931f8374d440bd62243a5ce9b24719715ef6fc4c9c626a5f1dbef417
COPY --from=build-env /app/build/client /usr/share/nginx/html
EXPOSE 8080
