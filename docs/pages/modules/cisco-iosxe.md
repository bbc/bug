---
layout: page
title: Cisco IOS-XE Switch
parent: Modules
nav_order: 8
---

# Cisco IOS-XE Switch

Stable
{: .label .label-green }

Monitoring and control of Cisco IOS-XE based switches

You'll need RESTConf on your IoS device to use this module. Use the follow commands to enable it on supported hardware.

```
conf t
!
username admin privilege 15 secret admin
!
ip http secure-server
!
restconf
```

## Default Configuration

```
{
  "id": "",
  "order": 0,
  "needsConfigured": true,
  "title": "",
  "module": "cisco-iosxe",
  "description": "",
  "notes": "",
  "enabled": false,
  "address": "",
  "username": "bug",
  "password": "",
  "snmpCommunity": "public",
  "protectedInterfaces": [],
  "dhcpSources": []
}
```
