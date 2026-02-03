---
title: Core Principles
parent: Architecture
nav_order: 0
layout: page
---

# Core Principles

- Each module is self-contained: one module per function.
- Modules are designed to be independent but can interact via APIs if needed.
- Focus on simplicity: aim to implement ~80% of a device’s functionality.
- BUG is mobile-first: UI components are designed to scale across screen sizes.
- Performance matters: consider the load on devices and frequency of data polling.
- Modules run in Docker containers, isolating their backend logic from the core system.
- Module memory is volatile: any temporary data should not be relied upon for persistent state.
