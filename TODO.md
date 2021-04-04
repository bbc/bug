- Authentication
* with usernames/passwords?
* with number codes? (for touch screen)

- Instances
* management
* upgrades

- add caching
[*] move package.json fields into module.json? In case we don't use nodejs

[*] API proxy setting in package.json doesn't use .env value - 3101 is hard coded

[*] ignore dockerfiles in modules but not main
- if a user manually removes an image, the UI/buildstatus field will be wrong. Do we care?

- we could use the api checksum (not yet implemented) and compare it to the checksum we can pass using axios - and long poll if it hasn't changed

- add locking so that we don't end up building the same module in parallel when you start more than one container at once

[*] change module port to 3200 so you can run it up while still running bug in docker?