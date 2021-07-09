import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import DynamicIcon from "@core/DynamicIcon";
import { Link } from "react-router-dom";
import Grid from "@material-ui/core/Grid";
import BadgeWrapper from "@components/BadgeWrapper";
import CollapsibleBugAlert from "@components/CollapsibleBugAlert";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import CardContent from "@material-ui/core/CardContent";
import PanelDropdownMenu from "@components/panels/PanelDropdownMenu";

const useStyles = makeStyles((theme) => ({
    header: {
        padding: "8px 0px",
        "&:hover": {
            background: "#333",
        },
        "& .MuiCardHeader-title": {
            color: "rgba(255, 255, 255, 1)",
            fontSize: "1.1rem",
            fontWeight: "500",
            textTransform: "none",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
        },
        "& .MuiCardHeader-subheader": {
            color: "rgba(255, 255, 255, 0.4)",
            fontSize: "0.9rem",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
        },
        "& .MuiCardHeader-action": {
            margin: 0,
            flexShrink: 0,
        },
        "& .MuiCardHeader-avatar": {
            marginLeft: 16,
            flexShrink: 0,
        },
        "& .MuiCardHeader-content": {
            minWidth: 0,
            flexShrink: 1,
        },
    },
    card: {
        backgroundColor: "#262626",
        "&:hover": {
            background: "#333",
        },
        "& .MuiBadge-badge": {
            "@media (min-width:601px)": {
                display: "none",
            },
        },
    },
    tileIcon: {
        color: theme.palette.primary.main,
        // width: 36,
        // height: 36,
        marginTop: 4,
    },
    tileLink: {
        color: "#cccccc",
        textDecoration: "none",
        "&:hover": {
            color: "#fff",
        },
    },
    tileTitle: {
        fontSize: "1.3rem",
        fontWeight: 500,
    },
    content: {
        padding: 0,
        "&:last-child": {
            paddingBottom: 0,
        },
        "@media (max-width:599px)": {
            display: "none",
        },
    },
    gridItem: {
        padding: 12,
        "@media (max-width:1200px)": {
            padding: 8,
        },
        "@media (max-width:1024px)": {
            padding: 4,
        },
        "@media (max-width:600px)": {
            padding: 0,
            paddingBottom: 1,
        },
        "@media (max-height:400px)": {
            padding: 4,
            paddingBottom: 1,
        },
    },
}));

const HomeTile = ({ panel }) => {
    const classes = useStyles();
    if (!panel.enabled) {
        return null;
    }

    const StatusItems = () => {
        return panel._status.map((eachItem) => (
            <CardContent className={classes.content} key={eachItem.key}>
                <CollapsibleBugAlert
                    type={eachItem.type}
                    message={eachItem.message}
                    flags={eachItem.flags}
                    panel={panel}
                    square
                />
            </CardContent>
        ));
    };

    return (
        <Grid item xl={3} lg={4} sm={6} xs={12} key={panel.id} className={classes.gridItem}>
            <Link className={classes.tileLink} key={panel.id} to={`/panel/${panel.id}`}>
                <Card className={classes.card}>
                    <CardHeader
                        avatar={
                            <BadgeWrapper
                                panel={panel}
                                position={{
                                    vertical: "top",
                                    horizontal: "right",
                                }}
                            >
                                <DynamicIcon className={classes.tileIcon} iconName={panel._module.icon} />
                            </BadgeWrapper>
                        }
                        action={<PanelDropdownMenu panel={panel} />}
                        title={panel.title}
                        subheader={panel.description}
                        className={classes.header}
                    />
                    {panel !== null && <StatusItems />}
                </Card>
            </Link>
        </Grid>
    );
};

export default HomeTile;
