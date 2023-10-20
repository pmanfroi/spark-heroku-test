FROM node:18.14.0

COPY . /app-server
WORKDIR /app-server

WORKDIR /app-server
RUN yarn install
RUN yarn build

ENTRYPOINT yarn start

