# Workers

Workers exist within the core BUG application and within each module container. They are a way of running concurrent tasks in the background of a container. They are commonly used throughout BUG to periodically fetch data from an end device and update a database entry.

Any JavaScript file inside a folder named `workers` within the root folder of a module will be automatically run by the centrally avalible `Worker Manager`.

-   Separate each into separate worker
-   WorkerData
-   restarting
-   console.log
-   fail and restart
-   using workers to fetch data from other panels
