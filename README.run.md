# Running the Spark Platform

## Running Spark from your local host:

The following must be installed on your local machine in order to run Spark locally

- `Docker`
- `docker-compose`

To clone and run Spark on your local machine

```bash
git clone git@github.com:SteveAtSentosa/spark.git
cd spark/dev
docker-compose up --detach --build
```

To Stop the Spark Platform

```bash
cd spark/dev # repo root
docker-compose down
```

## Trying out the APIs

### Testing Spark APIs from the Web App

You can issue a REST call via the web app as follows

![](./images/app-swagger-ui-rest-calls.png)

### Testing Spark APIs Visual Studio Code

An extensive REST API endpoint suite is available via Visual Studio Code, with an experience very similar to postman.

Please refer to the [developer documentation](./README.dev.md#testing) for further information
