import PageSystemAbout from "@components/system/PageSystemAbout";
import PageSystemBackup from "@components/system/PageSystemBackup";
import PageSystemConfiguration from "@components/system/PageSystemConfiguration";
import PageSystemHealth from "@components/system/PageSystemHealth";
import PageSystemInformation from "@components/system/PageSystemInformation";
import PageSystemLogs from "@components/system/PageSystemLogs";
import PageSystemModules from "@components/system/PageSystemModules";
import PageSystemSecurity from "@components/system/PageSystemSecurity";
import PageSystemSecurityStrategy from "@components/system/PageSystemSecurityStrategy";
import PageSystemSoftware from "@components/system/PageSystemSoftware";
import PageSystemUserEdit from "@components/system/PageSystemUserEdit";
import PageSystemUsers from "@components/system/PageSystemUsers";
import BugLoading from "@core/BugLoading";
import BugRestrictTo from "@core/BugRestrictTo";
import BugScrollbars from "@core/BugScrollbars";
import Box from "@mui/material/Box";
import { styled } from "@mui/material/styles";
import { Suspense, lazy } from "react";
import { Redirect } from "react-router";
import { Route, Switch } from "react-router-dom";

//Page Lazy Loads
const PageHome = lazy(() => import("./PageHome"));
const PagePanel = lazy(() => import("./PagePanel"));
const PagePanels = lazy(() => import("./PagePanels"));
const PagePanelsAdd = lazy(() => import("./PagePanelsAdd"));
const PagePanelsEdit = lazy(() => import("./PagePanelsEdit"));
const PageSystem = lazy(() => import("./PageSystem"));

const StyledPageContent = styled("div")(({ theme }) => ({
    height: "100%",
    padding: "4px",
    [theme.breakpoints.down(600)]: {
        padding: 0,
    },
}));

const StyledHomePageContent = styled("div")(({ theme }) => ({
    height: "100%",
    padding: 8,
    [theme.breakpoints.down(1200)]: {
        padding: 4,
    },
    [theme.breakpoints.down(1024)]: {
        padding: 2,
    },
    [theme.breakpoints.down(600)]: {
        padding: 0,
    },
}));

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
                        <BugRestrictTo role="admin">
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

                            <Route exact path="/system/health">
                                <StyledPageContent>
                                    <BugScrollbars>
                                        <PageSystemHealth />
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

                            <Route exact path="/system/backup">
                                <StyledPageContent>
                                    <BugScrollbars>
                                        <PageSystemBackup />
                                    </BugScrollbars>
                                </StyledPageContent>
                            </Route>
                        </BugRestrictTo>
                        <BugRestrictTo role="user">
                            <Route path="/panel/:panelid">
                                <StyledPageContent>
                                    <BugScrollbars>
                                        <PagePanel />
                                    </BugScrollbars>
                                </StyledPageContent>
                            </Route>
                        </BugRestrictTo>
                        <Route exact path="/">
                            <StyledHomePageContent>
                                <BugScrollbars>
                                    <PageHome />
                                </BugScrollbars>
                            </StyledHomePageContent>
                        </Route>

                        <Route exact path="/system/about">
                            <StyledPageContent>
                                <BugScrollbars>
                                    <PageSystemAbout />
                                </BugScrollbars>
                            </StyledPageContent>
                        </Route>

                        <Route exact path="/system/modules">
                            <StyledPageContent>
                                <BugScrollbars>
                                    <PageSystemModules />
                                </BugScrollbars>
                            </StyledPageContent>
                        </Route>

                        <Route exact path="/system/info">
                            <StyledPageContent>
                                <BugScrollbars>
                                    <PageSystemInformation />
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
