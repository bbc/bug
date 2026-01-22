---
layout: home
title: Home
nav_order: 1
---

# BUG

**Broadcast Universal Gateway**

[![BUG Deploy](https://github.com/bbc/bug/actions/workflows/deploy.yml/badge.svg)](https://github.com/bbc/bug/actions/workflows/deploy.yml)
[![Documentation](https://github.com/bbc/bug/actions/workflows/documentation.yml/badge.svg)](https://github.com/bbc/bug/actions/workflows/documentation.yml)

BUG is a web-based system for **controlling and monitoring broadcast and media equipment from a single interface**.

Run BUG on a server within your network and access it through a browser. From one web page, you can add panels to control and observe a wide range of devices and services — including network switches, video and audio codecs, video matrices, and more.

![BUG Home Screenshot](/bug/assets/images/screenshots/bug-home.png)

## Getting started

- [Installation](./pages/installation) — Install BUG on any supported operating system
- [Modules](./pages/modules) — See which devices and services can be controlled, and what functionality is available

## Component Library

View the BUG **component library** (React components, panels, and UI elements) in [Storybook](/bug/storybook/).

## Development

BUG is designed to be extended. We welcome [development](./pages/development) of additional modules that add new control or monitoring capabilities.

A **module** typically represents a specific piece of hardware or service. For example:

- a module for controlling Blackmagic Videohub matrices
- a module for monitoring a NewTek NDI discovery service

Each module can be instantiated one or more times as **panels** within the BUG interface, allowing multiple devices of the same type to be controlled simultaneously.

To learn more about developing your own modules, see:

- [Architecture](./pages/architecture.html)
- [Project layout](./pages/development/layout.html)
- [Coding style](./pages/development/style.html)

## Open source

BUG is one of many open source projects developed at the BBC.  
Explore the full catalogue at [https://www.bbc.co.uk/opensource/](https://www.bbc.co.uk/opensource/).
