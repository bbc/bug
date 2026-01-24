---
title: Installation
nav_order: 2
has_children: true
---

# Installation

BUG provides a single, central interface for monitoring and controlling equipment in production and broadcast environments. It removes the need to manage multiple browser tabs, keyboards, or shared management IP addresses, and instead offers a consistent UI with user management and audit trails.

BUG can be run on any supported operating system and deployed either locally or in a virtualised environment, depending on your scale and availability requirements.

A full list of supported modules is available on the Modules page:
https://bbc.github.io/bug/pages/modules

If you are installing BUG in order to develop or test a new module, refer to the Development documentation instead:
https://bbc.github.io/bug/pages/development

---

## Supported Operating Systems

BUG can be installed on the following platforms:

- Windows
- macOS
- Linux

Detailed installation steps for each platform are available in the pages below:

- https://bbc.github.io/bug/pages/installation/windows.html
- https://bbc.github.io/bug/pages/installation/mac.html
- https://bbc.github.io/bug/pages/installation/linux.html

---

## Installation Environments

### AWS or Virtualised Environments

BUG can be run on EC2 or other virtual machines for larger deployments or where higher availability is required. In these environments it may be appropriate to expose BUG publicly and integrate it with authentication systems such as OIDC or SAML.

When making BUG accessible from the internet, appropriate security measures should be taken. This includes using SSL certificates and placing BUG behind a reverse proxy to reduce exposure.

### Local Installation

BUG can also be run locally on any hardware that supports Docker. This approach is well suited to smaller installations where only a small number of users access BUG on a local network.

---

## User Guide

### Adding Panels

Each piece of equipment or service you want to control or monitor is represented by a panel.

To add a panel:

1. Select Panels from the left-hand toolbar
2. Click Add Panel in the top-right corner
3. Enter a name and description, then choose the appropriate module type
4. Click Add and wait for the panel to start

Once created, the panel will appear in the toolbar and become available in the UI.

---

## Troubleshooting

If you encounter problems during installation or startup, see:

- https://bbc.github.io/bug/pages/installation/troubleshooting.html
