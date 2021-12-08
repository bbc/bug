# Getting BUG from the BCN Repository

For internal development builds within the BCN BUG is avalible from a Docker container registry within the BCN.

To access the repository you'll need to first be on the BCN and then modify you'r docker configuration to allow you to connect to the registry.

The following line will need to be added to the `deamon.json` file in linux.

```
"insecure-registries" : ["172.26.108.110"]
```

On Docker desktop for Mac and Windows, this can be done from the docker preferences menu. To access the Docker preferences menu on MacOS see the screenshot below.

![Docker Menu Screenshot](/assets/images/screenshots/docker-preferences-mac-1.png)

Then navigate the `Docker Engine` tab and add the insecure registries line from above as shown below.

![Docker Engine Settings](/assets/images/screenshots/docker-preferences-mac-2.png)

Finally, you'll need to click `Apply and Restart` in order to apply the settings.
