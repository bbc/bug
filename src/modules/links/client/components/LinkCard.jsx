import { Card, CardActionArea, CardContent, Typography } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
export default function LinkCard({ title, description, behaviour, url, index }) {
    const params = useParams();
    const navigate = useNavigate();

    const handleClick = (event) => {
        if (behaviour === "new") {
            window.open(url);
        }
        if (behaviour === "same") {
            window.open(url, "_self");
        }
        if (behaviour === "inside") {
            navigate(`/panel/${params.panelId}/link/${index}`);
        }
    };

    return (
        <>
            <Card
                onClick={handleClick}
                sx={{
                    borderRadius: "3px",
                    minWidth: 275,
                    margin: "4px",
                }}
                variant="outlined"
                color="secondary"
            >
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
