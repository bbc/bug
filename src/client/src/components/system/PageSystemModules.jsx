import BugCard from "@core/BugCard";
import BugStatusLabel from "@core/BugStatusLabel";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import Grid from "@mui/material/Grid";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableRow from "@mui/material/TableRow";
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
                    <Grid item size={{ xs: 12, lg: 8 }}>
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
                                                    <TableRow key={module.name}>
                                                        <TableCell sx={{ fontWeight: 500 }}>
                                                            {module.longname}
                                                        </TableCell>
                                                        <TableCell sx={{ opacity: 0.5 }}>
                                                            {module.description}
                                                        </TableCell>
                                                        <TableCell>{module.version}</TableCell>
                                                        <TableCell>
                                                            <BugStatusLabel
                                                                color={
                                                                    module.status === "stable"
                                                                        ? "success.main"
                                                                        : "warning.main"
                                                                }
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
