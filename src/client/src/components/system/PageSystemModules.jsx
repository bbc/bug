import BugCard from "@core/BugCard";
import BugStatusLabel from "@core/BugStatusLabel";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import {
    CardContent,
    CardHeader,
    Grid,
    IconButton,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableRow,
} from "@mui/material";
import pageTitleSlice from "@redux/pageTitleSlice";
import AxiosGet from "@utils/AxiosGet";
import React from "react";
import { useDispatch } from "react-redux";

export default function PageSystemAbout() {
    const dispatch = useDispatch();
    const [modules, setModules] = React.useState(null);

    React.useEffect(() => {
        const fetchModules = async () => {
            const moduleResult = await AxiosGet("/api/module");
            setModules(moduleResult);
        };
        fetchModules();
    }, []);

    React.useEffect(() => {
        dispatch(pageTitleSlice.actions.set("About BUG"));
    }, [dispatch]);

    const handleDocsClicked = (url) => () => {
        if (url) {
            window.open(url, "_blank");
        }
    };

    const statusColors = {
        stable: "success.main",
        beta: "warning.main",
        development: "primary.main",
        archived: "error.main",
    };

    return (
        <>
            <Grid
                container
                spacing={1}
                sx={{
                    justifyContent: "center",
                }}
            >
                {modules && (
                    <Grid size={{ xs: 12, lg: 8 }}>
                        <BugCard>
                            <CardHeader
                                sx={{
                                    borderBottomWidth: "1px",
                                    borderBottomColor: "border.light",
                                    borderBottomStyle: "solid",
                                }}
                                title="Available Modules"
                            />
                            <CardContent sx={{ padding: 0, paddingBottom: "0 !important" }}>
                                <TableContainer>
                                    <Table>
                                        <TableBody>
                                            {modules &&
                                                modules.map((module) => (
                                                    <TableRow key={module.name} sx={{ height: "48px" }}>
                                                        <TableCell sx={{ fontWeight: 500 }}>
                                                            {module.longname}
                                                        </TableCell>
                                                        <TableCell sx={{ opacity: 0.5 }}>
                                                            {module.description}
                                                        </TableCell>
                                                        <TableCell>{module.version}</TableCell>
                                                        <TableCell sx={{ opacity: 0.5 }}>
                                                            <IconButton
                                                                onClick={handleDocsClicked(module.documentationUrl)}
                                                                size="small"
                                                            >
                                                                <OpenInNewIcon fontSize="small" />
                                                            </IconButton>
                                                        </TableCell>
                                                        <TableCell>
                                                            <BugStatusLabel
                                                                sx={{
                                                                    color:
                                                                        statusColors[module.status] || "default.main",
                                                                }}
                                                            >
                                                                {module.status}
                                                            </BugStatusLabel>
                                                        </TableCell>
                                                    </TableRow>
                                                ))}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            </CardContent>
                        </BugCard>
                    </Grid>
                )}
            </Grid>
        </>
    );
}
