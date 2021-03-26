import React from 'react';
import ApiPoller from '@utils/ApiPoller';

export const PanelContext = React.createContext();

export default function PanelList(props) {

    const [ value, setValue ] = React.useState({
        status: 'idle', 
        data: [],
        error: null
    });

    return (
        <PanelContext.Provider value={value}>
            <ApiPoller url="/api/panel/" interval="1000" onChanged={(result) => setValue(result)}/>
            {props.children}
        </PanelContext.Provider>
    )
}
