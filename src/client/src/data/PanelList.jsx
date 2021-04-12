import React from 'react';
import ApiPoller from '@utils/ApiPoller';
import { useDispatch } from 'react-redux';
import panelListSlice from '../redux/panelListSlice';
export const PanelContext = React.createContext();

export default function PanelList(props) {

    const dispatch = useDispatch()
    const setSuccess = (result) => {
        dispatch(panelListSlice.actions[result['status']](result));
    };

    return (
        <>
            <ApiPoller url="/api/panel/" interval="1000" onChanged={(result) => setSuccess(result)}/>
            {props.children}
        </>
    )
}