import BugNetworkIcon from "@core/BugNetworkIcon";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";

export default function StatusIcon({ status }) {
    if (status === "errdisabled") {
        return (
            <ErrorOutlineIcon
                sx={{
                    color: "warning.main",
                    display: "block",
                    margin: "auto",
                    paddingLeft: "1px",
                }}
            />
        );
    }
    return <BugNetworkIcon disabled={status !== "connected"} />;
}
