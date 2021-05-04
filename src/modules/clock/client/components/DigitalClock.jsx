import React, { useState, useEffect } from "react";
import Typography from '@material-ui/core/Typography';

export default function DigitalClock(props) {

  const [time, setTime] = useState('hh:mm:ss');

  useEffect(() => {
    getTime()
    const interval = setInterval(getTime, 500);
    return () => { clearInterval(interval); }
  }, []);

  const pad = (n, width, z) => {
    z = z || '0';
    n = n + '';
    return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
  }

  const getTime = () => {
    const now = new Date()

    const hours = pad(now.getHours(), 2);
    const minutes = pad(now.getMinutes(), 2);
    const seconds = pad(now.getSeconds(), 2);

    setTime(hours + ":" + minutes + ":" + seconds);
  }

  return (
    <>
      <Typography variant="h1" component="p">
        {time}
      </Typography>
    </>
  );
}