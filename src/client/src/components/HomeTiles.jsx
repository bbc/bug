import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Loading from "./Loading";
import DynamicIcon from "@utils/DynamicIcon";
import Box from "@material-ui/core/Box";
import { Link } from "react-router-dom";
import Grid from '@material-ui/core/Grid';
import { useSelector } from 'react-redux'

const useStyles = makeStyles((theme) => ({
    tile: {
        position: "relative",
        display: "flex",
        backgroundColor: "#262626",
        margin: "auto",
        flexDirection: 'row',
        alignItems: 'center',
        '&:hover': {
            background: "#333",
        },        
    },
    tileIcon: {
        color: theme.palette.primary.main,
        width: '3rem',
        height: '3rem',
        margin: '0.6rem 1.5rem'
    },
    tileLink: {
        color: '#cccccc',
        textDecoration: 'none',
        '&:hover': {
            color: '#fff'
        },        
    },
    tileTitle: {
        fontSize: '1.3rem',
        fontWeight: 500,
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
            paddingBottom: 1
        },
        "@media (max-height:400px)": {
            padding: 4,
            paddingBottom: 1
        },
    }
}));

const HomeTiles = (props) => {
    const classes = useStyles();
    const panelList = useSelector(state => state.panelList);

    const renderTile = (item) => {
        if (!item.enabled) {
            return null;
        }
        return (
            <Grid item lg={4} sm={6} xs={12} key={item.id} className={classes.gridItem}>
                <Link className={classes.tileLink} key={item.id} to={`/panel/${item.id}`}>
                    <Box className={classes.tile}>
                        <DynamicIcon className={classes.tileIcon} iconName={item._module.icon} />
                        <div className={classes.tileTitle}>{item.title}</div>
                    </Box>
                </Link>
            </Grid>
        );
    };

    const renderTiles = (props) => {
        if (panelList.status === "loading") {
            return <Loading />;
        }
        return (
            <Grid container className={classes.gridContainer}>
                {panelList.data.map((panel) => renderTile(panel))}
            </Grid>
        );
    };

    return renderTiles(props);
};

export default HomeTiles;
