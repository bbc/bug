import { Typography } from "@mui/material";
import { useSelector } from "react-redux";

export default function PageTitle(props) {
    const pageTitle = useSelector((state) => state.pageTitle);

    return (
        <>
            <Typography variant="h6" noWrap>
                {pageTitle}
            </Typography>
        </>
    );
}
