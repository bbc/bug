# BUG (Broadcast Universal Gateway)

![BUG Logo](https://github.com/bbc/bbcnews-bug-core/blob/main/src/client/public/icons/bug-logo-256x256.png?raw=true)

BUG provides management and control of network devices in broadcast environments.

This is the all new version 3.

It's definitely in pre-alpha, so please don't use it yet...

## Development Getting Started

For development on your local machine with docker (recommended)

* Install docker
* Clone the repository
* Change directories to the `bbcnews-bug-core` folder
* Spin it up with `docker compose -f docker-compose.yml -f docker-compose.development.yml up -d`

You can change many of the port parameters, logging locations by setting values in a `.env` file in the root directory.

When developing in docker changes will automatically be relfected in docker using volume mounts and nodemon to reload. However, adding additionally packages will mean you need to rebuild the image using `docker-compose build` before running `docker compose -f docker-compose.yml -f docker-compose.development.yml up` to run your newly updated image.

For development on a your local machine

* Clone the repository
* Change directories to the `bbcnews-bug-core/src` folder
* Install dependenices with `npm install`
* Use `npm run development` to run on your local machine.

## Production: Spinning up BUG Core

* Download and unzip the latest release
* Install docker on your system if it's not already there
* Change directories to your unziped release and run - `docker compose -f docker-compose.yml -f docker-compose.production.yml up -d`
* After a few minutes bug will be avalible at `http://localhost:80`

## Sample Environment (`.env`) File

```
MODULE_PORT=3200
MODULE_HOME=/home/node/module

DOCKER_CORE_NAME=bug-core
DOCKER_NETWORK_NAME=bug

BUG_CORE_PORT=3101
BUG_CORE_HOST=http://localhost
BUG_CORE_LOG_FOLDER=logs
BUG_CORE_LOG_NAME=bug-core
BUG_CORE_CONSOLE_LEVEL=debug

MONGO_EXPRESS_PORT=3202
MONGO_EXPRESS_USERNAME=admin
MONGO_EXPRESS_PASSWORD=testing321

PORT=3000
```

## Helpful Docker Tips

### Detaching from the Terminal

Using the flag `-d` with docker-compose detaches the container output stream from the terminal

### Checking BUG status

Verify your containers are running using the `docker ps` command.

### Check individual container outputs

To look at the logs (terminal) of the core container use;

`docker logs bbcnews-bug-core_bug-core_1`

Where `bbcnews-bug-core_bug-core_1` is the name of the container that can be seen from `docker ps`.

### Stop BUG

To stop the main bug-core service use;

`docker-compose down`
