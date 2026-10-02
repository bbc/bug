# AJA KUMO Router

Control an AJA KUMO video router over its HTTP configuration API. The module
queries the router for its input and output counts and uses the reported
dimensions to fetch labels, show current routes, and validate route commands.
This supports the KUMO 16x16, 16x4, 32x32, 32x4, and 64x64 families, including
their 12G variants.

## Setup

Configure the router's hostname or IP address in the panel settings. The default
HTTP port is 80. Enter a password only if authentication is enabled on the KUMO.

Source and destination labels are fetched from the router automatically and
refreshed while the panel is open. The panel displays the currently routed
source for each destination; select a destination and then a source to make a
take. Routers reporting more than 64 inputs or outputs, or invalid dimensions,
are rejected with an explicit error.

Use the panel's **Edit** mode to rename source and destination labels, lock
destinations, and create named source or destination groups. Labels are written
to the router. Destination locks use the KUMO hardware lock and locked outputs
remain visible but cannot be selected for routing. Sources cannot be locked.
Groups filter the displayed ports and are saved in the panel configuration.

A dedicated worker polls router state every five seconds and stores the result
in the panel database. Panel APIs and the video-router capability read this
cache rather than polling the router on each request. Successful route commands
update the cached state immediately; a subsequent worker poll confirms the
device's current state.

## Development

- `client/` contains the BUG panel and configuration UI.
- `container/` contains the HTTP API adapter and BUG video-router capability.
- Matrix dimensions are read from the router on each state poll; port labels
  are cached briefly and refreshed automatically.
