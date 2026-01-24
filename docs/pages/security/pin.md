---
title: Pin
parent: Security
nav_order: 2
---

# PIN Authentication

PIN login allows users to authenticate using a numeric PIN code, as configured in `/system/users`.

This method is intended for simple login on a local network. It is inherently insecure due to the limited number of 4-digit combinations, making it easy to guess.

PIN authentication is primarily designed to provide a lightweight way for users to acknowledge their identity on shared workstations and log control actions.

By default, access is restricted to the following network ranges:

- `192.168.0.0/24`
- `127.0.0.0/8`

To allow users from other networks to log in using PIN authentication, update the source address filter list in the configuration.
