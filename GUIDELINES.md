nodejs

Mostly along AirBNB NodeJS style guide:
https://github.com/airbnb/javascript

* prefer const and let (no vars)


- routes 
* should contain route logic 
* if request params are needed, they should be taken out here
* no req or resp should be passed to services
* should return http error codes if problem
* no logging?

- services
* one file for each service 'user', 'config', 'docker'
* lots of business logic
* can combine results from multiple sources
* or just direct model
* may well be complex

- models
* read a file, access a db, save a file etc
* divided up by logical group, but includes all CRUD for that thing
* no business logic - access only

- modules
* the following api endpoints should be defined:
* /api/status - returns an array including:
-* state: 'starting', 'ready', 'failed'

* /api/config - should be able to receive a config object and save it locally

* module logging should be to console only
* module APIs must follow JSON output standard (status, data, error)