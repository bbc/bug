import { Avatar } from "@mui/material";
import getGravatarUrl from "@utils/getGravatarUrl";
import getInitials from "@utils/getInitials";

const nameToColor = (name) => {
    let hash = 0;
    let i;

    /* eslint-disable no-bitwise */
    for (i = 0; i < name.length; i += 1) {
        hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }

    let color = "#";

    for (i = 0; i < 3; i += 1) {
        const value = (hash >> (i * 8)) & 0xff;
        color += `00${value.toString(16)}`.slice(-2);
    }
    /* eslint-enable no-bitwise */

    return color;
};

export default function BugAvatar({ email, name, sx = { width: "24px", height: "24px" } }) {
    return (
        <Avatar
            sx={{
                ...{
                    bgcolor: nameToColor(name),
                    fontSize: "0.9rem",
                },
                ...sx,
            }}
            src={getGravatarUrl(email)}
        >
            {getInitials(name)}
        </Avatar>
    );
}
