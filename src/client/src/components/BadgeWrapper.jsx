import React from "react";
import Badge from "@mui/material/Badge";
import { makeStyles } from "@mui/styles";
import FaviconNotification from "@utils/FaviconNotification";

const faviconNotification = new FaviconNotification();

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
    let criticalCount = 0;

    if (panel?._status) {
        criticalCount = panel._status.filter((x) => x.type === "critical").length;
        errorCount = panel._status.filter((x) => x.type === "error").length;
        warningCount = panel._status.filter((x) => x.type === "warning").length;
        infoCount = panel._status.filter((x) => x.type === "info").length;
    }

    if (criticalCount > 0) {
        faviconNotification.critical();
        return (
            <Badge className={classes.error} badgeContent={criticalCount} anchorOrigin={position}>
                {children}
            </Badge>
        );
    }

    if (errorCount > 0) {
        faviconNotification.error();
        return (
            <Badge className={classes.error} badgeContent={errorCount} anchorOrigin={position}>
                {children}
            </Badge>
        );
    }

    if (warningCount > 0) {
        faviconNotification.warning();
        return (
            <Badge className={classes.warning} badgeContent={warningCount} anchorOrigin={position}>
                {children}
            </Badge>
        );
    }

    if (infoCount > 0) {
        faviconNotification.info();
        return (
            <Badge className={classes.info} badgeContent={infoCount} anchorOrigin={position}>
                {children}
            </Badge>
        );
    }

    return children;
};

export default BadgeWrapper;
