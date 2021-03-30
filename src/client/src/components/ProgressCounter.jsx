import React, { useRef, useEffect, useState } from "react";
import ReactDOM from "react-dom";
import CountUp from 'react-countup';

const usePreviousValue = value => {
    const ref = useRef();
    useEffect(() => {
        ref.current = value;
    });
    return ref.current;
};

export default function ProgressCounter(props) { 

    let prevValue = usePreviousValue(props.value)

    if(props.value === -1) {
        return null;
    }
    if(prevValue === undefined) {
        prevValue = 0;
    }
    return <CountUp start={prevValue} end={props.value} />
}