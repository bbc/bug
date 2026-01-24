---
title: Upgrading
nav_order: 7
has_children: false
---

# Upgrading

BUG is updated via Docker and the command line.

---

## Safe Upgrade Checklist

Before upgrading a production instance, it is recommended to:

1. Backup all configuration and panel data
    - Copy the `./config` and `./logs` folders to a safe location.
    - These are mounted outside the container, so backups are straightforward.

2. Stop any non-essential panels or modules (optional)
    - If your deployment has many panels or heavy workloads, stopping them reduces the chance of in-flight data issues.

3. Review the changelog for the target BUG version
    - Check for breaking changes that may affect your panel configs or module setups.

4. Test the upgrade in a development or staging environment first if possible

5. Proceed with upgrading via Docker

---

## Command Line Upgrade

To upgrade your BUG instance:

1. Pull the latest BUG image from the GitHub Container Registry:

```
docker pull ghcr.io/bbc/bug:latest
```

2. Restart the containers with the new image:

```
docker-compose up -d
```

Docker will recreate only the containers that need updating, minimizing downtime (usually around 10 seconds). Panel configurations and module data are preserved.

---

## Running a Specific Version

To run a specific BUG version instead of `latest`:

1. Edit your `docker-compose.yml` and update the `image` field for the app service. For example:

```
services:
    app:
        container_name: bug
        image: ghcr.io/bbc/bug:3.0.1
```

2. Save the file and run:

```
docker-compose up -d
```

The containers will be restarted using the specified version.

> Warning: Changing major or minor versions on a production instance may introduce breaking changes. Always check the changelog and backup your configuration before upgrading.

---

## Upgrading Modules

After upgrading the BUG core, the UI will indicate if any module types have newer images available.

- The panel list will show an upgrade notice for modules with a new version.
- Upgrading a module type will update **all instances** of that module type across your BUG instance.
- You can initiate the upgrade from the panel list in the UI.

> Note: Module upgrades do not affect your panel configurations, but it is recommended to review module-specific changelogs before upgrading, especially for modules that handle critical equipment.
