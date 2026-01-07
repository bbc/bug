import AddIcon from "@mui/icons-material/Add";
import { Card, CardActionArea, CardContent, Stack } from "@mui/material";
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
                    margin: "4px",
                }}
                variant="outlined"
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
