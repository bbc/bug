import React from "react";
import CircularProgress from "@mui/material/CircularProgress";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import ProgressCounter from "@components/ProgressCounter";
import Hidden from "@mui/material/Hidden";

const CircularProgressWithLabel = ({ value }) => {
    const renderValue = () => {
        if (value > -1) {
            return (
                <Typography
                    variant="caption"
                    component="div"
                    color="textSecondary"
                    sx={{
                        fontSize: "3rem",
                        "@media (max-width:600px)": {
                            fontSize: "1.5rem",
                        },
                    }}
                >
                    <ProgressCounter value={Math.round(value)} />%
                </Typography>
            );
        } else {
            return null;
        }
    };

    return (
        <Box position="relative" display="inline-flex">
            <Hidden xsDown>
                <CircularProgress size={`12rem`} />
            </Hidden>
            <Hidden smUp>
                <CircularProgress size={`6rem`} />
            </Hidden>

            <Box
                top={0}
                left={0}
                bottom={0}
                right={0}
                position="absolute"
                display="flex"
                alignItems="center"
                justifyContent="center"
            >
                {renderValue()}
            </Box>
        </Box>
    );
};

export default function PanelBuilding({ panel }) {
    return (
        <>
            <Grid
                container
                spacing={0}
                sx={{
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                }}
            >
                <h3>Panel is starting ...</h3>
                <Grid item xs={3}>
                    <CircularProgressWithLabel value={panel?._buildStatus?.progress} />
                </Grid>
            </Grid>
        </>
    );
}
