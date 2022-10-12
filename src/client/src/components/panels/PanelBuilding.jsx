import React from "react";
import CircularProgress from "@mui/material/CircularProgress";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import ProgressCounter from "@components/ProgressCounter";

const CircularProgressWithLabel = ({ value }) => {
    return (
        <Box position="relative" display="inline-flex">
            <CircularProgress size={`8rem`} />

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
                {value > 1 && (
                    <Typography
                        variant="caption"
                        component="div"
                        color="textSecondary"
                        sx={{
                            fontSize: "2rem",
                        }}
                    >
                        <ProgressCounter value={Math.round(value)} />%
                    </Typography>
                )}
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
                <Grid
                    item
                    sx={{
                        padding: "1rem",
                    }}
                >
                    Panel is building ...
                </Grid>
                <Grid item xs={3}>
                    <CircularProgressWithLabel value={panel?._buildStatus?.progress} />
                </Grid>
            </Grid>
        </>
    );
}
