import React from "react";
import Typography from "@material-ui/core/Typography";
import { useSelector } from 'react-redux'

export default function PageTitle(props) {

    const pageTitle = useSelector((state) => state.pageTitle)

    return(
        <>
            <Typography variant="h6" noWrap>
                {pageTitle}
            </Typography>
        
        </>
    );
}
