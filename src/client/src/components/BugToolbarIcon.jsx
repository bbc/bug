import { IconButton } from "@mui/material";
export default function BugToolbarIcon(props) {
    return (
        <IconButton
            sx={{
                "& .MuiButton-startIcon": {
                    margin: "0px",
                },
                margin: "4px",
            }}
            {...props}
        >
            {props.children}
        </IconButton>
    );
}
