import BugDetailsTable from "@core/BugDetailsTable";
import CloseIcon from "@mui/icons-material/Close";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { Box, Card, CardHeader, Collapse, IconButton, Paper } from "@mui/material";
import { styled } from "@mui/material/styles";
import React from "react";
const ExpandMore = styled((props) => {
    const { expand, ...other } = props;
    return <IconButton {...other} />;
})(({ theme, expand }) => ({
    transform: !expand ? "rotate(0deg)" : "rotate(180deg)",
    marginLeft: "auto",
    transition: theme.transitions.create("transform", {
        duration: theme.transitions.duration.shortest,
    }),
}));

const MemoizedBugDetailsTable = ({ width, items }) => {
    return React.useMemo(() => <BugDetailsTable width={width} gridLines={false} items={items} />, [items, width]);
};

function BugDetailsCard({
    title,
    width = "10rem",
    items = [],
    collapsible = false,
    closable = false,
    onClose,
    collapsed = false,
    sx = {},
    ...props
}) {
    const [expanded, setExpanded] = React.useState(!collapsed);

    const handleExpandClick = () => {
        setExpanded(!expanded);
    };

    const getAction = () => {
        if (collapsible) {
            return (
                <ExpandMore
                    expand={expanded}
                    onClick={handleExpandClick}
                    aria-expanded={expanded}
                    aria-label="show more"
                >
                    <ExpandMoreIcon />
                </ExpandMore>
            );
        }
        if (closable) {
            return (
                <IconButton onClick={onClose}>
                    <CloseIcon />
                </IconButton>
            );
        }
        return <Box sx={{ height: "40px" }}></Box>;
    };

    return (
        <Card
            component={Paper}
            square
            elevation={0}
            sx={{
                minWidth: 300,
                textAlign: "left",
                color: "text.secondary",
                position: "relative",
                marginBottom: "8px",
                ...sx,
            }}
            {...props}
        >
            {title && (
                <CardHeader
                    sx={{
                        "& .MuiCardHeader-title": {
                            fontWeight: 500,
                            color: "text.primary",
                        },
                        height: "32px",
                        padding: "8px 16px",
                        borderBottomWidth: "1px",
                        borderBottomStyle: "solid",
                        borderBottomColor: "border.light",
                    }}
                    title={title}
                    action={getAction()}
                />
            )}
            {items && (
                <Collapse in={expanded} timeout="auto" unmountOnExit>
                    <Box sx={{ margin: "2px" }}>
                        <MemoizedBugDetailsTable width={width} gridLines={false} items={items} />
                    </Box>
                </Collapse>
            )}
        </Card>
    );
}

export default BugDetailsCard;
