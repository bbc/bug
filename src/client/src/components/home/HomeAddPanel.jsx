import React from "react";
import { Link } from "react-router-dom";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import AddCircleIcon from "@mui/icons-material/AddCircle";

const HomeAddPanel = () => {
    return (
        <Grid
            item
            xl={3}
            lg={4}
            sm={6}
            xs={12}
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
                    color: "#cccccc",
                    textDecoration: "none",
                    "&:hover": {
                        color: "#fff",
                    },
                }}
                to={`/panels/add`}
            >
                <Card
                    sx={{
                        border: "2px dashed #262626",
                        boxShadow: "none",
                        backgroundColor: "#181818",
                        "&:hover": {
                            background: "#333",
                        },
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
                            backgroundColor: "#181818",
                            borderWidth: 0,
                            padding: "8px 8px 8px 0px",
                            "&:hover": {
                                background: "#333",
                            },
                            "& .MuiCardHeader-title": {
                                fontFamily: "fontFamily",
                                color: "rgba(255, 255, 255, 1)",
                                fontSize: "1.1rem",
                                fontWeight: "500",
                                textTransform: "none",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                whiteSpace: "nowrap",
                            },
                            "& .MuiCardHeader-subheader": {
                                color: "rgba(255, 255, 255, 0.4)",
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
