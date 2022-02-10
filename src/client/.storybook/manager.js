// .storybook/manager.js

import { addons } from "@storybook/addons";
import bugTheme from "./BugTheme";

addons.setConfig({
    theme: bugTheme,
});
