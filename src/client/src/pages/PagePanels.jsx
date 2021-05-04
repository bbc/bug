import React, { useEffect } from "react";
import PanelTable from "@components/panelTable/PanelTable";
import { useDispatch } from "react-redux";
import pageTitleSlice from "../redux/pageTitleSlice";
import { Link } from "react-router-dom";
import Button from "@material-ui/core/Button";
import AddIcon from "@material-ui/icons/Add";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
    link: {
        textDecoration: "none",
    },
    extendedIcon: {
        marginRight: theme.spacing(1),
    },
}));

export default function PagePanels() {
    const classes = useStyles();
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(pageTitleSlice.actions.set("Panels"));
    });

    return (
        <>
            <PanelTable />

            <Button
                component={Link}
                to={"/panel/add"}
                variant="contained"
                color="default"
                size="large"
                disableElevation
                style={{ marginTop: "1rem" }}
            >
                <AddIcon className={classes.extendedIcon} />
                Add Panel
            </Button>
        </>
    );
}
