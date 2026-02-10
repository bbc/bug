import { Box, Button, Stack } from "@mui/material";

export default function RouteList({ panelId, routes }) {
    if (routes?.status === "loading" || routes?.status !== "success") {
        return null;
    }

    if (routes?.data?.length === 0) {
        return null;
    }

    return (
        <Box sx={{ p: 0.5 }}>
            <Box sx={{ mb: 1 }}>
                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        flexWrap: "nowrap",
                        p: 1,
                        borderColor: "border.light",
                        borderRadius: 0,
                        gap: 2,
                    }}
                >
                    <Box sx={{ flexShrink: 0, minWidth: "160px", pl: 1, fontWeight: 700 }}>DEFAULT ROUTE</Box>

                    <Box
                        sx={{
                            display: "flex",
                            flexWrap: "wrap",
                            gap: 1,
                            flexGrow: 1,
                            justifyContent: "flex-start",
                            "& > button": {
                                flex: "0 0 140px",
                                height: 60,
                                fontSize: "0.8rem",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                            },
                        }}
                    >
                        {routes.data.map((route, index) => {
                            return (
                                <Button
                                    color={route.disabled ? "secondary" : "warning"}
                                    key={route.id}
                                    variant={route.active ? "contained" : "outlined"}
                                    sx={{
                                        flex: "0 0 140px",
                                        height: 60,
                                        fontSize: "0.8rem",
                                        overflow: "hidden",
                                        textOverflow: "ellipsis",
                                        pointerEvents: "none",
                                        cursor: "default",
                                    }}
                                >
                                    <Stack>
                                        <Box>{route.label}</Box>
                                        <Box sx={{ opacity: 0.5 }}>{route.dynamic ? "DYNAMIC" : "STATIC"}</Box>
                                    </Stack>
                                </Button>
                            );
                        })}
                    </Box>
                </Box>
            </Box>
        </Box>
    );
}
