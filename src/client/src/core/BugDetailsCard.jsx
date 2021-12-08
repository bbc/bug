import React from "react";
import Card from "@mui/material/Card";
import Box from "@mui/material/Box";
import CardHeader from "@mui/material/CardHeader";
import BugDetailsTable from "@core/BugDetailsTable";

export default function BugDetailsCard({ title, width, data, ...props }) {
    return (
        <Card
            sx={{
                minWidth: 300,
                textAlign: "left",
                color: "text.secondary",
                position: "relative",
                marginBottom: "8px",
            }}
            {...props}
        >
            {title && (
                <CardHeader
                    sx={{
                        "& .MuiCardHeader-title": {
                            fontWeight: 500,
                            color: "#ffffff",
                        },
                    }}
                    title={title}
                />
            )}
            {data && (
                <Box sx={{ margin: "2px" }}>
                    <BugDetailsTable width={width} gridLines={false} data={data} />
                </Box>
            )}
        </Card>
    );
}
