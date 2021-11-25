import React from "react";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Grid from "@material-ui/core/Grid";

export default function StatusCard() {
    return (
        <Grid item lg={12} sm={12} xs={12}>
            <Card
                sx={{
                    minWidth: "150px",
                    padding: "8px",
                    textAlign: "center",
                    color: "text.secondary",
                }}
            >
                <CardContent></CardContent>
            </Card>
        </Grid>
    );
}
