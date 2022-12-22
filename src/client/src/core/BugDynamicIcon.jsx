import * as React from "react";
import * as Icons from "@mui/icons-material/";
import * as MDIIcons from "mdi-material-ui";
import { useTheme } from "@mui/material/styles";

function upperFirst(string) {
    return string.slice(0, 1).toUpperCase() + string.slice(1, string.length);
}

function fixIconNames(string) {
    const name = string.split("-").map(upperFirst).join("");
    if (name === "3dRotation") {
        return "ThreeDRotation";
    } else if (name === "4k") {
        return "FourK";
    } else if (name === "360") {
        return "ThreeSixty";
    } else if (name === "AxisXyArrowLock") {
        return "AxisXYArrowLock";
    }
    return name;
}

export default function BugDynamicIcon({ iconName, color }) {
    const theme = useTheme();

    if (!color) {
        color = theme.palette.text.primary;
    }

    const isMDI = (name) => {
        if (name.split("-")[0] === "mdi") {
            return true;
        }
        return false;
    };

    return React.useMemo(() => {
        let Icon;
        if (isMDI(iconName)) {
            const fixedIconName = fixIconNames(iconName.replace("mdi-", ""));
            Icon = MDIIcons[fixedIconName];
            if (!Icon) {
                console.error(`MDI Icon ${fixedIconName} not found`);
                return null;
            }
        } else {
            const fixedIconName = fixIconNames(iconName);
            Icon = Icons[fixedIconName];
            if (!Icon) {
                console.error(`Icon ${fixedIconName} not found`);
                return null;
            }
        }
        return <Icon style={color ? { color: color } : {}} />;
    }, [color, iconName]);
}
