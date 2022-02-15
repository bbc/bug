import React, { Suspense, lazy } from "react";
import { Switch, Route } from "react-router-dom";
import PageSystemConfiguration from "@components/system/PageSystemConfiguration";
import PageSystemUsers from "@components/system/PageSystemUsers";
import PageSystemUserEdit from "@components/system/PageSystemUserEdit";
import PageSystemSecurity from "@components/system/PageSystemSecurity";
import PageSystemSecurityStrategy from "@components/system/PageSystemSecurityStrategy";
import PageSystemSoftware from "@components/system/PageSystemSoftware";
import PageSystemInfo from "@components/system/PageSystemInfo";
import PageSystemLogs from "@components/system/PageSystemLogs";
import PageSystemAbout from "@components/system/PageSystemAbout";
import PageSystemBackup from "@components/system/PageSystemBackup";
import { Redirect } from "react-router";
import BugLoading from "@core/BugLoading";
import BugScrollbars from "@core/BugScrollbars";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";

//Page Lazy Loads
const PageHome = lazy(() => import("./PageHome"));
const PagePanel = lazy(() => import("./PagePanel"));
const PagePanels = lazy(() => import("./PagePanels"));
const PagePanelsAdd = lazy(() => import("./PagePanelsAdd"));
const PagePanelsEdit = lazy(() => import("./PagePanelsEdit"));
const PageSystem = lazy(() => import("./PageSystem"));

const StyledPageContent = styled("div")({
    height: "100%",
    padding: "4px",
    "@media (max-width:600px)": {
        padding: "0px",
    },
});

const StyledHomePageContent = styled("div")({
    height: "100%",
    padding: "8px",
    "@media (max-width:1200px)": {
        padding: "4px",
    },
    "@media (max-width:1024px)": {
        padding: "2px",
    },
    "@media (max-width:600px)": {
        padding: "0px",
    },
});

const PageContent = () => {
    return (
        <>
            <Box
                sx={{
                    position: "absolute",
                    top: "64px",
                    bottom: 0,
                    left: 0,
                    right: 0,
                    "@media (max-width:800px)": {
                        top: "52px",
                    },
                }}
            >
                <Switch>
                    <Suspense fallback={<BugLoading />}>
                        <Route exact path="/">
                            <StyledHomePageContent>
                                <BugScrollbars>
                                    <PageHome />
                                </BugScrollbars>
                            </StyledHomePageContent>
                        </Route>
                        <Route exact path="/panels">
                            <StyledPageContent>
                                <BugScrollbars>
                                    <PagePanels />
                                </BugScrollbars>
                            </StyledPageContent>
                        </Route>
                        <Route exact path="/panels/add">
                            <StyledPageContent>
                                <BugScrollbars>
                                    <PagePanelsAdd />
                                </BugScrollbars>
                            </StyledPageContent>
                        </Route>
                        <Route exact path="/panels/edit">
                            <StyledPageContent>
                                <BugScrollbars>
                                    <PagePanelsEdit />
                                </BugScrollbars>
                            </StyledPageContent>
                        </Route>
                        <Route path="/panel/:panelid">
                            <StyledPageContent>
                                <BugScrollbars>
                                    <PagePanel />
                                </BugScrollbars>
                            </StyledPageContent>
                        </Route>
                        <Route exact path="/system">
                            <StyledPageContent>
                                <BugScrollbars>
                                    <PageSystem />
                                </BugScrollbars>
                            </StyledPageContent>
                        </Route>
                        <Route exact path="/system/configuration">
                            <StyledPageContent>
                                <BugScrollbars>
                                    <PageSystemConfiguration />
                                </BugScrollbars>
                            </StyledPageContent>
                        </Route>
                        <Route exact path="/system/users">
                            <StyledPageContent>
                                <BugScrollbars>
                                    <PageSystemUsers />
                                </BugScrollbars>
                            </StyledPageContent>
                        </Route>
                        <Route exact path="/system/user">
                            <StyledPageContent>
                                <BugScrollbars>
                                    <PageSystemUserEdit />
                                </BugScrollbars>
                            </StyledPageContent>
                        </Route>
                        <Route exact path="/system/user/:userId">
                            <StyledPageContent>
                                <BugScrollbars>
                                    <PageSystemUserEdit />
                                </BugScrollbars>
                            </StyledPageContent>
                        </Route>
                        <Route exact path="/system/security">
                            <StyledPageContent>
                                <BugScrollbars>
                                    <PageSystemSecurity />
                                </BugScrollbars>
                            </StyledPageContent>
                        </Route>
                        <Route exact path="/system/security/edit">
                            <StyledPageContent>
                                <BugScrollbars>
                                    <PageSystemSecurity edit />
                                </BugScrollbars>
                            </StyledPageContent>
                        </Route>
                        <Route exact path="/system/security/:type">
                            <StyledPageContent>
                                <BugScrollbars>
                                    <PageSystemSecurityStrategy />
                                </BugScrollbars>
                            </StyledPageContent>
                        </Route>
                        <Route exact path="/system/software">
                            <StyledPageContent>
                                <BugScrollbars>
                                    <PageSystemSoftware />
                                </BugScrollbars>
                            </StyledPageContent>
                        </Route>
                        <Route exact path="/system/info">
                            <StyledPageContent>
                                <BugScrollbars>
                                    <PageSystemInfo />
                                </BugScrollbars>
                            </StyledPageContent>
                        </Route>
                        <Route exact path="/system/logs">
                            <StyledPageContent>
                                <BugScrollbars>
                                    <PageSystemLogs />
                                </BugScrollbars>
                            </StyledPageContent>
                        </Route>
                        <Route exact path="/system/logs/:panelId">
                            <StyledPageContent>
                                <BugScrollbars>
                                    <PageSystemLogs />
                                </BugScrollbars>
                            </StyledPageContent>
                        </Route>
                        <Route exact path="/system/about">
                            <StyledPageContent>
                                <BugScrollbars>
                                    <PageSystemAbout />
                                </BugScrollbars>
                            </StyledPageContent>
                        </Route>
                        <Route exact path="/system/backup">
                            <StyledPageContent>
                                <BugScrollbars>
                                    <PageSystemBackup />
                                </BugScrollbars>
                            </StyledPageContent>
                        </Route>
                        <Route exact path="/login">
                            <Redirect to="/" />
                        </Route>
                    </Suspense>
                </Switch>
            </Box>
        </>
    );
};

export default PageContent;
