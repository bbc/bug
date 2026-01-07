import AddIcon from "@mui/icons-material/Add";
import { Card, CardActionArea, CardContent } from "@mui/material";
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
                    height: "7rem",
                }}
                variant="outlined"
            >
                <CardActionArea>
                    <CardContent
                        sx={{
                            alignItems: "center",
                            display: "flex",
                            flexDirection: "column",
                            height: "7rem",
                            justifyContent: "center",
                        }}
                    >
                        <AddIcon fontSize={"large"} />
                    </CardContent>
                </CardActionArea>
            </Card>
        </>
    );
}
