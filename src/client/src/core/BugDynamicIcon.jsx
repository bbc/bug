import { Suspense } from "react";
import { iconMap } from "../utils/iconMappings";

export default function DynamicIcon({ iconName, sx = {}, color }) {
    const IconComponent = iconMap[iconName];

    if (!IconComponent) {
        console.error(`Icon "${iconName}" not found in iconMap`);
        return null;
    }

    return (
        <Suspense fallback={null}>
            <IconComponent sx={sx} style={color ? { color } : {}} />
        </Suspense>
    );
}
