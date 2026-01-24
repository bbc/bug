---
title: Local
parent: Security
nav_order: 1
---

# Local Authentication

Local login allows users to authenticate using a username and password as configured in `/system/users`.

By default, access is restricted to the following network ranges:

- `192.168.0.0/24`
- `127.0.0.0/8`

To allow users from other networks to log in using local authentication, update the source address filter list in the configuration.
