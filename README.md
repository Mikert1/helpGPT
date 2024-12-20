# helpGPT

Please ensure Docker is installed before proceeding with this tutorial.

## Run docker containers to support the "saving your prompts" Function
The website is also working without these containers but the saving prompts and accounts will not be functional.

If you know what you are doing you can see the links for your self: 

[Database container](https://hub.docker.com/r/tiesnoordhuis/deep_dive_database) and [API container](https://hub.docker.com/r/tiesnoordhuis/deep_dive_api).

### Running the containers.

First we pull both the database and api:
```bash
docker pull tiesnoordhuis/deep_dive_api
```

```bash
docker pull tiesnoordhuis/deep_dive_api
```

Then we can start running:

```bash
docker run -p 3306:3306 --name deep_dive_database_container tiesnoordhuis/deep_dive_database
```

```bash
docker run -p 8000:8000 --link deep_dive_database_container:db --name deep_dive_api_container tiesnoordhuis/deep_dive_api
```
Please note that the database comes first because the api will link to the database.