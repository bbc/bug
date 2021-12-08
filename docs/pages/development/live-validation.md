# Development - Live Validation

Each container can optionally support live config validation. This should be via a RESTful API endpoint at
`/container/[panelid]/validate/[field]` with the following form data.

A JSON-encoded object containing one or more name-value pairs eg:

```
{ "address": "1.2.3.4", "password": "changeme", "username": "admin"}
```

This form data can be used by the validator to test configuration.

It should always return a successful API response containing:

## Example 1 - Success

{"status": "success", "data": { "result": true, "fielderrors": [] }}

## Example 2 - Failure

```
{"status": "success", "data": { "result": false, "fielderrors": [
   { "name": "address", "message": "Device not reachable"}
] }}
```

## Example 3 - Failure

```
{"status": "success", "data": { "result": false, "fielderrors": [
   { "name": "username", "message": "Could not log in to device"},
   { "name": "password", "message": "Could not log in to device"}
] }}
```
