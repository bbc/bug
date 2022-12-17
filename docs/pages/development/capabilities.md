---
layout: page
title: Cababilities
parent: Development
nav_order: 2
---

# Development - Module Capabilities

Each module type can support one or more capabilities. These are standardised API endpoints to allow data flow between modules.

## dhcp-server

This capability is used primary for network routers which provide DHCP servers. It can be used to provide 'friendly' names in other modules when only the IP address is known.

`/container/{panelid}/capabilities/dhcp-server/`

-   lists all DHCP leases on the server, with the following fields:

| Field    | Description                        |
| -------- | ---------------------------------- |
| mac      | MAC address                        |
| address  | IP address                         |
| hostname | active hostname for the device     |
| comment  | optional comment                   |
| active   | whether or not the lease is active |
| static   | whether or not the lease is static |

## video-router

This capability is used primary for video routers. It can be used to provide routing information to other devices in the broadcast chain (eg a multiviewer).

`/container/{panelid}/capabilities/video-router/`

-   lists an array containing all routes on the video router with the following fields:

| Field       | Description                                  |
| ----------- | -------------------------------------------- |
| outputIndex | 0-based index of the router output           |
| outputLabel | text label of the router output              |
| inputIndex  | 0-based index of the currently routed source |
| inputLabel  | text label of the currently routed source    |
