# BUG modulebuilder

This folder is used to provide templates for BUG modulebuilder.

Each folder should contain the following items:

-   a `builder.json` file containing metadata for the template
-   a `src` folder containing:
    -   `container` - optional files to be built into a docker container
    -   `client` - ReactJS files to be compiled into front-end code
    -   `module.json` - metadata file for the module

modulebuilder will prompt for the items listed in `fields`, and search `templatedfiles` for matching template tags replacing any that it finds.

Here's an example `builder.json` file:

```
{
    "name": "my-template",
    "description": "Example Template",
    "version": "1.0.0",
    "author": "Your Name",
    "templatedfiles": [
        "module.json"
    ],
    "fields": [
        {
            "name": "name",
            "message": "Please enter a module name",
            "type": "input",
            "required": "true",
            "default": "MyModuleName"
        },
        {
            "name": "version",
            "message": "Please enter the module version",
            "type": "input",
            "required": "true",
            "default": "1.0.0"
        }
    ],
}
```

modulebuilder uses Inquirer.js for command line input. Look at their GitHub page for information about field types:
https://github.com/SBoudrias/Inquirer.js
All name/value pairs inside each field element will be passed to inquirer.js - allowing you to specify defaults, filters and validation rules.

## How to use

From the bug /src folder:

```
npm run modulebuilder
```
