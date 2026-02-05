import { Icon } from "@iconify/react";
import HelpOutline from "@mui/icons-material/HelpOutline";
import { muiIcons } from "../utils/muiIconMap";

export default function BugDynamicIcon({ iconName, sx = {}, color, size = 24 }) {
    if (!iconName) return null;

    // detect mdi (iconify) icons by prefix
    if (iconName.slice(0, 3) === "mdi") {
        return (
            <Icon
                icon={iconName}
                style={{
                    width: size,
                    height: size,
                    color: color ?? undefined,
                }}
            />
        );
    }

    // lookup mui icons in generated registry
    const MuiIcon = muiIcons[iconName] ?? HelpOutline;

    // override sx height and width with provided size
    if (size !== 24) {
        sx = {
            ...sx,
            height: `${size}px`,
            width: `${size}px`,
        };
    }

    return <MuiIcon sx={sx} style={color ? { color } : undefined} />;
}
