import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";

import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import CardContent from "@material-ui/core/CardContent";
import { Redirect } from "react-router";
import Grid from "@material-ui/core/Grid";

const height = 200;

const useStyles = makeStyles((theme) => ({
    card: {
        minWidth: 150,
        padding: theme.spacing(1),
        textAlign: "center",
        color: theme.palette.text.secondary,
    },
    thumbnail: {
        display: "block",
        margin: "auto",
        height: height,
        width: height * (16 / 9),
        padding: 15,
    },
}));

export default function EncoderCard(props) {
    const classes = useStyles();
    const [redirectUrl, setRedirectUrl] = useState(null);

    const getThumbnail = () => {
        let src = "/images/blank.png";

        if (props.thumbnail) {
            src = props.thumbnail;
        }

        return <img src={src} className={classes.thumbnail} />;
    };

    const handleCardClicked = (sid) => {
        setRedirectUrl(`/panel/${props.panelId}/encoder/${sid}`);
    };

    if (redirectUrl) {
        return <Redirect push to={{ pathname: redirectUrl }} />;
    }

    return (
        <Grid key={props?.sid} item lg={4} md={6} sm={12} xs={12}>
            <Card
                className={classes.card}
                onClick={() => handleCardClicked(props?.sid)}
            >
                <CardHeader
                    title={props?.name}
                    titleTypographyProps={{ variant: "h6" }}
                    subheader={props.status.toUpperCase()}
                />
                {getThumbnail()}
                <CardContent>{props.model}</CardContent>
            </Card>
        </Grid>
    );
}
