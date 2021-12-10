import React from "react";
import Card from "@mui/material/Card";
import Box from "@mui/material/Box";
import CardHeader from "@mui/material/CardHeader";
import BugDetailsTable from "@core/BugDetailsTable";
import Collapse from "@mui/material/Collapse";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import IconButton from "@mui/material/IconButton";
import { styled } from "@mui/material/styles";

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

const MemoizedBugDetailsTable = ({ width, data }) => {
    return React.useMemo(() => <BugDetailsTable width={width} gridLines={false} data={data} />, [data]);
};

function BugDetailsCard({ title, width, data, collapsible = false, collapsed = false, ...props }) {
    const [expanded, setExpanded] = React.useState(!collapsed);

    const handleExpandClick = () => {
        setExpanded(!expanded);
    };

    return (
        <Card
            sx={{
                minWidth: 300,
                textAlign: "left",
                color: "text.secondary",
                position: "relative",
                marginBottom: "8px",
            }}
            {...props}
        >
            {title && (
                <CardHeader
                    sx={{
                        "& .MuiCardHeader-title": {
                            fontWeight: 500,
                            color: "#ffffff",
                        },
                        height: "49px",
                        padding: "8px 16px",
                    }}
                    title={title}
                    action={
                        collapsible && (
                            <ExpandMore
                                expand={expanded}
                                onClick={handleExpandClick}
                                aria-expanded={expanded}
                                aria-label="show more"
                            >
                                <ExpandMoreIcon />
                            </ExpandMore>
                        )
                    }
                />
            )}
            {data && (
                <Collapse in={expanded} timeout="auto" unmountOnExit>
                    <Box sx={{ margin: "2px" }}>
                        <MemoizedBugDetailsTable width={width} gridLines={false} data={data} />
                    </Box>
                </Collapse>
            )}
        </Card>
    );
}

export default BugDetailsCard;
