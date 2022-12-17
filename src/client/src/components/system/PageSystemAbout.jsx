import React from "react";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import { useDispatch } from "react-redux";
import AxiosGet from "@utils/AxiosGet";
import BugStatusLabel from "@core/BugStatusLabel";
import BugCard from "@core/BugCard";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import Paper from "@mui/material/Paper";
import Link from "@mui/material/Link";
import { faBug } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableRow from "@mui/material/TableRow";
import pageTitleSlice from "@redux/pageTitleSlice";

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
                <Grid
                    item
                    sx={{
                        maxWidth: "792px",
                    }}
                >
                    <BugCard>
                        <CardHeader component={Paper} square elevation={1} title="About BUG" />
                        <CardContent>
                            <Box
                                sx={{
                                    display: "flex",
                                }}
                            >
                                <Box
                                    sx={{
                                        display: "flex",
                                        alignItems: "center",
                                        "& .fa-bug": {
                                            fontSize: "180px",
                                            padding: "1rem",
                                            paddingRight: "2rem",
                                            color: "primary.main",
                                        },
                                    }}
                                >
                                    <FontAwesomeIcon size="lg" icon={faBug} />
                                </Box>
                                <Box>
                                    <p>
                                        BUG is a modular web application which controls and monitors a wide range of
                                        broadcast equipment.
                                    </p>
                                    <p>
                                        It was originally developed at the BBC by Geoff House (
                                        <Link href="https://github.com/geoffhouse">github.com/geoffhouse</Link>) and
                                        Ryan McCartney (
                                        <Link href="https://github.com/ryanmccartney">github.com/ryanmccartney</Link>)
                                        and is now available as a fully open-sourced product.
                                    </p>

                                    <p>
                                        Bug is released under the Apache 2.0 licence:
                                        <br />
                                        <Link href="https://www.apache.org/licenses/LICENSE-2.0">
                                            https://www.apache.org/licenses/LICENSE-2.0
                                        </Link>
                                    </p>

                                    <p>
                                        For more information, or to report a bug please visit
                                        <br />
                                        <Link href="https://github.com/bbc/bug">github.com/bbc/bug</Link>
                                    </p>
                                </Box>
                            </Box>
                        </CardContent>
                    </BugCard>
                </Grid>
                {modules && (
                    <Grid
                        item
                        sx={{
                            maxWidth: "800px",
                        }}
                    >
                        <BugCard>
                            <CardHeader component={Paper} square elevation={1} title="Available Modules" />
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
