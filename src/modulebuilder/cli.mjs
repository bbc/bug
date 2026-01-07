import ejs from "ejs";
import fs from "fs-extra";
import glob from "glob";
import inquirer from "inquirer";
import path from "path";

const slugify = (text) => {
    return text
        .toString()
        .toLowerCase()
        .trim()
        .replace(/\s+/g, "-")
        .replace(/[^\w-]+/g, "")
        .replace(/--+/g, "-");
};

const getTemplates = () => {
    const builderRoot = "./src/modulebuilder";
    if (!fs.existsSync(builderRoot)) return [];

    return fs.readdirSync(builderRoot, { withFileTypes: true })
        .filter((dirent) => dirent.isDirectory())
        .map((dirent) => {
            const configPath = path.join(builderRoot, dirent.name, "builder.json");
            if (fs.existsSync(configPath)) {
                try {
                    const raw = fs.readFileSync(configPath, "utf8");
                    const parsed = JSON.parse(raw);
                    // ensure the template knows its own folder name
                    return { ...parsed, templateFolderName: dirent.name };
                } catch (e) {
                    console.warn(`skipping "${dirent.name}": Invalid builder.json`);
                }
            }
            return null;
        })
        .filter(Boolean);
};

const selectTemplate = async () => {
    const templates = getTemplates();
    if (templates.length === 0) {
        console.log("No templates found in ./src/modulebuilder");
        return null;
    }

    if (templates.length === 1) return templates[0];

    const { selected } = await inquirer.prompt([
        {
            type: "list",
            name: "selected",
            message: "Pick a module template to use:",
            choices: templates.map((t) => ({
                name: `${t.name} - ${t.description}`,
                value: t,
            })),
        },
    ]);
    return selected;
};

const main = async () => {
    const template = await selectTemplate();
    if (!template) return;

    const answeredFields = await inquirer.prompt(template.fields);

    const moduleSlug = slugify(answeredFields.name);
    const targetDir = path.join(process.cwd(), "src", "modules", moduleSlug);
    const sourceDir = path.join(process.cwd(), "src", "modulebuilder", template.templateFolderName, "src");

    if (fs.existsSync(targetDir)) {
        console.error(`\nERROR: Module '${moduleSlug}' already exists at ${targetDir}`);
        return;
    }

    console.log(`\nBuilding module in: ${targetDir}...\n`);

    // 4. Get files using glob
    const allFiles = glob.sync(path.join(sourceDir, "/**/*"), { nodir: true });

    // 5. Process files in parallel
    await Promise.all(
        allFiles.map(async (filePath) => {
            const relativePath = path.relative(sourceDir, filePath);
            const destPath = path.join(targetDir, relativePath);

            try {
                await fs.ensureDir(path.dirname(destPath));

                // Check if this file needs EJS templating
                const normalizedRelPath = relativePath.replace(/\\/g, "/");
                const shouldTemplate = template.files.includes(normalizedRelPath);

                if (shouldTemplate) {
                    const content = await fs.readFile(filePath, "utf8");
                    const rendered = ejs.render(content, answeredFields);
                    await fs.writeFile(destPath, rendered);
                    console.log(`  CREATE  ${relativePath} (rendered)`);
                } else {
                    await fs.copy(filePath, destPath);
                    console.log(`  COPY    ${relativePath}`);
                }
            } catch (err) {
                console.error(`  FAILED  ${relativePath}:`, err.message);
            }
        })
    );

    console.log(`\n --- COMPLETE ---`);
    console.log(`Module folder: /src/modules/${moduleSlug}`);
    console.log("Please restart/rebuild the BUG application before using the new module.\n");
};

main().catch((err) => {
    console.error("Fatal Error:", err);
});