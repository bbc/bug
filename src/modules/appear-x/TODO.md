-   use proper api version in api calls
-   only SD/HD resolutions are currently supported
-   only integer bitrates are currently supported
-   only supports ipv4
-   we don't support multiple IP cards when creating outputs (yet)
-   audio add profile id is hardcoded
-   add j2k encoder tab
-   add j2k decoder tab
-   add ability to change LED color
-   add protectedservices feature
-   use a hashed id to ignore localdata when device changes

so ... on thurs 14th...

decode is mostly working, including ip input status
need to put it in UI
I was thinking of separating seamless and non-seamless.
for seamless, it should be red if syncronised = false
also show bitrates for each stream
and overall bitrate in separate column
and resolution

-   if set to follow video then AUTO on top, detected video underneath
-   if manual then red if mismatch, white if ok
    rtpErrors?
    ccErrors?
    serviceName could go underneath output name (like LLDP)
    FEC column as well
    do we care about dejitter?
    maybe input buffer and dejitter buffer? - set in dialog with helpful text and live values to help
    allow configuring of source IPs? Maybe only in config page
    Allow changing of decoder input (autofirst, ip input etc)
