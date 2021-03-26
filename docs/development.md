# Local development

You need two things to be able to work with this app. Docker and YARN/NPM installed on your computer.

## Create a Docker network first

```sh
docker network create smallgame-tier
```
### Example of `docker-compose.yml`

You can find an example in [docker-compose.example.yml](../docker-compose.dev.example.yml) file.
Focus on variables started with dolar sign ($) and replace it with your own configuration, especially lines with these variables:

-   APP_PASSWORD
-   MONGO_CONNECTION
-   APP_DATA_ENCRYPTION_KEY
-   APP_TOKEN
-   MONGODB_ROOT_PASSWORD
-   MONGODB_USERNAME
-   MONGODB_PASSWORD


## API

Start API within Docker container with this command. Run it from the ROOT of the project.

```sh
docker-compose -f docker-compose-dev.yml -p smallgame up
```
## Admin panel

Switch to [/panel](./panel/) directory, install dependencies and run local development.

```sh
yarn install
```

Run local development:

```sh
yarn run dev
```

Now you have API and site with hot reload/restart available on URLs:

-   <http://localhost:8080> (web)
-   <http://localhost:1337> (API)
