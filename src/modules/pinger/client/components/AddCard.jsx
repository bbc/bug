import React from "react";
import Card from "@mui/material/Card";
import { useHistory } from "react-router-dom";
import { CardActionArea } from "@mui/material";
import CardContent from "@mui/material/CardContent";
import AddIcon from "@mui/icons-material/Add";
import Stack from "@mui/material/Stack";

export default function AddCard({ panelId }) {
    const history = useHistory();

    const handleAddClick = () => {
        history.push(`/panel/${panelId}/host/add`);
    };
    return (
        <>
            <Card
                onClick={handleAddClick}
                sx={{
                    borderStyle: "dashed",
                    borderRadius: "3px",
                    minWidth: 275,
                    height: "100%",
                    margin: "4px",
                }}
                variant="outlined"
                color="secondary"
            >
                <CardActionArea>
                    <CardContent sx={{ alignItems: "center" }}>
                        <Stack direction="row" alignItems="center" gap={1}>
                            <AddIcon fontSize={"large"} />
                        </Stack>
                    </CardContent>
                </CardActionArea>
            </Card>
        </>
    );
}
