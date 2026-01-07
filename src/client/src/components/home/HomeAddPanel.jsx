import AddCircleIcon from "@mui/icons-material/AddCircle";
import { Button, Card, CardHeader, Grid } from "@mui/material";
import { Link } from "react-router-dom";
const HomeAddPanel = () => {
    return (
        <Grid
            size={{ xl: 3, lg: 4, sm: 6, xs: 12 }}
            sx={{
                padding: "12px",
                "@media (max-width:1200px)": {
                    padding: "8px",
                },
                "@media (max-width:1024px)": {
                    padding: "4px",
                },
                "@media (max-width:600px)": {
                    padding: "0px",
                    paddingBottom: "1px",
                },
                "@media (max-height:400px)": {
                    padding: "4px",
                    paddingBottom: "1px",
                },
            }}
        >
            <Button
                component={Link}
                sx={{
                    textDecoration: "none",
                }}
                to={`/panels/add`}
            >
                <Card
                    sx={{
                        borderWidth: "2px",
                        borderStyle: "dashed",
                        borderColor: "border.medium",
                        boxShadow: "none",
                        backgroundColor: "background.default",
                        "& .MuiBadge-badge": {
                            "@media (min-width:601px)": {
                                display: "none",
                            },
                        },
                    }}
                >
                    <CardHeader
                        avatar={<AddCircleIcon sx={{ color: "primary.main", marginTop: "4px" }} />}
                        title="Add Panel"
                        subheader="Click to create your first panel"
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
                            "& .MuiCardHeader-action": {
                                margin: "0px",
                                flexShrink: 0,
                            },
                            "& .MuiCardHeader-avatar": {
                                marginLeft: "16px",
                                flexShrink: 0,
                            },
                            "& .MuiCardHeader-content": {
                                minWidth: "0px",
                                flexShrink: 1,
                            },
                        }}
                    />
                </Card>
            </Button>
        </Grid>
    );
};

export default HomeAddPanel;
