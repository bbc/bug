# Development - UX

A list of things to consider when designing your module.

## Modifying Device State

When users change the state of a device, this will usually be a PUT or GET request to the container API.
A service will submit the change to the device.
If the result is successful, you should update any local state (eg in a database) optimistically. In other words, you should assume it's worked.
If for some reason the device state fails to change (or reverts) this will be caught on your next poll.
