import React from "react";
import { makeStyles } from "@mui/styles";
import { Link } from "react-router-dom";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import AddCircleIcon from "@mui/icons-material/AddCircle";

const useStyles = makeStyles(async (theme) => ({
    header: {
        backgroundColor: "#181818",
        borderWidth: 0,
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
        border: "2px dashed #262626",
        boxShadow: "none",
        backgroundColor: "#181818",
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

const HomeAddPanel = () => {
    const classes = useStyles();

    return (
        <Grid item xl={3} lg={4} sm={6} xs={12} className={classes.gridItem}>
            <Link className={classes.tileLink} to={`/panels/add`}>
                <Card className={classes.card}>
                    <CardHeader
                        avatar={<AddCircleIcon className={classes.tileIcon} />}
                        title="Add Panel"
                        subheader="Click to create your first panel"
                        className={classes.header}
                    />
                </Card>
            </Link>
        </Grid>
    );
};

export default HomeAddPanel;
