---
layout: page
title: Requirements
parent: Installation
nav_order: 7
---

Some guidelines for the specification of hardware needed to run BUG.

# Disk Space

The BUG image itself is around 300MB. You'll need 2GB of storage space free on your hard-drive to run BUG with another 100MB for every adaitional panel you add. Some modules, have high memory requirements. For exmapled the Cisco SG module. If this is the cause it is defined as an optional feild `memory` in the `module.json` definition file.

# Memory

BUG itself requires 1GB of free RAM. Each container uses a maximum of 200MB of RAM, budget accordingly.

Note - If you're building a development build of BUG you'll require at least 4GB of RAM.

# CPU

## Archictecture

Currently BUG runs on x64 CPU architectures only. In future support may be extened to ARMv7 for Raspberry Pi.
