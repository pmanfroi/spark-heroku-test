# Spark Dev Environment

This repo contains both the `web-client` and `backend` code (within directories of those same names)

Here are the technology stacks for each of those workspaces

### backend

- nodejs + typescript
- express (rest server)
- yarn v3.4.1 (npm package management)

### web-client

- React + typescript
- Vite (front end build and launch frameworks)
- yarn v 3.4.1 (npm package management)

When developing within the Spark repo, you have several choices

- [On your local host](#developing-on-your-local-host)
- [Using Docker Containers](#developing-using-docker-containers)
- [Runing production builds locally](#running-production-builds-locally)

In all cases, the locally running system will be based on local code, and will include any code changes/additions that you may have made

# Developing on Your Local Host

Local dev mode will launch backend and web-client that are able to `hot load` any changes that you make in the code realtime. You will be required to install a few local depdencies. If you prefer not to do that, you can use [docker containers](#developing-using-docker-containers) instead

You will need to install the following dependencies

- nodejs v18.14.0
- yarn v 3.4.1 (npm package management)

### To install nodejs

- [From the web](https://nodejs.org/en/)
- Via [nvm](https://github.com/nvm-sh/nvm#installing-and-updating) (if you prefer more control over node versions)
  ```bash
  # once installed, issue these two commands for proper versioning
  nvm install v18.14.0
  nvm use v18.14.0
  ```

### To install yarn

```bash
# Note the node installation will include npm
npm install -g yarn
yarn set version 3.4.1
```

# Environment variables

In the .env.sample file you can find the current env variables in use but for security concerns we do not push them to the repository. If you need the value of any keys, please reach out to the team via Slack.

### Running the system on your host

`Starting the Backend`

```bash
cd backend
yarn install
yarn build
yarn start
```

`Starting the Web Client`

```bash
cd web-client
yarn install
yarn build
yarn start
```

# Developing Using Docker Containers

Docker dev mode will launch backend and web-client that are able to `hot load` any changes that you make in the code realtime as well, with the added benefit that you won't have to install anything on your local machine. The tradeoff being that building/starting the containers takes slightly longer than running natively.

`Starting the Backend`

```bash
cd spark/backend/dev
docker-compose up --build
```

`Starting the Web Client`

```bash
cd spark/web-client/dev
docker-compose up --build
```

`Starting both simultaneously`

```bash
cd spark/dev
docker-compose up --build
```

# Running Production Builds Locally

This may be valuable if you have made changes to Dockerfile or docker-compose.yml files, and you want to make sure they will launch and interact correction in "production node"

```bash
cd spark
docker-compose up --build
```

# Testing The APIs

This repo includes a set of predefined REST calls that work with the [Visual Studio Code](https://code.visualstudio.com/) plugin [Thunder Client](https://www.thunderclient.com/). Thunder client provides a postman like experience within the Visual Studio Code IDE

The first step is to install Visual Studio Code on your machine, which you can Download from [here](https://code.visualstudio.com/)

Once you have Visual Studio Code installed, you will need to install the Thunder Client Plugin. You can install and use Thunder Client for **Spark** testing as shown below.

TBD

It is important to note that there are two `environements` defined within Thunder Clients (similar to postman environaments), one for testing against the Lab instance, and other to test againt your locally running instances.

# Running Unit and System Tests

TBD
