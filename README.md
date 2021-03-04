# BUG (Broadcast Universal Gateway)

BUG provides management and control of network devices in broadcast environments

This is the all new version 3.

It's definitely in pre-pre-pre-alpha, so please don't use it yet...


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

## Spinning up BUG Core without Compose

Build the BUG Core container with the following commandl

`docker build -t bug-core ./src`

* `-t` Tags the image created as `bug-core`
* `./src` Looks for a `Dockerfile` to build from in the `./src` directory

Next you can run the container with this command;

`docker run -d -p 3000:3000 -v src:/home/node/bug-core bug-core`

* `-d` - Detaches from the terminal
* `-v src:/home/node/bug-core` Live mounts the src folder in the container when running for development.
* `-p 3000:3000` Maps port 3000 of the containe to port 3000 of the host machine

Verify your container is running using the `docker ps` command.