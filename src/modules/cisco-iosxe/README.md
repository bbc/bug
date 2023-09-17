# Cisco IOS-XE

A module to allow control and monitoring of Cisco IOS-XE based switches.

https://github.com/bbc/bug/tree/main/src/modules/cisco-iosxe

## Features

### Interface list

-   View of current port state (including err-disabled)
-   Ability to enable/disable interfaces
-   Rename interface
-   Show LLDP neighbour information
-   View and change switchport VLAN membership
-   Display port speed
-   Sparklines to show interface traffic

### Interface

-   view interface details
-   view interface stats
-   view LLDP neighbour information
-   view ARP/MAC table for interface

## Installation

BUG uses Restconf to control the switch, and there are some configuration changes you'll need to make.

Access the CLI, enter configuration mode and add:

```
# netconf-yang
# restconf
# ip http server
```

Save changes and you're ready to go.

You'll need to set a username and password in the BUG config page. We recommend creating a dedicated user on the switch for BUG.

## Known Issues

None

## To do

-   SFP light level?
-   Policy maps
-   Interface stats history
