---
title: Security
nav_order: 5
has_children: true
layout: page
---

# Security

> Important: exposing BUG directly to the internet is not recommended.

## Methods

BUG provides several authentication methods using `passport.js`. These security measures prevent unauthorized access, accidental switching, or control of equipment.

Access the security settings in the interface via `/system/security`.

By default, no security is enabled on first run. You can enable one or more security methods to give users different login options. These appear as tabs on the login page.

Before enabling security, make sure to add users via `/system/users`.

---

## Default User

BUG ships with a default user account:

- Name: `Admin`
- Email: `bug@bbc.co.uk`
- Pin: `1234`
- Password: `admin`

All users are stored as JSON files in `./config/global/user.json`. You can edit this file directly if you lose access to the frontend.

> Note: Password hashes are stored in the file, and pin numbers are stored in plain text. You should change the default user details before enabling security.

Example default user JSON:

```
{
  "name": "Admin",
  "email": "[bug@bbc.co.uk](mailto:bug@bbc.co.uk)",
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

---

## User Roles

BUG supports two distinct user roles that control what users can access and modify:

### Admin Role

Users with the **admin** role have full control over the system:

- **User Management**: Create, edit, and delete users; assign and modify user roles
- **Security Configuration**: Configure authentication methods and security settings via `/system/security`
- **System Configuration**: Access system-wide settings via `/system/configuration`
- **Module Configuration**: Access and modify configuration panels for all modules
- **Panel Management**: Assign and restrict which panels are available to other users
- **Strategies**: Create and edit security strategies

### User Role

Users with the **user** role have limited, operational access:

- **Module Access**: View and interact with module panels (based on panel restrictions assigned by an admin)
- **Profile Management**: Update their own user profile and password
- **View-Only System Info**: Access system health and container status information
- **No Administrative Access**: Cannot modify settings, manage users, or configure modules

### Both Roles

Users with either role can:

- Log in using configured authentication methods
- Access modules and panels they have permission to view
- View application logs (when permitted)

---

## Security Methods

- [Local Authentication](/bug/pages/security/local)
- [PIN Authentication](/bug/pages/security/pin)
- [HTTP Proxy / SSO](/bug/pages/security/proxy)
