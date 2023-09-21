-   document api version in api calls
-   only SD/HD resolutions are currently supported
-   only integer bitrates are currently supported
-   only supports ipv4
-   we don't support multiple IP cards when creating outputs (yet)
-   audio add profile id is hardcoded
-   add j2k encoder tab
-   add j2k decoder tab
-   add ability to change LED color
-   use a hashed id to ignore localdata when device changes

so ... on weds 20th

maybe input buffer and dejitter buffer? - set in dialog with helpful text and live values to help
allow configuring of source IPs? Maybe only in config page
allow changing of decoder input (autofirst, ip input etc)
after device has been unavailable, it won't connect as there's a bearer token error - needs a restart - I think I've fixed this but needs testing
Need to show if configured audio doesn't match source stream

-   need to think about how we change into/out of ultra low for encodes
-   audios in list should say 1 of 2 etc
