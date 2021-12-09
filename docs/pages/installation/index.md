---
layout: page
title: Installation
nav_order: 2
has_children: true
---

# Installation

BUG allows you to control equipment in a production or broadcast setting from a single interface, no more rearranging chrome tabs and windows sharing IP addresses for management interfaces or rearranging keyboards.

Run BUG on any operating system and deploy a central interface with user management and audit trails that allow you to control a range of equipment.

You can see the full list on the [Modules Page](https://github.com/bbc/bbcnews-bug/wiki/Modules)

## Supported Operating Systems

-   [Windows](/pages/installation/windows.html)
-   [MacOS](/pages/installation/mac.html)
-   [Linux](/pages/installation/linux.html)

## Install Environments

### Raspberry Pi

Run BUG on a Raspberry Pi 4 to create a portable system, coupled with Raspberry Pi touchscreen this can be mounted in a central and convenient location

### AWS or Virtualised

Run BUG in EC2 or on a virtual machine for larger deployments or for higher levels of availability, in such a case it might be desirable to make BUG available publically and couple it with SSO options such as OIDC or SAML.

Note - When making BUG available on the internet you should take the necessary precautions to protect your infrastructure. You should use SSL certificates and reduce risk by placing BUG behind a reverse proxy.

### Using locally

Run BUG on any hardware that has support for docker. This is suggested for small deployments where only a couple of users are accessing BUG and BUG is not publicly available.

# User Guide

## Adding Panels

For each piece of equipment, you want to control you'll need to create a panel.

1. Click panels on the left-hand toolbar
2. Select `Add Panel` in the top right
3. Give your panel a recognisable name and description and select the type module.
4. Click `add` and wait for your brand new panel to start. You'll see it appear in the toolbar on the right.

## Configuring Panels

## Updating Panels

## Security

# Using Custom Registry

-   [BCN Registry](/pages/installation/registry.html)

# Troubleshooting

-   [Troubleshooting](/pages/installation/troubleshooting.html)
