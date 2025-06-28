import BoltIcon from "@mui/icons-material/Bolt";

export default function BugPoeIcon({ disabled = false, active = false, error = false, sx = {} }) {
    let color = "primary.main";
    let opacity = 0.5;
    if (disabled) {
        color = "#ffffff";
        opacity = 0.1;
    } else if (error) {
        color = "error.main";
        opacity = 1;
    } else if (active) {
        color = "success.main";
        opacity = 1;
    }
    return (
        <BoltIcon
            sx={{
                color: color,
                opacity: opacity,
                display: "block",
                margin: "auto",
                ...sx,
            }}
        />
    );
}
