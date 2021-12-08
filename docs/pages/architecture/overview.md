# Overview

BUG runs entirely in Docker. It can be run locally, but this is designed for development purposes only.

BUG is made up of a number of containers. Every BUG instance will have at least the following containers

-   BUG Core
-   Mongo

In development an additional module

-   Mongo Express

Each module is then allocated its own container, an isolated environment to carry out backend monitoring, control and data acquisition functions associated with controlling broadcast infrastructure.

---

## Panel Config

Configs contain panel configurations. This configuration is stored in BUG core and pushed to panels on either start or update.

Each module is responsible for providing a base config page accessible in the module router from;

`/config`

Any config input or form should be wrapped in a PanelConfig component with a save button.

```
<PanelConfig>

</PanelConfig>
```

The API route `/api/panel/config/${panelId}` uses the HTTP action PUT and accepts a config object. Any valid fields are MERGED with the existing config. Any invalid fields are ignored. ??? Should we check and passed config against the `module.json` deafulConfig ???

Responsibility for validating fields rests with the module developer.
