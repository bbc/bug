import BadgeWrapper from "@components/BadgeWrapper";
import CollapsibleBugAlert from "@components/CollapsibleBugAlert";
import PanelDropdownMenu from "@components/panels/PanelDropdownMenu";
import BugDynamicIcon from "@core/BugDynamicIcon";
import BugRestrictTo from "@core/BugRestrictTo";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import CircularProgress from "@mui/material/CircularProgress";
import Grid from "@mui/material/Grid";
import { styled } from "@mui/material/styles";
import { Link } from "react-router-dom";

const StyledCardHeader = styled(CardHeader)(({ theme }) => ({
    padding: "8px 0px",
    "& .MuiCardHeader-title": {
        fontSize: "1.1rem",
        fontWeight: "500",
        textTransform: "none",
        overflow: "hidden",
        textOverflow: "ellipsis",
        whiteSpace: "nowrap",
    },
    "& .MuiCardHeader-subheader": {
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
}));

const StyledCard = styled(Card)(({ theme }) => ({
    "& .MuiBadge-badge": {
        "@media (min-width:601px)": {
            display: "none",
        },
    },
}));

const StyledLink = styled(Link)({
    textDecoration: "none",
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

        if (panel._dockerContainer._isBuilding) {
            itemsToRender = [
                {
                    key: "building",
                    type: "info",
                    message: "Panel is building - please wait",
                    flags: [],
                    panel: null,
                },
            ];
        } else {
            // if we only have critical alerts, just show them
            const criticalStatusOnly = panel._status && panel._status.filter((x) => x.type === "critical");
            if (criticalStatusOnly.length > 0) {
                itemsToRender = criticalStatusOnly;
            }
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
        <StyledGrid item key={panel.id} sx={{ width: "100%" }}>
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
                                {panel?._dockerContainer?._isBuilding ? (
                                    <CircularProgress size={24} />
                                ) : (
                                    <BugDynamicIcon iconName={panel._module.icon} />
                                )}
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
