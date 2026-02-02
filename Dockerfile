FROM node:lts-alpine@sha256:cd6fb7efa6490f039f3471a189214d5f548c11df1ff9e5b181aa49e22c14383e AS development-dependencies-env
COPY . /app
WORKDIR /app
RUN npm ci

FROM node:lts-alpine@sha256:cd6fb7efa6490f039f3471a189214d5f548c11df1ff9e5b181aa49e22c14383e AS build-env
COPY . /app/
COPY --from=development-dependencies-env /app/node_modules /app/node_modules
WORKDIR /app
RUN npm run build

FROM docker.io/nginxinc/nginx-unprivileged:1.29.3-alpine@sha256:5aea7cc516b419e3526f47dd1531be31a56a046cfe44754d94f9383e13e2ee99
COPY --from=build-env /app/build/client /usr/share/nginx/html
EXPOSE 8080
