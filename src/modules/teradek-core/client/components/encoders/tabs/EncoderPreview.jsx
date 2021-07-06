import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";

const height = 300;

const useStyles = makeStyles((theme) => ({
    thumbnail: {
        display: "block",
        margin: "auto",
        height: height,
        width: height * (16 / 9),
        padding: 15,
    },
}));

export default function EncoderPreview({ encoder, panelId }) {
    const classes = useStyles();

    const getThumbnail = () => {
        let src = "/images/blank.png";

        if (encoder?.thumbnail) {
            src = encoder?.thumbnail;
        }

        return <img src={src} className={classes.thumbnail} />;
    };

    return (
        <>
            {getThumbnail()}

            <Typography variant="h5" align="center" component="p">
                {encoder?.name}
            </Typography>

            <Typography variant="body2" align="center" component="p">
                {encoder?.name}
            </Typography>
        </>
    );
}
