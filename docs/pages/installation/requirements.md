---
layout: page
title: Requirements
parent: Installation
nav_order: 7
---

# Requirements

Some guidelines for the specification of host hardware needed to run BUG.

## Disk Space

The BUG image itself is around 300MB. You'll need 2GB of storage space free on your hard-drive to run BUG with another 200MB for every adaitional panel you add.

## Memory

BUG itself requires 1GB of free RAM. Each container uses around of 100MB of RAM, you should budget accordingly.

Some modules, have higher memory requirements. For exmapled the Cisco-SG module which requires 250MB. When this is the cause it is defined as an optional feild `memory` in the `module.json` definition file. This additonal memory requirement is down to the number of workers these modules run. Each additional worker requires approximately 10MB of memory.

Note - If you're building a development build of BUG you'll require at least 4GB of RAM in order to `create-react-app` to complie the development build.

## CPU

### Archictecture

Currently BUG runs on x64 CPU architectures only. In future support may be extened to ARMv7 for Raspberry Pi.
