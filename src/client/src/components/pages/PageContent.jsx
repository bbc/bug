import { Box } from "@mui/material";
import { styled } from "@mui/material/styles";
import { Suspense, lazy } from "react";
import { Navigate, Route, Routes } from "react-router-dom";

import BugLoading from "@core/BugLoading";
import BugRestrictTo from "@core/BugRestrictTo";
import BugScrollbars from "@core/BugScrollbars";

// Static imports
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

// Lazy-loaded pages
const PageHome = lazy(() => import("./PageHome"));
const PagePanel = lazy(() => import("./PagePanel"));
const PagePanels = lazy(() => import("./PagePanels"));
const PagePanelsAdd = lazy(() => import("./PagePanelsAdd"));
const PagePanelsEdit = lazy(() => import("./PagePanelsEdit"));
const PageSystem = lazy(() => import("./PageSystem"));

// Styled wrappers
const StyledPageContent = styled("div")(({ theme }) => ({
    height: "100%",
    padding: "4px",
    [theme.breakpoints.down(600)]: { padding: 0 },
}));

const StyledHomePageContent = styled("div")(({ theme }) => ({
    height: "100%",
    padding: 8,
    [theme.breakpoints.down(1200)]: { padding: 4 },
    [theme.breakpoints.down(1024)]: { padding: 2 },
    [theme.breakpoints.down(600)]: { padding: 0 },
}));

