// scripts/generateMuiIcons.js
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ignore these icons
const VARIANTS = ["Outlined", "Rounded", "Sharp", "TwoTone"];

// resolve the folder where @mui/icons-material lives
const muiIconsFolder = path.dirname(
    // resolve any single JS file, here we pick "Home.js"
    fileURLToPath(new URL('../../../node_modules/@mui/icons-material/Home.js', import.meta.url))
);

// output registry file
const outFile = path.resolve(__dirname, "..", "..", "client", "src", "utils", "muiIconMap.js");

// read all .js files in package folder
const files = fs
    .readdirSync(muiIconsFolder)
    .filter((f) => f.endsWith(".js") && f !== "index.js")
    .filter((f) => {
        const iconName = f.replace(".js", "");
        // exclude if ends with any variant
        return !VARIANTS.some((v) => iconName.endsWith(v));
    });

// generate imports and map
const imports = files
    .map((f) => {
        const iconName = f.replace(".js", "");
        return `import ${iconName} from '@mui/icons-material/${iconName}';`;
    })
    .join("\n");

const mapEntries = files
    .map((f) => {
        const iconName = f.replace(".js", "");
        return `  "${iconName}": ${iconName}`;
    })
    .join(",\n");

const content = `
${imports}

export const muiIcons = {
${mapEntries}
};
`;

fs.writeFileSync(outFile, content);
console.log(`Generated ${files.length} MUI icons at ${outFile}`);
