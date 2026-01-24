---
title: Capabilities
parent: Development
nav_order: 2
---

# Module capabilities

Modules can expose one or more **capabilities**.  
A capability is a **standardised API endpoint** that allows data to be shared between modules in a consistent way.

Capabilities make it possible for modules to consume information provided by other modules without needing to know their internal implementation.

## dhcp-server

This capability is used primary for network routers which provide DHCP servers. It can be used to provide 'friendly' names in other modules when only the MAC or IP address is known.

`/container/{panelid}/capabilities/dhcp-server/`

- lists all DHCP leases on the server, with the following fields:

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

- lists an array containing all routes on the video router with the following fields:

| Field       | Description                                  |
| ----------- | -------------------------------------------- |
| outputIndex | 0-based index of the router output           |
| outputLabel | text label of the router output              |
| inputIndex  | 0-based index of the currently routed source |
| inputLabel  | text label of the currently routed source    |
