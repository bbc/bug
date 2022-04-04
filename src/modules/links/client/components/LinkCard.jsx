import React from "react";
import { useHistory, useParams } from "react-router-dom";
import Card from "@mui/material/Card";
import { CardActionArea } from "@mui/material";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";

export default function LinkCard({ title, description, behaviour, url, index }) {
    const params = useParams();
    const history = useHistory();

    const handleClick = (event) => {
        if (behaviour === "new") {
            window.open(url);
        }
        if (behaviour === "same") {
            window.open(url, "_self");
        }
        if (behaviour === "inside") {
            history.push(`/panel/${params.panelId}/link/${index}`);
        }
    };

    return (
        <>
            <Card onClick={handleClick} sx={{ minWidth: 275 }}>
                <CardActionArea>
                    <CardContent>
                        <Typography variant="h5" component="div">
                            {title}
                        </Typography>

                        <Typography variant="body2">{description}</Typography>
                    </CardContent>
                </CardActionArea>
            </Card>
        </>
    );
}
