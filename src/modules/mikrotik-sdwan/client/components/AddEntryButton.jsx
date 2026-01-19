import AddCircleIcon from "@mui/icons-material/AddCircle";
import { Button, Card, CardHeader, Grid } from "@mui/material";
import { Link, useParams } from "react-router-dom";

const AddEntryButton = () => {
    const params = useParams();
    return (
        <Grid>
            <Button
                component={Link}
                sx={{
                    textDecoration: "none",
                }}
                to={`/panel/${params.panelId}/add`}
            >
                <Card
                    sx={{
                        borderWidth: "2px",
                        borderStyle: "dashed",
                        borderColor: "border.medium",
                        boxShadow: "none",
                        backgroundColor: "background.default",
                    }}
                >
                    <CardHeader
                        avatar={<AddCircleIcon sx={{ color: "primary.main", marginTop: "4px" }} />}
                        title="Add Entry"
                        subheader="Click to add a new SD-WAN entry"
                        sx={{
                            minWidth: "22rem",
                            backgroundColor: "background.default",
                            borderWidth: 0,
                            padding: "8px 8px 8px 0px",
                            "& .MuiCardHeader-title": {
                                fontFamily: "fontFamily",
                                color: "text.primary",
                                fontSize: "1.1rem",
                                fontWeight: "500",
                                textTransform: "none",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                whiteSpace: "nowrap",
                            },
                            "& .MuiCardHeader-subheader": {
                                color: "text.secondary",
                                fontSize: "0.9rem",
                                overflow: "hidden",
                                textTransform: "none",
                                textOverflow: "ellipsis",
                                whiteSpace: "nowrap",
                            },
                            "& .MuiCardHeader-avatar": {
                                marginLeft: "16px",
                                flexShrink: 0,
                            },
                        }}
                    />
                </Card>
            </Button>
        </Grid>
    );
};

export default AddEntryButton;
