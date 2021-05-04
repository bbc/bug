import React, { useState, useEffect } from "react";
import { makeStyles, useTheme } from '@material-ui/core/styles';
import { useDispatch } from 'react-redux';
import pageTitleSlice from '../redux/pageTitleSlice';

import SwipeableViews from 'react-swipeable-views';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import TabPanel from "@components/systemTabs/TabPanel";

import TabPanelSettings from "@components/systemTabs/TabPanelSettings";
import TabPanelUsers from "@components/systemTabs/TabPanelUsers";
import TabPanelSoftware from "@components/systemTabs/TabPanelSoftware";
import TabPanelLogs from "@components/systemTabs/TabPanelLogs";

function a11yProps(index) {
    return {
        id: `full-width-tab-${index}`,
        'aria-controls': `full-width-tabpanel-${index}`,
    };
}

const useStyles = makeStyles((theme) => ({
    root: {
        backgroundColor: theme.palette.background.paper
    },
}));

export default function PageSystem() {

    const theme = useTheme();
    const classes = useStyles();
    const dispatch = useDispatch()

    const [value, setValue] = useState(0);
  
    const handleChange = (event, newValue) => {
      setValue(newValue);
    };
  
    const handleChangeIndex = (index) => {
      setValue(index);
    };

    useEffect(() => {
        dispatch(pageTitleSlice.actions.set("System"));
    }, [dispatch]);

    return (
        <>
            <div className={classes.root}>
                <AppBar position="static" color="default">
                    <Tabs
                    value={value}
                    onChange={handleChange}
                    indicatorColor="primary"
                    textColor="primary"
                    variant="fullWidth"
                    aria-label="full width tabs example"
                    >
                        <Tab label="Settings" {...a11yProps(0)} />
                        <Tab label="Users" {...a11yProps(1)} />
                        <Tab label="Software" {...a11yProps(2)} />
                        <Tab label="Logs" {...a11yProps(3)} />
                    </Tabs>
                </AppBar>
                <SwipeableViews
                    axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
                    index={value}
                    onChangeIndex={handleChangeIndex}
                >
                    <TabPanel value={value} index={0} dir={theme.direction}>
                        <TabPanelSettings/>
                    </TabPanel>
                    <TabPanel value={value} index={1} dir={theme.direction}>
                        <TabPanelUsers/>
                    </TabPanel>
                    <TabPanel value={value} index={2} dir={theme.direction}>
                        <TabPanelSoftware/>
                    </TabPanel>
                    <TabPanel value={value} index={3} dir={theme.direction}>
                        <TabPanelLogs/>
                    </TabPanel>
                </SwipeableViews>
            </div>
        </>
    );
}
