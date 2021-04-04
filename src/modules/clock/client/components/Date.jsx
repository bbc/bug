import React, { useState, useEffect } from "react";
import Typography from '@material-ui/core/Typography';

export default function DateString(props) {

    const [dateString, setDateString] = useState('DD/MM/YYYY');
    const days = ["Sunday", "Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
    const months = ['January','February','March','April','May','June','July','August','September','October','November','December'];
    
    useEffect(() => {
        getTime();
        setInterval(getTime,500);
    },[]);

    const getTime = () => {
        const now = new Date()
        const day = days[now.getDay()];
        const month = months[now.getMonth()];
        const year = now.getFullYear();
        const date = now.getDate()
        setDateString(day + ', ' + month + ' ' + date + ', ' + year);
    }

    return (
      <React.Fragment>
        <Typography variant="h5" component="p">
            { dateString }
        </Typography>
      </React.Fragment> 
    );
}