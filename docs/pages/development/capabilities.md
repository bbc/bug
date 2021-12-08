# Capabilities

Each module type can support one or more capabilities. These are standardised API endpoints to allow data flow between modules.

## dhcp-server

This capability is used primary for routers which provide DHCP servers. It can be used to provide 'friendly' names in other modules when only the IP address is known.

`/container/{panelid}/dhcp-server/`

-   lists all DHCP leases on the server, with the following fields:

| Field    | Description                        |
| -------- | ---------------------------------- |
| mac      | MAC address                        |
| address  | IP address                         |
| hostname | active hostname for the device     |
| comment  | optional comment                   |
| active   | whether or not the lease is active |
| static   | whether or not the lease is static |
