import React, { useEffect } from "react";
import PanelList from "@components/PanelList";
import { useDispatch } from "react-redux";
import pageTitleSlice from "../redux/pageTitleSlice";
import { Link } from 'react-router-dom';
import Button from '@material-ui/core/Button';
import AddIcon from '@material-ui/icons/Add';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
    link: {
      textDecoration: 'none',
      margin: "1rem",
    },
    extendedIcon: {
      marginRight: theme.spacing(1),
    },
  }));
  
export default function PagePanels() {

    const classes = useStyles();
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(pageTitleSlice.actions.set("Panel List"));
    });

    return (
        <>
            <PanelList />

            <Link to={ '/panel/add' } color="inherit" className={classes.link}>
                <Button variant="contained" color="default" size='large' disableElevation>
                    <AddIcon className={classes.extendedIcon} />
                    Add Panel
                </Button>
            </Link>
        </>
    );
}
