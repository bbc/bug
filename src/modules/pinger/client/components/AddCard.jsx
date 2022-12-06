import React from "react";
import Card from "@mui/material/Card";
import { CardActionArea } from "@mui/material";
import CardContent from "@mui/material/CardContent";
import AddIcon from "@mui/icons-material/Add";
import Stack from "@mui/material/Stack";

export default function AddCard({ handleClick }) {
    const handleAddClick = () => {
        handleClick();
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
