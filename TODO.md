# Do now

- MDI icons in icon picker broken

# Do next

# Backlog

- make all user names lower-case
- sort out overlaying menu in bug api table
- move jest to vitest
- update docs with upgrade instructions (command line only)
- update diagrams in docs to remove watchtower
- add tests for groups
- use time rather than progress for panel build
- when enabling security strategy it should warn if you're cutting off your branch
- add logs to panel dropdown in panels table
- in panel list it should show whether the module is already built
- clicking cancel/save in edit dialog shouldn't go 'back' - it should navigate
- you can crash chrome by pasting a large text in config edit code dialog
- why does the development version show module upgrades available?
- improve upgrade process

- check PanelBuilding

- check PanelRowState

- need to use UTC for all panel dates

- add api error handler to all containers (see mikrotik-sdwan)
- services should try/throw
- routes don\t need check for errors - handled by async-handler
- add panel toolbar menu to logs page
- should we use process.exit() inside worker error handler
- i need a flag to prevent the module ui from loading - overlayPanel or something? When a status item is so important the panel can't run.

- put this at the end of all workers?

```
main().catch(err => {
    console.error("worker-interface: startup failure");
    console.error(err.stack || err.message || err);
    process.exit(1);
});
```

GOT TO:
screenshots and readme in arista - then rest of list.

- I like this for utils (called from workers):

```
catch(err) {
    console.error(`arista-fetchtemperature failed: ${err.message}`);
    throw err;
}
```

- add JSON API response to all servers

- error.trace isn't a thing
