# Changelog

## [2.2.21] - 2020-01-10

-   Fix BUG workers not running on boot
-   BMI Test module - hide invalid interfaces

## [2.2.20] - 2020-01-10

-   Added BMI Test module

## [2.2.19] - 2020-01-09

-   Upgraded Laravel from 5.7 -> 5.8

## [2.2.18] - 2019-12-03

-   Added support for Cisco stacked switches
-   Added support for SG500X Cisco switches
-   Added support for SG550X Cisco switches

## [2.2.17] - 2019-12-02

-   Fixed storage of outlet names in Densitron MDUs
-   Fixed keep autologin state on upgrade
-   Added ability to rename mikrotik router interfaces
-   Added display of detected interface speed on mikrotik routers

## [2.2.16] - 2019-11-28

-   Fixed Cisco SG300 SNMP/VLAN bug

## [2.2.15] - 2019-10-24

-   Added support for Densitron EMU3 mains units
-   Fixed restarting of bug worker threads when using systemd
-   Fixed nodata overlays on tieline bridgeit

## [2.2.14] - 2019-10-07

-   Fixed mongo/tieline bug with dots in field names
-   Fixed tieline when codex package not installed

## [2.2.13] - 2019-10-07

-   Fixed spurious routes being shown with routing-mark

## [2.2.12] - 2019-10-04

-   Added blackmagic multiview module

## [2.2.11] - 2019-09-27

-   Added jitter buffer to dektec display
-   Allow user to change name of OBE device
-   Added input filters to OBE number fields

## [2.2.10] - 2019-09-27

-   Fixed bug with video bitrate calculation in OBE
-   Changed OBE gui to use kbps rather than bps for ts bitrate

## [2.2.9] - 2019-09-16

-   Added support for tieline bridge-IT devices

## [2.2.7] - 2019-09-16

-   Fixed OBE bug when saving multiple audio channels or outputs

## [2.2.6] - 2019-09-13

-   Improved handing of unknown video type detection on OBEs

## [2.2.5] - 2019-09-09

-   Fixed bug with dropdowns in NTT/OBE panels

## [2.2.4] - 2019-08-31

-   Added support for tieline merlin devices

## [2.2.3] - 2019-07-15

-   Added context menus to videohub module
-   Added destination locks to videohub module
-   Added ability to edit single labels via context menu in videohub module

## [2.2.2] - 2019-07-09

-   Users can now edit labels in videohub module
-   Improved view of pages on mobile devices
-   Fixed modal overlay on mobile devices
-   Added dialog to indicate when UI connection lost
-   Fixed async videohub sending of changes

## [2.2.1] - 2019-07-04

-   Added support for upgrade notifications
-   Added ability to upgrade BUG from within the web-app
-   Fixed multiple headers in admin panels

## [2.2.0] - 2019-06-30

-   Added ability to edit from console now we have an on-screen keyboard
-   Fixed videohub timeout and crash bug
-   Fixed missing .id field (and therefore crash) in mikrotik DHCP
-   Fixed dodgy scrollbars

## [2.1.9] - 2019-06-26

-   Added on-screen keyboard (optional)
-   Improved comrex UI on mobile devices
