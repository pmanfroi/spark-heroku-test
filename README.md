# To Run Spark Locally

First, you will need a .env file with proper credentials, which will should to be copied to `spark/dev`

To get the .env file, contact steve@sentosatech.com

Now, follow these steps to start the app.

```bash
git clone git@github.com:SteveAtSentosa/spark.git

# cp .env spark/dev/.

cd spark/dev
docker-compose up

# Wait for the container to build, and for the server to fully start
# You will see a message similar to `SAMPLE DATA LOADED (315 records added)` when everything is running
```

You are now ready to access the Spark App in your local browser at `localhost:4444`

In order to use demo content, you can log in with the following credentials

```
steve@sentosatech.com
Spark&2023
```
