---
layout: page
title: Pin
parent: Security
nav_order: 1
---

# Pin

Local login allows a user to login using a numeric pin code as set in `/system/users`.

This method is design for simple login on a local network. It is inherently insecure as there are limited combinations of 4-digit numbers and it is easy to guess a correct combination.

This method is designed to be used only as simple way of forcing users to acknowledge who they are on shared workstations in order to log their control actions.

By default this security is restricted with a source address filter to;

-   `192.168.0.0/24`
-   `127.0.0.0/8`

If you'd like users on other networks to be able to login with this method. You'll need to adjust the source filter list.
