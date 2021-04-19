import React from 'react';
import ApiPoller from '@utils/ApiPoller';
import { useDispatch } from 'react-redux';
import moduleListSlice from '../redux/moduleListSlice';
export const ModuleContext = React.createContext();

export default function ModuleList(props) {

    const dispatch = useDispatch()
    const setSuccess = (result) => {
        dispatch(moduleListSlice.actions[result['status']](result));
    };

    return (
        <>
            <ApiPoller url="/api/module/" interval="1000" onChanged={(result) => setSuccess(result)}/>
            {props.children}
        </>
    )
}