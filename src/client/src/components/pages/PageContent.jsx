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

const PageContent = ({ roles }) => {
    const userContent = [
        <Route key="panel/:panelid" path="/panel/:panelid">
            <StyledPageContent>
                <BugScrollbars>
                    <PagePanel />
                </BugScrollbars>
            </StyledPageContent>
        </Route>,
    ];

    const adminContent = [
        <Route exact key="/panels" path="/panels">
            <StyledPageContent>
                <BugScrollbars>
                    <PagePanels />
                </BugScrollbars>
            </StyledPageContent>
        </Route>,
        <Route exact key="/panels/add" path="/panels/add">
            <StyledPageContent>
                <BugScrollbars>
                    <PagePanelsAdd />
                </BugScrollbars>
            </StyledPageContent>
        </Route>,
        <Route exact key="/panels/edit" path="/panels/edit">
            <StyledPageContent>
                <BugScrollbars>
                    <PagePanelsEdit />
                </BugScrollbars>
            </StyledPageContent>
        </Route>,
        <Route exact key="/system" path="/system">
            <StyledPageContent>
                <BugScrollbars>
                    <PageSystem />
                </BugScrollbars>
            </StyledPageContent>
        </Route>,
        <Route exact key="/system/configuration" path="/system/configuration">
            <StyledPageContent>
                <BugScrollbars>
                    <PageSystemConfiguration />
                </BugScrollbars>
            </StyledPageContent>
        </Route>,
        <Route exact key="/system/users" path="/system/users">
            <StyledPageContent>
                <BugScrollbars>
                    <PageSystemUsers />
                </BugScrollbars>
            </StyledPageContent>
        </Route>,
        <Route exact key="/system/user" path="/system/user">
            <StyledPageContent>
                <BugScrollbars>
                    <PageSystemUserEdit />
                </BugScrollbars>
            </StyledPageContent>
        </Route>,
        <Route exact key="/system/user/:userId" path="/system/user/:userId">
            <StyledPageContent>
                <BugScrollbars>
                    <PageSystemUserEdit />
                </BugScrollbars>
            </StyledPageContent>
        </Route>,
        <Route exact key="/system/security" path="/system/security">
            <StyledPageContent>
                <BugScrollbars>
                    <PageSystemSecurity />
                </BugScrollbars>
            </StyledPageContent>
        </Route>,
        <Route exact key="/system/security/edit" path="/system/security/edit">
            <StyledPageContent>
                <BugScrollbars>
                    <PageSystemSecurity edit />
                </BugScrollbars>
            </StyledPageContent>
        </Route>,
        <Route exact key="/system/security/:type" path="/system/security/:type">
            <StyledPageContent>
                <BugScrollbars>
                    <PageSystemSecurityStrategy />
                </BugScrollbars>
            </StyledPageContent>
        </Route>,
        <Route exact key="/system/software" path="/system/software">
            <StyledPageContent>
                <BugScrollbars>
                    <PageSystemSoftware />
                </BugScrollbars>
            </StyledPageContent>
        </Route>,
        <Route exact key="/system/info" path="/system/info">
            <StyledPageContent>
                <BugScrollbars>
                    <PageSystemInfo />
                </BugScrollbars>
            </StyledPageContent>
        </Route>,
        <Route exact key="/system/logs" path="/system/logs">
            <StyledPageContent>
                <BugScrollbars>
                    <PageSystemLogs />
                </BugScrollbars>
            </StyledPageContent>
        </Route>,
        <Route exact key="/system/logs/:panelId" path="/system/logs/:panelId">
            <StyledPageContent>
                <BugScrollbars>
                    <PageSystemLogs />
                </BugScrollbars>
            </StyledPageContent>
        </Route>,
        <Route exact key="/system/backup" path="/system/backup">
            <StyledPageContent>
                <BugScrollbars>
                    <PageSystemBackup />
                </BugScrollbars>
            </StyledPageContent>
        </Route>,
    ];

    const allContent = [
        <Route key="/" exact path="/">
            <StyledHomePageContent>
                <BugScrollbars>
                    <PageHome />
                </BugScrollbars>
            </StyledHomePageContent>
        </Route>,
        <Route exact key="/system/about" path="/system/about">
            <StyledPageContent>
                <BugScrollbars>
                    <PageSystemAbout />
                </BugScrollbars>
            </StyledPageContent>
        </Route>,
        <Route exact key="/login" path="/login">
            <Redirect to="/" />
        </Route>,
        <Redirect to="/" />,
    ];

    const getContent = (roles) => {
        let content = allContent;
        if (roles.includes("user")) {
            content = content.concat(userContent);
        }
        if (roles.includes("admin")) {
            content = content.concat(adminContent);
        }
        return content;
    };
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
                    <Suspense fallback={<BugLoading />}>{getContent(roles)}</Suspense>
                </Switch>
            </Box>
        </>
    );
};

export default PageContent;
