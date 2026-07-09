---
title: Live Validation
parent: Development
nav_order: 2
layout: page
---

Each container can optionally support live config validation. This should be via a RESTful API endpoint at
`/container/[panelid]/validate/[field]`.

The request body should contain the current field value and any dependent fields the validator needs to evaluate the
request correctly. For example:

```
{ "address": "1.2.3.4", "password": "changeme", "username": "admin"}
```

The validator should use that payload to check the current configuration state. The response should always be a
successful API response containing a `validationResults` array.

The client treats each completed validation response as the latest state for the form. That means:

- Older validation results are discarded when a new response arrives.
- Dependent fields should be included in the request payload so the server can validate them together.
- The response should include every field that should currently be shown as valid or invalid for that request.

## Response Shape

## Example 1 - Success

{"status": "success", "data": { "validationResults": [] }}

## Example 2 - Failure

```
{"status": "success", "data": { "validationResults": [
   { "state": false, "field": "address", "message": "Device not reachable"}
] }}
```

## Example 3 - Failure

```
{"status": "success", "data": { "validationResults": [
   { "state": false, "field": "username", "message": "Could not log in to device"},
   { "state": false, "field": "password", "message": "Could not log in to device"}
] }}
```

## Notes

- A validation result with `state: true` is shown as a green success message in the form.
- A validation result with `state: false` is shown as an error for that field.
- If a field is still being checked, the UI may show a temporary `Checking...` message while the request is in flight.
