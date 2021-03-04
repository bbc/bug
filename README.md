# BUG (Broadcast Universal Gateway)

BUG provides management and control of network devices in broadcast environments

This is the all new version 3.

It's definitely in pre-pre-pre-alpha, so please don't use it yet...

## Spinning up BUG Core

Build the BUG Core container with the following commandl

`docker build -t bug-core .`

* `-t` Tags the image created as `bug-core`
* `.` Looks for a `Dockerfile` to build from in the current directory

Next you can run the container with this command;

`docker run -d -v src:/home/node/bug-core bug-core`

* `-d` - Detaches from the terminal
* `-v src:/home/node/bug-core` Live mounts the src folder in the container when running for development.

Verify your container is running using the `docker ps` command.