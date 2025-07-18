import PowerSettingsNew from "@mui/icons-material/PowerSettingsNew";

export default function BugPowerIcon({ disabled = false, sx = {}, activeColor = "primary.main" }) {
    return (
        <PowerSettingsNew
            sx={{
                color: disabled ? "#ffffff" : activeColor,
                opacity: disabled ? 0.1 : 1,
                display: "block",
                margin: "auto",
                ...sx,
            }}
        />
    );
}
