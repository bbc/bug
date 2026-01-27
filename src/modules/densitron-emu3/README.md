# Densitron EMU3

> NOTE: This module has been archived and is no longer supported.

## Overview

This module provides an interface to control multiple encode or decode channels on an Appear X chassis.

The Appear UI can be fiddly to use, and difficult to adjust quickly. With this module you can easily change bitrate, colour space, audio channels, and latency with a couple of clicks.

## Configuration

| Field              | Default Value      | Description                                                           |
| ------------------ | ------------------ | --------------------------------------------------------------------- |
| `id`               | `""`               | Unique identifier for this module instance (usually auto-generated).  |
| `needsConfigured`  | `true`             | Indicates whether the module has been configured since build.         |
| `title`            | `""`               | Human-readable title for this module instance, shown in the UI.       |
| `module`           | `"densitron-emu3"` | Internal name of the module.                                          |
| `description`      | `""`               | Optional text describing the module instance in the UI.               |
| `notes`            | `""`               | Free-text field for extra notes about this configuration.             |
| `address`          | `""`               | IP address or hostname of the device.                                 |
| `snmpCommunity`    | `""`               | SNMP community used to access the device.                             |
| `protectedOutputs` | `[]`               | An array of output names which are protected from accidental changes. |
