import React, { useEffect } from 'react';
import { connect } from "react-redux";
import { update } from '../redux/instancesSlice';
import axios from 'axios';

function mapDispatchToProps(dispatch) {
    return {
        update: (instanceData) => dispatch(update(instanceData)),
    };
};

// function test(props) {
//     props.addArticle({ text: "YEH BABY", id: Date.now()});
// }

async function fetch(props) {
    try {
        const response = await axios.get('/api/instance/config/');
        props.update(response.data);
    } catch (error) {
        console.error(error);
    }
}

function InstancePoller (props) {

    useEffect(() => {
        fetch(props);
    }, []);

    return props.children;
}

export default connect(null, mapDispatchToProps)(InstancePoller);
