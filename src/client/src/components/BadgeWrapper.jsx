import React from "react";
import Badge from "@material-ui/core/Badge";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
    error: {
        "& .MuiBadge-badge": {
            backgroundColor: theme.palette.error.main,
        },
    },
    warning: {
        "& .MuiBadge-badge": {
            backgroundColor: theme.palette.warning.main,
        },
    },
    info: {
        "& .MuiBadge-badge": {
            backgroundColor: theme.palette.info.main,
        },
    },
}));

const BadgeWrapper = ({
    panel,
    children,
    position = {
        vertical: "top",
        horizontal: "right",
    },
}) => {
    const classes = useStyles();

    let errorCount = 0;
    let warningCount = 0;
    let infoCount = 0;
    let hasCritical = 0;

    if (panel?._status) {
        errorCount = panel._status.filter((x) => x.type === "error").length;
        warningCount = panel._status.filter((x) => x.type === "warning").length;
        infoCount = panel._status.filter((x) => x.type === "info").length;
        hasCritical =
            panel._status.filter((x) => x.type === "critical").length > 0;
    }

    if (errorCount > 0 && !hasCritical) {
        return (
            <Badge
                className={classes.error}
                badgeContent={errorCount}
                anchorOrigin={position}
            >
                {children}
            </Badge>
        );
    }

    if (warningCount > 0 && !hasCritical) {
        return (
            <Badge
                className={classes.warning}
                badgeContent={warningCount}
                anchorOrigin={position}
            >
                {children}
            </Badge>
        );
    }

    if (infoCount > 0 && !hasCritical) {
        return (
            <Badge
                className={classes.info}
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
