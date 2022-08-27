---
layout: page
title: Upgrading
nav_order: 5
has_children: true
---

# Upgrading BUG

## Web Interface

You're BUG should automatically check for updates. You can see if any are availible and update by going to the `settings` page and then `Software Updates`. Click the `Check for Updates` button followed by `Update` and BUG should update automatically!

## Command Line

If you want to upgrade BUG from command line

The first stage is to get the latest version of the BUG image from the registry using this command

`docker pull harbor.prod.bcn.bbc.co.uk/bug/app:latest`

Next, run the following command and Docker will determine which containers to restart with minimal downtime of approximately 10 seconds.

`docker-compose up -d`

That's it - your BUG instance is up to date.

## Running a Specific version of bug

In you're `docker-compose.yml` file adjust the image line to reflect the specific version you wish to run rather than the default `latest`. See the snippet below.

```
...
services:
    app:
        container_name: bug
        image: harbor.prod.bcn.bbc.co.uk/bug/app:3.0.1-main
...
```

After adjusting the file in a text editor save it and run `docker-compose up -d` again. The changes will be registered and the main BUG app will restart.

WARNING: Be careful changing versions on a production BUG changing major and minor versions may make your current configs incompatible with the version you're moving to - read the changelogs before proceeding.
