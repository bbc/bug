# BUG (Broadcast Universal Gateway)

BUG provides management and control of network devices in broadcast environments

This is the all new version 3.

It's definitely in pre-pre-pre-alpha, so please don't use it yet...

## Getting Started

For development on a yourlocal machine

* Clone the repository
* Change directories to the `bbcnews-bug-core/src`
* Install dependenices with `npm install`
* Use `npm run dev` to run on your local machine.
* If you want to run in a docker container instead, use the steps below, for the moment this method also runs a dev version.

## Spinning up BUG Core

From the project direcotry run the following;

`docker-compose up -d`

* `-d` - Detaches from the terminal

Verify your containers are running using the `docker ps` command.

To look at the logs (terminal) of the core container use;

`docker logs bbcnews-bug-core_bug-core_1`

Where `bbcnews-bug-core_bug-core_1` is the name of the container that can be seen from `docker ps`.

To stop the main bug-core service use;

`docker-compose down`

Additionally a `bbcnews-bug-core_bmd-videohub_1` container is created on localhost:3000 for testing. It's volume is live linked and runs nodemon