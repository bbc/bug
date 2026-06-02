// .storybook/manager.js

import { addons } from "@storybook/manager-api";
import bugTheme from "./BugTheme";

addons.setConfig({
    theme: bugTheme,
    sidebar: {
        collapsedRoots: ['bug-core'],
        showStoriesView: false,
    },
});
