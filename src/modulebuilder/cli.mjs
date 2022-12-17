import inquirer from "inquirer";
import fs from "fs-extra";
import ejs from "ejs";
import glob from "glob";
import path from "path";

const main = async () => {
    const template = await selectTemplate();
    if (!template) {
        return;
    }

    // ask the user some questions from the 'fields' array
    const answeredFields = await inquirer.prompt(template.fields);

    // make sure the folder doesn't already exist
    if (fs.existsSync(`./modules/${answeredFields.name}`)) {
        console.log(`ERROR: module name '${answeredFields.name}' already exists`);
        return;
    }

    // get a list of files to copy
    const allFiles = getFiles(`./modulebuilder/${template.name}/src/`);

    for (const eachFilename of allFiles) {
        const trimmedFilename = eachFilename.replace(`modulebuilder/${template.name}/src`, "");
        if (trimmedFilename) {
            const destFilename = `./modules/${answeredFields.name}${trimmedFilename}`;

            // copy the file first (to make the the folder is created)
            try {
                await fs.copy(`./${eachFilename}`, destFilename);
                console.log(`COPY ./${eachFilename} -> ${destFilename} : OK`);

                // then we can check if the file needs to be templated
                const trimmedFilenameWithoutLeadingOrTrailingSlash = trimmedFilename
                    .split("/")
                    .filter((v) => v !== "")
                    .join("/");

                if (template.files.includes(trimmedFilenameWithoutLeadingOrTrailingSlash)) {
                    // we'll do a template tag replace on this
                    const file = fs.readFileSync(eachFilename).toString();
                    const processedFile = ejs.render(file, answeredFields);

                    // write the file to disk (overwriting non-templated version)
                    console.log(`MODIFY ${destFilename}`);
                    await fs.writeFile(destFilename, processedFile);
                }
            } catch (error) {
                console.log(`COPY ./${eachFilename} -> ${destFilename} : FAILED`);
            }
        }
    }

    console.log(`--- COMPLETE ---\n`);
    console.log("Please restart/rebuild the BUG application before using the new module\n");
};

const getFiles = (baseSrc) => {
    return glob.sync(path.join(baseSrc, "/**"), {
        onlyFiles: true,
        //  ignore: ["node_modules/**", ".zero/**"]
    });
};

const selectTemplate = async () => {
    // list available templates
    const templates = getTemplates();
    if (!templates) {
        return;
    }

    if (templates.length === 1) {
        return templates[0];
    }

    // select template
    const result = await inquirer.prompt([
        {
            type: "list",
            name: "selectedTemplate",
            message: "Pick a module template to use",
            choices: templates.map((template) => `${template.name} - ${template.description}`),
        },
    ]);
    return templates.find((template) => `${template.name} - ${template.description}` === result.selectedTemplate);
};

const getTemplates = () => {
    const templates = [];

    // get a list of folders available
    const folders = fs
        .readdirSync("./modulebuilder", { withFileTypes: true })
        .filter((dirent) => dirent.isDirectory())
        .map((dirent) => dirent.name);
    if (folders) {
        for (const eachFolder of folders) {
            const builderFile = fs.readFileSync(`./modulebuilder/${eachFolder}/builder.json`).toString();
            if (builderFile) {
                const parsedBuilderFile = JSON.parse(builderFile);
                if (parsedBuilderFile) {
                    templates.push(parsedBuilderFile);
                }
            }
        }
    }
    return templates;
};

main();
