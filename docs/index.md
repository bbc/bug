---
layout: home
title: Home
nav_order: 1
---

# BUG

**Broadcast Universal Gateway**

[![Backend](https://github.com/bbc/bug/actions/workflows/backend.yml/badge.svg)](https://github.com/bbc/bug/actions/workflows/backend.yml) [![Frontend](https://github.com/bbc/bug/actions/workflows/frontend.yml/badge.svg)](https://github.com/bbc/bug/actions/workflows/frontend.yml) [![BUG Deploy](https://github.com/bbc/bug/actions/workflows/docker.yml/badge.svg)](https://github.com/bbc/bug/actions/workflows/docker.yml) [![Documentation](https://github.com/bbc/bug/actions/workflows/documentation.yml/badge.svg)](https://github.com/bbc/bug/actions/workflows/documentation.yml)

Control and monitor a wide range of equipment from a single web interface.

You can run BUG on a server within your network. A single web page then allows you to add panels that control equipment. Examples include, network switches, video and audio codecs, video matrixes and many more.

![BUG Home Screenshot](/bug/assets/images/screenshots/bug-home.png)

# Getting Started

-   [Installation](./pages/installation) - Installation guide for any operating system
-   [Modules](./pages/modules) - A list of equipment that can be controlled and implemented functionality

# Development

We welcome [development](./pages/development) of additional modules for BUG. A module adds additional control or monitoring functionality to BUG. In principle a module normally represents control of a specific piece of hardware or a service. For example a single module exists to control Blackmagic Videohub matrices and another modules to monitor and report on a NewTek NDI discovery service.

An instance of a module is a panel. Multiple panels of the same type can co-exist in BUG. Learn more about [developing](./pages/development) your own below;

-   [Architecture](./pages/architecture.html)
-   [Project Layout](/pages/development/layout.html)
-   [Coding Style](/pages/development/style.html)

# Open Source

BUG is just one of many Open Source projects at the BBC. Check out the full catalog - [https://www.bbc.co.uk/opensource/](https://www.bbc.co.uk/opensource/).
