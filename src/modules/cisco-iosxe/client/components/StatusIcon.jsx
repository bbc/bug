import BugNetworkIcon from "@core/BugNetworkIcon";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";

export default function StatusIcon({ status }) {
    if (status === "err-disable") {
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
    return <BugNetworkIcon disabled={status !== "if-oper-state-ready"} />;
}
