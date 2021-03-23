# BUG (Broadcast Universal Gateway)

BUG provides management and control of network devices in broadcast environments.

This is the all new version 3.

It's definitely in pre-alpha, so please don't use it yet...

## Development Getting Started

For development on your local machine with docker (recommended)

* Install docker
* Clone the repository
* Change directories to the `bbcnews-bug-core` folder
* Spin it up with `docker-compose up`

In this case you can switch between the production and development versions by changing the `NODE_ENV` variable in the `.env` files in the root directory.

When developing in docker changes will automatically be relfected in docker using volume mounts and nodemon to reload. However, adding additionally packages will mean you need to rebuild the image using `docker-compose build` before running `docker-compose up` to run your newly updated image.

For development on a your local machine

* Clone the repository
* Change directories to the `bbcnews-bug-core/src` folder
* Install dependenices with `npm install`
* Use `npm run development` to run on your local machine.

## Production: Spinning up BUG Core

* Download and unzip the latest release
* Install docker on your system if it's not already there
* Change directories to your unziped release and run - `docker-compose up -d`
* After a few minutes bug will be avalible at `http://localhost:80`


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