import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import PanelListMenu from "@components/PanelListMenu";
import Loading from "./Loading";
import ProgressCounter from '@components/ProgressCounter';
import AxiosCommand from '@utils/AxiosCommand';
import BugSwitch from '@components/BugSwitch';
import { useSelector } from 'react-redux'

const state = {
    textTransform: "uppercase",
    opacity: 0.8,
    fontSize: "0.8rem",
    paddingTop: "4px",
    fontWeight: 500
};

const useStyles = makeStyles((theme) => ({
    content: {
        margin: "1rem",
    },
    cellMenu: {
        width: '2rem'
    },
    dragIcon: {
        opacity: 0.2
    },
    stateRunning: {
         ...state,
        color: theme.palette.success.main,
    },
    stateIdle: {
         ...state,
        color: theme.palette.primary.main,
    },
    stateUninitialised: {
         ...state,
        opacity: 0.3
    },
    stateBuilding: {
         ...state,
        color: theme.palette.primary.main,
    },
    stateError: {
         ...state,
        color: theme.palette.error.main,
    }
}));

export default function PanelList() {
    const classes = useStyles();
    const panelList = useSelector(state => state.panelList);

    const handleEnabledChanged = (checked, panelId) => {
        if(checked) {
            AxiosCommand(`/api/panel/enable/${panelId}`);
        }
        else {
            AxiosCommand(`/api/panel/disable/${panelId}`);
        }

    };

    const renderRow = (panel) => {
        return (
            <TableRow key={panel.id}>
                {/* <TableCell><DragIndicatorIcon className={classes.dragIcon}/></TableCell> */}
                <TableCell>
                    <BugSwitch panelId={panel.id} checked={panel.enabled} onChange={(checked) => handleEnabledChanged(checked, panel.id)}/>
                </TableCell>
                <TableCell>
                    <div className={classes.title}>{panel.title}</div>
                    {renderState(panel)}
                </TableCell>
                <TableCell>{panel.description}</TableCell>
                <TableCell>{panel._module.longname}</TableCell>
                <TableCell className={classes.cellMenu}><PanelListMenu panel={panel}/></TableCell>
            </TableRow>
        );
    };

    const renderState = (panel) => {
        if(panel._isrunning) {
            return <div className={classes.stateRunning}>Running - {panel._container.status}</div>;
        }
        if(panel._isbuilding) {
            return <div className={classes.stateBuilding}>{panel._buildstatus.text} - <ProgressCounter value={panel._buildstatus.progress} />% complete</div>;
        }
        if(panel._isbuilt) {
            if(panel._buildstatus.error) {
                return <div className={classes.stateError}>ERROR - {panel._buildstatus.text}</div>;
            }
            return <div className={classes.stateBuilding}>Built - IDLE</div>;
        }
        return <div className={classes.stateUninitialised}>IDLE</div>;
    };

    if (panelList.status === "loading") {
        return <Loading />;
    }
    if (panelList.status === "success") {
        return (
            <>
                <div className={classes.content}>
                    <TableContainer component={Paper} square>
                        <Table className={classes.table} aria-label="simple table">
                            <TableHead>
                                <TableRow>
                                    <TableCell width="10"></TableCell>
                                    <TableCell>Title</TableCell>
                                    <TableCell>Description</TableCell>
                                    <TableCell>Module</TableCell>
                                    <TableCell></TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>{panelList.data.map((panel) => renderRow(panel))}</TableBody>
                        </Table>
                    </TableContainer>
                </div>
            </>
        );
    } else {
        return null;
    }
}
