<div align="center">

<img src="https://github.com/bbc/bug/blob/main/src/client/public/icons/bug-logo-256x256.png?raw=true" alt="BUG Logo" width="128" />

# BUG — Broadcast Universal Gateway

**One web interface to control and monitor all your broadcast and media equipment.**

[![BUG Client Tests](https://github.com/bbc/bug/actions/workflows/test-bug-client.yml/badge.svg)](https://github.com/bbc/bug/actions/workflows/test-bug-client.yml)
[![Module Container Tests](https://github.com/bbc/bug/actions/workflows/test-module-container.yml/badge.svg)](https://github.com/bbc/bug/actions/workflows/test-module-container.yml)
[![BUG Server Tests](https://github.com/bbc/bug/actions/workflows/test-bug-server.yml/badge.svg)](https://github.com/bbc/bug/actions/workflows/test-bug-server.yml)
[![Deploy](https://github.com/bbc/bug/actions/workflows/deploy.yml/badge.svg)](https://github.com/bbc/bug/actions/workflows/deploy.yml)
[![Documentation](https://github.com/bbc/bug/actions/workflows/documentation.yml/badge.svg)](https://github.com/bbc/bug/actions/workflows/documentation.yml)
[![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)

[Documentation](https://bbc.github.io/bug) · [Installation](https://bbc.github.io/bug/pages/installation/) · [Module Library](https://bbc.github.io/bug/modules) · [Contributing](https://bbc.github.io/bug/pages/development/)

</div>

---

![BUG Screenshot](https://github.com/bbc/bug/blob/main/docs/assets/images/screenshots/bug-home.png?raw=true)

## What is BUG?

BUG is a self-hosted, Docker-based web application built at the BBC for controlling and monitoring broadcast and media equipment from a single browser interface.

Run BUG on any server in your network. From one page, operators can add **panels** — each panel represents a device or service and provides real-time control and status. Multiple panels of the same type can run simultaneously, so you can manage entire fleets of devices from one screen.

## Features

- **45+ ready-made modules** covering switches, codecs, matrices, clocks, and more
- **Panel-based UI** — add, arrange, and configure devices without writing code
- **Docker-native** — each module runs in its own isolated container
- **Swagger API** — every action and status is accessible via a documented REST API
- **Role-based access** — control who can view or operate each panel
- **Extensible** — build your own modules using the provided scaffolding and component library

## Quick Start

Requires [Docker](https://docs.docker.com/get-docker/) and [Docker Compose](https://docs.docker.com/compose/install/).

```bash
curl -o docker-compose.yml https://raw.githubusercontent.com/bbc/bug/main/docker-compose.yml
docker compose up -d
```

Then open [http://localhost](http://localhost) in your browser.

For full installation options (Linux, macOS, production hardening) see the [Installation Guide](https://bbc.github.io/bug/pages/installation/).

## Supported Modules

<!-- MODULES_START -->

| Module                 | Description                                                                |
| ---------------------- | -------------------------------------------------------------------------- |
| `arista-switch`        | Monitoring and control of Arista switches                                  |
| `audio-player`         | Audio Player                                                               |
| `bmd-multiview16`      | Configure Blackmagic multiviewers with auto labelling                      |
| `bmd-videohub`         | Control and monitor Blackmagic videohub devices                            |
| `cisco-c1300`          | Monitoring and control of Cisco C1300 series switches                      |
| `cisco-cbs`            | Monitoring and control of Cisco CBS-series small business switches         |
| `cisco-iosxe`          | Monitoring and control of Cisco IOS-XE based switches                      |
| `cisco-sg`             | Monitoring and control of Cisco SG-series switches                         |
| `clock`                | Digital and Analogue Clocks                                                |
| `codec-apipoller`      | Polls API endpoint to retrieve codec information                           |
| `comrex-briclink`      | Control of Comrex BRIC-Link and BRIC-Link II devices                       |
| `dish-pointer`         | Get the Azimuth and Elevation to point a Satellite Dish                    |
| `dtc-prorx`            | Control DTC radio camera receivers                                         |
| `exterity`             | Channel list server and device manager for exterity STBs                   |
| `hitomi-matchbox`      | Control of the Hitomi Matchbox ident generator                             |
| `links`                | Link to other services                                                     |
| `magewell-encode-sdi`  | Control and monitoring of Magewell SRT encoders                            |
| `magewell-ndi-decoder` | Control NDI Sources on Magewell Devices                                    |
| `mikrotik-dhcp`        | View and manage DHCP leases on Mikrotik routers                            |
| `mikrotik-interfaces`  | Monitoring and control of mikrotik interfaces                              |
| `mikrotik-sdwan`       | Multiple WAN manager for Mikrotik routers                                  |
| `mikrotik-traceroute`  | Run a Traceroute from your MikroTik Router                                 |
| `ndi-discovery`        | Get a list of NDI sources on a network from your nearest discovery server  |
| `netgear-avline`       | Control and monitoring of Netgear AV Line ethernet switches                |
| `notes`                | A scribble pad - write your thoughts or a novel                            |
| `ntt-mve5000`          | Control of NTT MVE5000 encoders                                            |
| `obe-c100`             | Control of Open Broadcast Systems' C-100 Encoders                          |
| `onair-clock`          | HTML Based On Air clock for rendering with OBS or CasparCG                 |
| `pinger`               | Monitor network devices                                                    |
| `prodigy-mx`           | Control of the Prodigy MX audio router                                     |
| `rss-feed`             | Show the latest posts from an RSS feed                                     |
| `speedtest-net`        | Speedtest.net test from your server to determine upload and download speed |
| `tieline-gateway`      | Control and monitor Tieline Gateway codecs                                 |
| `tsl-mdu`              | Monitoring and control of TSL MDUs                                         |
| `turtle-chazy`         | Turtle Chazy Dante Controller                                              |
| `unifi-controller`     | Interact with a Unifi Controller                                           |
| `video-player`         | HLS, DASH and Web Video Player                                             |
| `vislink-lynx`         | Control VisLink radio camera receivers                                     |
| `weather`              | Get the Weather on Location                                                |
| `webpage-embed`        | Embed a web page within the BUG UI                                         |
| `xcp-ng`               | Basic control of VMs running on an XCP-ng hypervisor                       |

<!-- MODULES_END -->

## Documentation

Full documentation is available at **[bbc.github.io/bug](https://bbc.github.io/bug)**, including:

- [Installation](https://bbc.github.io/bug/pages/installation/) — production and development setup
- [Architecture](https://bbc.github.io/bug/pages/architecture/) — how BUG is structured
- [Module Development](https://bbc.github.io/bug/pages/development/) — build your own modules
- [API Reference](http://yourlocalip/api/documentation) — Swagger UI on any BUG instance
- [Component Library](https://bbc.github.io/bug/storybook/?path=/docs/bug-core-introduction--documentation) — Storybook UI components

## Contributing

Contributions are welcome. Whether it's a new module, a bug fix, or documentation improvement — see the [Development Guide](https://bbc.github.io/bug/pages/development/) to get started.

BUG is one of many open source projects developed at the BBC. See the full catalogue at [bbc.co.uk/opensource](https://www.bbc.co.uk/opensource/).

## License

Licensed under the [Apache License 2.0](LICENSE.md).

Copyright © BBC 2022 — Geoff House, Ryan McCartney
