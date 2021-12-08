# Development - Coding Style

Mostly along AirBNB NodeJS style guide: https://github.com/airbnb/javascript

## Naming

-   The core service is referred to as the 'system'
-   'settings' are for whole system configuration.
-   Panels are 'edited'.
-   Changes are 'saved'.
-   A 'module' is a capability of BUG, normally device control.
-   'panel' is an instance of a module.
-   'config' is an individual panel configuration.

## Guidelines

-   Return as early as possible from methods with conditionals, rather than deeply nested ifs and brackets - Return Early, Return Simple.
-   Destructure props and object as early as possible - it helps code readability
-   Use unambiguous variable names - eg 'returnedDeviceDetails' rather than 'item'
-   Good, obvious code shouldn't need comments, but feel free to add them
