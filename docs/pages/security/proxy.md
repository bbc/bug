---
layout: page
title: Reverse Proxy
parent: Security
nav_order: 1
---

# Reverse Proxy

This provides authentication through a Reverse Proxy, where the proxy is determining the identity of the user. When using this method the email, name or username of the user can be passed in a request header allowing the user to authenticate BUG.

By default the header field `REMOTE_USER` is used which is expecting to match the user's email as configured in `system/user`. This behavior can adjusted in `system/security/proxy`.

By default this security is restricted with a source address filter to

-   `192.168.0.0/24`
-   `127.0.0.0/8`

When using this login method you should adjust the source filter list to `x.x.x.x/32` to only accept requests for this authentication type from a trusted proxy.
