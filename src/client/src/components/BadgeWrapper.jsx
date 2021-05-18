import React from "react";
import Badge from "@material-ui/core/Badge";

const BadgeWrapper = ({
    panel,
    children,
    position = {
        vertical: "top",
        horizontal: "right",
    },
}) => {
    let errorCount = panel._status.filter((x) => x.type === "error").length;
    let warningCount = panel._status.filter((x) => x.type === "warning").length;
    let infoCount = panel._status.filter((x) => x.type === "info").length;
    let hasCritical = panel._status.filter((x) => x.type === "critical").length > 0;

    if (errorCount > 0 && !hasCritical) {
        return (
            <Badge badgeContent={errorCount} color="error" anchorOrigin={position}>
                {children}
            </Badge>
        );
    }

    if (warningCount > 0 && !hasCritical) {
        return (
            <Badge badgeContent={warningCount} color="warning" anchorOrigin={position}>
                {children}
            </Badge>
        );
    }

    if (infoCount > 0 && !hasCritical) {
        return (
            <Badge badgeContent={infoCount} color="info" anchorOrigin={position}>
                {children}
            </Badge>
        );
    }

    return children;
};

export default BadgeWrapper;
