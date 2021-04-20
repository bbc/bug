import React from 'react';
import { makeStyles } from "@material-ui/core/styles";

import BugSwitch from '@components/BugSwitch';
import PanelTableMenu from "@components/panelTable/PanelTableMenu";
import AxiosCommand from '@utils/AxiosCommand';
import ProgressCounter from '@components/ProgressCounter';

import TableCell from "@material-ui/core/TableCell";
import TableRow from "@material-ui/core/TableRow";

const state = {
  textTransform: "uppercase",
  opacity: 0.8,
  fontSize: "0.8rem",
  paddingTop: "4px",
  fontWeight: 500
};

const useStyles = makeStyles((theme) => ({
  cellMenu: {
      width: '2rem'
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

export default function PanelTableRow( props ) {

  const classes = useStyles();

  const handleEnabledChanged = (checked, panelId) => {
    if(checked) {
        AxiosCommand(`/api/panel/enable/${panelId}`);
    }
    else {
        AxiosCommand(`/api/panel/disable/${panelId}`);
    }
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

  return (
    <>
      <TableRow key={props.id}>
          <TableCell>
              <BugSwitch panelId={props.id} checked={props.enabled} onChange={(checked) => handleEnabledChanged(checked, props.id)}/>
          </TableCell>
          <TableCell>
              <div className={classes.title}>{props.title}</div>
              {renderState(props)}
          </TableCell>
          <TableCell>{props.description}</TableCell>
          <TableCell>{props._module.longname}</TableCell>
          <TableCell className={classes.cellMenu}><PanelTableMenu panel={props}/></TableCell>
      </TableRow>
    </>
  );
}