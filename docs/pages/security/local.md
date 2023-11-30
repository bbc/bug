---
layout: page
title: Local
parent: Security
nav_order: 1
---

# Local

Local login allows a user to login using a username and password combination as set in `/system/users`.

By default this security is restricted with a source address filter to;

-   `192.168.0.0/24`
-   `127.0.0.0/8`

If you'd like users on other networks to be able to login with this method. You'll need to adjust the source filter list.
