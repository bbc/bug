import React from "react";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import CardHeader from "@material-ui/core/CardHeader";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Button from "@material-ui/core/Button";
import Link from '@material-ui/core/Link';

const useStyles = makeStyles((theme) => ({
  header: {
    backgroundColor: theme.palette.appbar.default,
    color: theme.palette.secondary.main,
    "& .MuiCardHeader-title": {
      fontSize: "0.875rem",
      fontWeight: 400,
      textTransform: "uppercase",
    },
    padding: 15,
  },
  card: {
    minWidth: 300,
    textAlign: "left",
    color: theme.palette.text.secondary,
    position: "relative",
    maxWidth: "70rem",
  },
}));

export default function TabPanelSettings() {
  const classes = useStyles();

  return (
    <>
      <Card className={classes.card}>
        <CardHeader
          component={Paper}
          square
          elevation={1}
          className={classes.header}
          title="System Backup"
        />
        <CardContent>
          <Button
            component={Link}
            href={`/api/system/backup`}
            download
            underline="none"
            variant="outlined"
            color="secondary"
            disableElevation
          >
            Download
          </Button>
        </CardContent>
      </Card>
    </>
  );
}
