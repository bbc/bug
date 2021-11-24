import React from "react";
import Badge from "@mui/material/Badge";

const BadgeWrapper = ({
    panel,
    children,
    position = {
        vertical: "top",
        horizontal: "right",
    },
}) => {
    let errorCount = 0;
    let warningCount = 0;
    let infoCount = 0;
    let criticalCount = 0;

    if (panel?._status) {
        criticalCount = panel._status.filter((x) => x.type === "critical").length;
        errorCount = panel._status.filter((x) => x.type === "error").length;
        warningCount = panel._status.filter((x) => x.type === "warning").length;
        infoCount = panel._status.filter((x) => x.type === "info").length;
    }

    if (criticalCount > 0) {
        return (
            <Badge
                sx={{
                    "& .MuiBadge-badge": {
                        backgroundColor: "error.main",
                    },
                }}
                badgeContent={criticalCount}
                anchorOrigin={position}
            >
                {children}
            </Badge>
        );
    }

    if (errorCount > 0) {
        return (
            <Badge
                sx={{
                    "& .MuiBadge-badge": {
                        backgroundColor: "error.main",
                    },
                }}
                badgeContent={errorCount}
                anchorOrigin={position}
            >
                {children}
            </Badge>
        );
    }

    if (warningCount > 0) {
        return (
            <Badge
                sx={{
                    "& .MuiBadge-badge": {
                        backgroundColor: "warning.main",
                    },
                }}
                badgeContent={warningCount}
                anchorOrigin={position}
            >
                {children}
            </Badge>
        );
    }

    if (infoCount > 0) {
        return (
            <Badge
                sx={{
                    "& .MuiBadge-badge": {
                        backgroundColor: "info.main",
                    },
                }}
                badgeContent={infoCount}
                anchorOrigin={position}
            >
                {children}
            </Badge>
        );
    }

    return children;
};

export default BadgeWrapper;
