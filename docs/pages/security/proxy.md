---
layout: page
title: Reverse Proxy
parent: Security
nav_order: 3
---

# Reverse Proxy Authentication

Reverse Proxy authentication allows the proxy to determine the identity of the user. The proxy passes the user’s email, name, or username in a request header, which BUG uses to authenticate the user.

By default, the header field `REMOTE_USER` is used and is expected to match the user's email as configured in `/system/users`. This behavior can be customized in `/system/security/proxy`.

By default, access is restricted to the following network ranges:

-   `192.168.0.0/24`
-   `127.0.0.0/8`

When using this method, you should adjust the source filter list to only accept requests from your trusted proxy (for example, `x.x.x.x/32`), ensuring that only authorized requests are used for authentication.
