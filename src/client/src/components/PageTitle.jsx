import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import TitleContext from '@utils/TitleContext';

const useStyles = makeStyles((theme) => ({
    title: {
        backgroundColor: theme.palette.menu.main,
        width: "100%",
        color: "#ffffff",
        fontSize: "2.5rem",
        padding: "0.5rem 1rem",
    },
}));

export default function PageTitle(props) {
    const classes = useStyles();
    const title = React.useContext(TitleContext);
    title(props.children);
    return(null);
}
