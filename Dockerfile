FROM node:lts-alpine@sha256:01743339035a5c3c11a373cd7c83aeab6ed1457b55da6a69e014a95ac4e4700b AS development-dependencies-env
COPY . /app
WORKDIR /app
RUN npm ci

FROM node:lts-alpine@sha256:01743339035a5c3c11a373cd7c83aeab6ed1457b55da6a69e014a95ac4e4700b AS build-env
COPY . /app/
COPY --from=development-dependencies-env /app/node_modules /app/node_modules
WORKDIR /app
RUN npm run build

FROM docker.io/nginxinc/nginx-unprivileged:1.29.5-alpine@sha256:601c823234c474696ded03d619e67f1e59538802731543099c691aea67e4a553
COPY --from=build-env /app/build/client /usr/share/nginx/html
EXPOSE 8080
