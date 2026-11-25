# Cisco SG

## Overview

A module to monitor and control Cisco SG-series switches.

Interface list features:

- list of interfaces with bitrate and recent historical stats
- ability to enable and disable ports
- view and update interface descriptions
- select VLAN mode (access or trunk) and update VLAN membership
- display of negotiated and configured interface speeds
- ability to protect interfaces from accidental changes
- display of neighbors and known devices (LLDP and FDB)
- optional DHCP source panels to enrich discovered MAC addresses with IP details

Interface page features:

- detailed per-interface view
- statistics graph for recent traffic history
- neighbor details (LLDP)
- devices tab (FDB) with optional IP lookup

Status checks include:

- heartbeat (module connectivity)
- stale interface, VLAN, and system data detection
- pending configuration detection
- password-expired detection

SNMP polling operations run one at a time. Each request has a 5-second timeout,
and each polling operation has a 15-second deadline. Requests are not retried,
except for one retry per timed-out GETNEXT request.
Slow or failed reads can leave some values stale while other values continue to update.
Heartbeat requests take priority in the polling queue.
Interface discovery, details, and PoE polling use GETNEXT for their interface tables and stop at index 1000,
matching the module's existing interface filter.
PoE polling detects the legacy and newer Cisco PoE MIB layouts.
VLAN discovery also uses GETNEXT and stops above VLAN ID 4100.
System polling uses one GETNEXT probe to detect the VLAN control version.
Interface aliases, admin states, PoE admin states, and VLAN memberships are
reconciled every five minutes; changes made through BUG update the database immediately.
Tasks that require discovered interfaces or VLANs retry every five seconds until
those prerequisites are available.

![Screenshot](./assets/screenshot.png)

## Configuration

| Field                 | Default Value | Description                                                          |
| --------------------- | ------------- | -------------------------------------------------------------------- |
| `id`                  | `""`          | Unique identifier for this module instance (usually auto-generated). |
| `order`               | `0`           | Display order for this module instance.                              |
| `needsConfigured`     | `true`        | Indicates whether the module has been configured since build.        |
| `title`               | `""`          | Human-readable title shown in the UI.                                |
| `module`              | `"cisco-sg"`  | Internal name of the module.                                         |
| `description`         | `""`          | Optional text describing this module instance.                       |
| `notes`               | `""`          | Free-text field for extra operational notes.                         |
| `enabled`             | `false`       | Whether this module instance is active.                              |
| `address`             | `""`          | IP address or hostname of the switch.                                |
| `username`            | `"bug"`       | SSH username used for CLI-based actions and checks.                  |
| `password`            | `""`          | SSH password for the configured user.                                |
| `snmpCommunity`       | `public`      | SNMP community string with write access.                             |
| `protectedInterfaces` | `[]`          | List of interface IDs protected from accidental changes.             |
| `dhcpSources`         | `[]`          | List of panel IDs that expose the `dhcp-server` capability.          |

---

## Capabilities

This module follows BUG's standard capabilities model. For more information, see [BUG Capabilities Documentation]({DOCS_BASEURL}pages/development/capabilities.html).

| Type         | List        |
| ------------ | ----------- |
| **Exposes**  | None        |
| **Consumes** | dhcp-server |

---

## Device Configuration

- Create a username and password with write access for SSH actions.
- Create an SNMP community with write access for monitoring and control.
