import React from "react";
import { makeStyles } from '@material-ui/core/styles';
import Menu from './Menu';
import PageHome from './PageHome';
import Grid from '@material-ui/core/Grid';
import {
    BrowserRouter as Router,
    Switch,
    Route
} from "react-router-dom";

const useStyles = makeStyles({
    grid: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
    },
    content: {
        flexGrow: 1,
        overflow: 'scroll'
    }
});

export default function Page() {
    
    const classes = useStyles();

    return (
        <>
            <Router>
                <Grid
                    className={classes.grid}
                    container
                    direction="row"
                    justify="flex-start"
                    alignItems="flex-start"
                    >
                    <Grid item>
                        <Menu />
                    </Grid>

                    <Grid item className={classes.content}>
                        <Switch>
                            <Route exact path="/">
                                <PageHome />
                            </Route>
                        </Switch>
                    </Grid>
                </Grid>
            
            </Router>
        </>
    );
}