const PageContent = () => {
    return (
        <Box
            sx={{
                position: "absolute",
                top: "64px",
                bottom: 0,
                left: 0,
                right: 0,
                "@media (max-width:800px)": { top: "52px" },
            }}
        >
            <Routes>
                <Route
                    path="/panels"
                    element={
                        <Suspense fallback={<BugLoading />}>
                            <BugRestrictTo role="admin">
                                <StyledPageContent>
                                    <BugScrollbars>
                                        <PagePanels />
                                    </BugScrollbars>
                                </StyledPageContent>
                            </BugRestrictTo>
                        </Suspense>
                    }
                />
                <Route
                    path="/panels/add"
                    element={
                        <Suspense fallback={<BugLoading />}>
                            <BugRestrictTo role="admin">
                                <StyledPageContent>
                                    <BugScrollbars>
                                        <PagePanelsAdd />
                                    </BugScrollbars>
                                </StyledPageContent>
                            </BugRestrictTo>
                        </Suspense>
                    }
                />
                <Route
                    path="/panels/edit"
                    element={
                        <Suspense fallback={<BugLoading />}>
                            <BugRestrictTo role="admin">
                                <StyledPageContent>
                                    <BugScrollbars>
                                        <PagePanelsEdit />
                                    </BugScrollbars>
                                </StyledPageContent>
                            </BugRestrictTo>
                        </Suspense>
                    }
                />
                <Route
                    path="/system"
                    element={
                        <Suspense fallback={<BugLoading />}>
                            <BugRestrictTo role="admin">
                                <StyledPageContent>
                                    <BugScrollbars>
                                        <PageSystem />
                                    </BugScrollbars>
                                </StyledPageContent>
                            </BugRestrictTo>
                        </Suspense>
                    }
                />
                <Route
                    path="/system/configuration"
                    element={
                        <Suspense fallback={<BugLoading />}>
                            <BugRestrictTo role="admin">
                                <StyledPageContent>
                                    <BugScrollbars>
                                        <PageSystemConfiguration />
                                    </BugScrollbars>
                                </StyledPageContent>
                            </BugRestrictTo>
                        </Suspense>
                    }
                />
                <Route
                    path="/system/users"
                    element={
                        <Suspense fallback={<BugLoading />}>
                            <BugRestrictTo role="admin">
                                <StyledPageContent>
                                    <BugScrollbars>
                                        <PageSystemUsers />
                                    </BugScrollbars>
                                </StyledPageContent>
                            </BugRestrictTo>
                        </Suspense>
                    }
                />
                <Route
                    path="/system/user"
                    element={
                        <Suspense fallback={<BugLoading />}>
                            <BugRestrictTo role="admin">
                                <StyledPageContent>
                                    <BugScrollbars>
                                        <PageSystemUserEdit />
                                    </BugScrollbars>
                                </StyledPageContent>
                            </BugRestrictTo>
                        </Suspense>
                    }
                />
                <Route
                    path="/system/user/:userId"
                    element={
                        <Suspense fallback={<BugLoading />}>
                            <BugRestrictTo role="admin">
                                <StyledPageContent>
                                    <BugScrollbars>
                                        <PageSystemUserEdit />
                                    </BugScrollbars>
                                </StyledPageContent>
                            </BugRestrictTo>
                        </Suspense>
                    }
                />
                <Route
                    path="/system/security"
                    element={
                        <Suspense fallback={<BugLoading />}>
                            <BugRestrictTo role="admin">
                                <StyledPageContent>
                                    <BugScrollbars>
                                        <PageSystemSecurity />
                                    </BugScrollbars>
                                </StyledPageContent>
                            </BugRestrictTo>
                        </Suspense>
                    }
                />
                <Route
                    path="/system/security/edit"
                    element={
                        <Suspense fallback={<BugLoading />}>
                            <BugRestrictTo role="admin">
                                <StyledPageContent>
                                    <BugScrollbars>
                                        <PageSystemSecurity edit />
                                    </BugScrollbars>
                                </StyledPageContent>
                            </BugRestrictTo>
                        </Suspense>
                    }
                />
                <Route
                    path="/system/security/:type"
                    element={
                        <Suspense fallback={<BugLoading />}>
                            <BugRestrictTo role="admin">
                                <StyledPageContent>
                                    <BugScrollbars>
                                        <PageSystemSecurityStrategy />
                                    </BugScrollbars>
                                </StyledPageContent>
                            </BugRestrictTo>
                        </Suspense>
                    }
                />
                <Route
                    path="/system/software"
                    element={
                        <Suspense fallback={<BugLoading />}>
                            <BugRestrictTo role="admin">
                                <StyledPageContent>
                                    <BugScrollbars>
                                        <PageSystemSoftware />
                                    </BugScrollbars>
                                </StyledPageContent>
                            </BugRestrictTo>
                        </Suspense>
                    }
                />
                <Route
                    path="/system/health"
                    element={
                        <Suspense fallback={<BugLoading />}>
                            <BugRestrictTo role="admin">
                                <StyledPageContent>
                                    <BugScrollbars>
                                        <PageSystemHealth />
                                    </BugScrollbars>
                                </StyledPageContent>
                            </BugRestrictTo>
                        </Suspense>
                    }
                />
                <Route
                    path="/system/logs"
                    element={
                        <Suspense fallback={<BugLoading />}>
                            <BugRestrictTo role="admin">
                                <StyledPageContent>
                                    <BugScrollbars>
                                        <PageSystemLogs />
                                    </BugScrollbars>
                                </StyledPageContent>
                            </BugRestrictTo>
                        </Suspense>
                    }
                />
                <Route
                    path="/system/logs/:panelId"
                    element={
                        <Suspense fallback={<BugLoading />}>
                            <BugRestrictTo role="admin">
                                <StyledPageContent>
                                    <BugScrollbars>
                                        <PageSystemLogs />
                                    </BugScrollbars>
                                </StyledPageContent>
                            </BugRestrictTo>
                        </Suspense>
                    }
                />
                <Route
                    path="/system/backup"
                    element={
                        <Suspense fallback={<BugLoading />}>
                            <BugRestrictTo role="admin">
                                <StyledPageContent>
                                    <BugScrollbars>
                                        <PageSystemBackup />
                                    </BugScrollbars>
                                </StyledPageContent>
                            </BugRestrictTo>
                        </Suspense>
                    }
                />
                <Route
                    path="/system/about"
                    element={
                        <Suspense fallback={<BugLoading />}>
                            <BugRestrictTo role="admin">
                                <StyledPageContent>
                                    <BugScrollbars>
                                        <PageSystemAbout />
                                    </BugScrollbars>
                                </StyledPageContent>
                            </BugRestrictTo>
                        </Suspense>
                    }
                />
                <Route
                    path="/system/modules"
                    element={
                        <Suspense fallback={<BugLoading />}>
                            <BugRestrictTo role="admin">
                                <StyledPageContent>
                                    <BugScrollbars>
                                        <PageSystemModules />
                                    </BugScrollbars>
                                </StyledPageContent>
                            </BugRestrictTo>
                        </Suspense>
                    }
                />
                <Route
                    path="/system/info"
                    element={
                        <Suspense fallback={<BugLoading />}>
                            <BugRestrictTo role="admin">
                                <StyledPageContent>
                                    <BugScrollbars>
                                        <PageSystemInformation />
                                    </BugScrollbars>
                                </StyledPageContent>
                            </BugRestrictTo>
                        </Suspense>
                    }
                />

                <Route
                    path="/panel/:panelId/*"
                    element={
                        <Suspense fallback={<BugLoading />}>
                            <BugRestrictTo role="user">
                                <StyledPageContent>
                                    <BugScrollbars>
                                        <PagePanel />
                                    </BugScrollbars>
                                </StyledPageContent>
                            </BugRestrictTo>
                        </Suspense>
                    }
                />

                <Route
                    path="/"
                    element={
                        <Suspense fallback={<BugLoading />}>
                            <StyledHomePageContent>
                                <BugScrollbars>
                                    <PageHome />
                                </BugScrollbars>
                            </StyledHomePageContent>
                        </Suspense>
                    }
                />

                <Route path="/login" element={<Navigate to="/" replace />} />
            </Routes>
        </Box>
    );
};

export default PageContent;
