import BugCard from "@core/BugCard";
import BugDetailsCard from "@core/BugDetailsCard";
import BugTableLinkButton from "@core/BugTableLinkButton";
import { faBug } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Box, CardContent, CardHeader, Grid, Link } from "@mui/material";
import pageTitleSlice from "@redux/pageTitleSlice";
import React from "react";
import { useDispatch } from "react-redux";

export default function PageSystemAbout() {
    const dispatch = useDispatch();

    const openWebpage = async (event, url) => {
        const newWindow = window.open(url, "_blank", "noopener,noreferrer");
        if (newWindow) newWindow.opener = null;
        event.stopPropagation();
        event.preventDefault();
    };

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
                    sx={{
                        maxWidth: "792px",
                    }}
                    size={{ lg: 8, xs: 12 }}
                >
                    <BugCard>
                        <CardHeader
                            sx={{
                                borderBottomWidth: "1px",
                                borderBottomColor: "border.light",
                                borderBottomStyle: "solid",
                            }}
                            title="About BUG"
                        />
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
                                <Box sx={{ color: "text.primary" }}>
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
                <Grid
                    sx={{
                        maxWidth: "792px",
                    }}
                    size={{ lg: 8, xs: 12 }}
                >
                    <BugDetailsCard
                        title="Developer Information"
                        width="12rem"
                        sx={{
                            marginBottom: 0,
                        }}
                        items={[
                            {
                                name: "Documentation",
                                value: (
                                    <BugTableLinkButton
                                        onClick={(event) => openWebpage(event, `https://bbc.github.io/bug`)}
                                        sx={{ color: "text.primary" }}
                                    >
                                        bbc.github.io/bug
                                    </BugTableLinkButton>
                                ),
                            },
                            {
                                name: "API Documentation",
                                value: (
                                    <BugTableLinkButton
                                        onClick={(event) => openWebpage(event, `/api/documentation`)}
                                        sx={{ color: "text.primary" }}
                                    >
                                        /api/documentation
                                    </BugTableLinkButton>
                                ),
                            },
                        ]}
                    />
                </Grid>
            </Grid>
        </>
    );
}
