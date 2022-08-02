import React from "react";
import BugDynamicIcon from "@core/BugDynamicIcon";
import { Link } from "react-router-dom";
import Grid from "@mui/material/Grid";
import BadgeWrapper from "@components/BadgeWrapper";
import CollapsibleBugAlert from "@components/CollapsibleBugAlert";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import PanelDropdownMenu from "@components/panels/PanelDropdownMenu";
import { styled } from "@mui/material/styles";
import BugRestrictTo from "@core/BugRestrictTo";

const StyledCardHeader = styled(CardHeader)({
    padding: "8px 0px",
    "&:hover": {
        background: "#333",
    },
    "& .MuiCardHeader-title": {
        color: "rgba(255, 255, 255, 1)",
        fontSize: "1.1rem",
        fontWeight: "500",
        textTransform: "none",
        overflow: "hidden",
        textOverflow: "ellipsis",
        whiteSpace: "nowrap",
    },
    "& .MuiCardHeader-subheader": {
        color: "rgba(255, 255, 255, 0.4)",
        fontSize: "0.9rem",
        overflow: "hidden",
        textOverflow: "ellipsis",
        whiteSpace: "nowrap",
    },
    "& .MuiCardHeader-action": {
        margin: "0px",
        flexShrink: 0,
    },
    "& .MuiCardHeader-avatar": {
        marginLeft: "16px",
        flexShrink: 0,
    },
    "& .MuiCardHeader-content": {
        minWidth: "0px",
        flexShrink: 1,
    },
});

const StyledCard = styled(Card)({
    backgroundColor: "#262626",
    "&:hover": {
        background: "#333",
    },
    "& .MuiBadge-badge": {
        "@media (min-width:601px)": {
            display: "none",
        },
    },
});

const StyledBugDynamicIcon = styled(BugDynamicIcon)(({ theme }) => ({
    color: theme.palette.primary.main,
}));

const StyledLink = styled(Link)({
    color: "#cccccc",
    textDecoration: "none",
    "&:hover": {
        color: "#fff",
    },
});

const StyledCardContent = styled(CardContent)({
    padding: "0px",
    "&:last-child": {
        paddingBottom: "0px",
    },
    "@media (max-width:599px)": {
        display: "none",
    },
});

const StyledGrid = styled(Grid)({
    padding: "8px",
    "@media (max-width:1200px)": {
        padding: "4px",
    },
    "@media (max-width:1024px)": {
        padding: "2px",
    },
    "@media (max-width:600px)": {
        padding: "0px",
        paddingBottom: "1px",
    },
    "@media (max-height:400px)": {
        padding: "4px",
        paddingBottom: "1px",
    },
});

const HomeTile = ({ panel }) => {
    if (!panel.enabled) {
        return null;
    }

    const renderStatusItems = () => {
        let itemsToRender = panel._status;

        // if we only have critical alerts, just show them
        const criticalStatusOnly = panel._status && panel._status.filter((x) => x.type === "critical");
        if (criticalStatusOnly.length > 0) {
            itemsToRender = criticalStatusOnly;
        }

        // otherwise, show everything
        return itemsToRender.map((eachItem) => (
            <StyledCardContent key={eachItem.key}>
                <CollapsibleBugAlert
                    type={eachItem.type}
                    message={eachItem.message}
                    flags={eachItem.flags}
                    panel={panel}
                    square
                />
            </StyledCardContent>
        ));
    };

    return (
        <StyledGrid item xl={3} lg={4} sm={6} xs={12} key={panel.id}>
            <StyledLink key={panel.id} to={`/panel/${panel.id}`}>
                <StyledCard>
                    <StyledCardHeader
                        avatar={
                            <BadgeWrapper
                                panel={panel}
                                position={{
                                    vertical: "top",
                                    horizontal: "right",
                                }}
                            >
                                <StyledBugDynamicIcon iconName={panel._module.icon} />
                            </BadgeWrapper>
                        }
                        action={
                            <BugRestrictTo role="admin">
                                <PanelDropdownMenu panel={panel} />
                            </BugRestrictTo>
                        }
                        title={panel.title}
                        subheader={panel.description ? panel.description : panel._module.description}
                    />
                    {panel !== null && renderStatusItems()}
                </StyledCard>
            </StyledLink>
        </StyledGrid>
    );
};

export default HomeTile;
