---
layout: page
title: Codex Poller
parent: Modules
nav_order: 2
---

# Codex Poller

Internally we store all our encoder and decoder endpoints in a large database with a RestAPI - called codex.

How the data is stored is irrelevant but by providing a list of codec data formatted in a particular way allows you to get a viewable list of all your endpoints.

More useful than that is the ability to link this module with other 'codec' modules. Then rather than providing an IP address and port manually to each codec you can pick from a dropdown list available in the database.

To help you get started with your own database here's a brief overview of our implementation.

Our endpoint looks something like this - `http://codec.database.com/api/device/`

```json
[
    {
        "id": "test-ip-decoder",
        "hostname": "test-ip-decoder.local",
        "name": "Test IP Decoder",
        "address": "192.168.0.1",
        "location": "Head Office",
        "description": "Evertz IP-ASI",
        "model": "7880",
        "manufacturer": "Evertz",
        "notes": "Example showing how to build a codec database",
        "tags": ["decoder"],
        "endpoints": [
            {
                "id": "test-ip-decoder-01",
                "name": "Test IP Decoder (Internal Address)",
                "zones": ["internal"],
                "capabilities": ["rtp", "udp", "h264", "aac"],
                "address": "192.168.0.1",
                "port": 5090
            },
            {
                "id": "test-ip-decoder-02",
                "name": "Test IP Decoder (Public Address)",
                "zones": ["internet"],
                "capabilities": ["rtp", "udp", "h264", "aac"],
                "address": "88.88.88.88",
                "port": 5090
            }
        ]
    }
]
```
