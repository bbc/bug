---
layout: page
title: Security
nav_order: 4
has_children: true
---

# Security

BUG provides a number of authentication methods for security. Under the hood these use `passport.js`. It is not recommended that you would ever expose a instance of BUG to the internet directly. Security is provided to prevent mishaps, accidental switching or unauthorized control of equipment.

You can access the security menu from `/system/security`.

By default no security is enabled on first run. You can enable multiple security types to give users different options for logging into BUG. These appear as tabs on the login page.

Before enabling security you'll need to add users to BUG. You can do this from `/system/users`.

## Default User

By default BUG comes with a default user as follows

-   Name - `Admin`
-   Email - `bug@bbc.co.uk`
-   Pin - `1234`
-   Password - `admin`

Each user is stored as a JSON file in `./config/global/user.json`. Editing this file directly will allow you to update config if you lost access to your frontend.

Please note that password hashes, lengths are stored in this file and pin numbers are stored in plain text.

If you are going enable security you should change the default user details.

```
  {
    "name": "Admin",
    "email": "bug@bbc.co.uk",
    "pin": "1234",
    "password": "$2a$10$DJZCNlEKvKvCnhBZb8nUQOlwnEQXGlJiZqYXgGluDDj7ktAbxtwSO",
    "username": "admin",
    "id": "7552f840-e4a5-42ec-9f6c-e2e6039ffcb7",
    "enabled": true,
    "roles": [
      "user",
      "admin"
    ],
    "restrictPanels": false,
    "panels": [],
    "passwordLength": 5,
    "pinLength": 4
  }
```

## Security Methods

-   [Local](/bug/pages/security/local)
-   [Pin](/bug/pages/security/pin)
-   [HTTP Proxy](/bug/pages/security/proxy)
