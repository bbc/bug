import React from "react";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import TimeAgo from "javascript-time-ago";
import parse from "html-react-parser";

export default function FeedCard({ item }) {
    const timeAgo = new TimeAgo("en-GB");

    const handleDetails = (event) => {
        window.open(item?.link);
    };

    return (
        <>
            <Card sx={{ minWidth: 275 }}>
                <CardContent>
                    <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                        {timeAgo.format(Date.parse(item?.published))}
                    </Typography>
                    <Typography variant="h5" component="div">
                        {item?.title}
                    </Typography>
                    <Typography sx={{ mb: 1.5 }} color="text.secondary">
                        {item?.author}
                    </Typography>
                    <Typography variant="body2"> {parse(item?.description)}</Typography>
                </CardContent>
                <CardActions>
                    <Button onClick={handleDetails} size="small">
                        Details
                    </Button>
                </CardActions>
            </Card>
        </>
    );
}
