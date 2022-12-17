---
layout: page
title: Installation
nav_order: 2
has_children: true
---

# Installation

BUG allows you to control equipment in a production or broadcast setting from a single interface - no more rearranging chrome tabs or keyboards or sharing maagement IP addresses!

You can run BUG on any compatible operating system and deploy a central interface with user management and audit trails that allow you to control a range of equipment.

A full list of supported modules is available on the [Modules Page](/pages/modules)

Trying to run a BUG instance to develop a new module? You probably want [these instructions](/pages/development) instead.

## Supported Operating Systems

-   [Windows](/pages/installation/windows.html)
-   [MacOS](/pages/installation/mac.html)
-   [Linux](/pages/installation/linux.html)

## Install Environments

### AWS or Virtualised

Run BUG in EC2 or on a virtual machine for larger deployments or for higher levels of availability, in such a case it might be desirable to make BUG available publicly and couple it with SSO options such as OIDC or SAML.

Note - When making BUG available on the internet you should take the necessary precautions to protect your infrastructure. You should use SSL certificates and reduce risk by placing BUG behind a reverse proxy.

### Using locally

Run BUG on any hardware that has support for docker. This is suggested for small deployments where only a couple of users are accessing BUG on a local network.

# User Guide

## Adding Panels

For each piece of equipment you want to control you'll need to create a panel:

1. Click panels on the left-hand toolbar
2. Select `Add Panel` in the top right
3. Give your panel a recognisable name and description and select the type of module.
4. Click `add` and wait for your brand new panel to start. You'll see it appear in the toolbar on the right.

## Configuring Panels

## Updating Panels

## Security

# Troubleshooting

-   [Troubleshooting](/pages/installation/troubleshooting.html)
