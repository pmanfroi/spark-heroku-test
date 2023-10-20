FROM node:18.14.0

COPY . /app-client
WORKDIR /app-client

WORKDIR /app-client
RUN yarn install
RUN yarn build

ENTRYPOINT yarn start
