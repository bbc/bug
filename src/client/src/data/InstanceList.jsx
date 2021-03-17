import React from 'react';
import ApiPoller from '../utils/ApiPoller';

export const InstanceContext = React.createContext();

export default function InstanceList(props) {

    const [ value, setValue ] = React.useState({
        status: 'idle', 
        data: [],
        error: null
    });

    return (
        <InstanceContext.Provider value={value}>
            <ApiPoller url="/api/instance/config/" interval="1000" onChanged={(result) => setValue(result)}/>
            {props.children}
        </InstanceContext.Provider>
    )
}
