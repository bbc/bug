import React, { useEffect } from 'react';
// import { connect, useDispatch } from "react-redux";
import { useDispatch } from "react-redux";
import { fetchInstances } from '../redux/instancesSlice';
import axios from 'axios';

// function mapDispatchToProps(dispatch) {
//     return {
//         update: (instanceData) => dispatch(update(instanceData)),
//     };
// };

// function test(props) {
//     props.addArticle({ text: "YEH BABY", id: Date.now()});
// }

// async function fetch(props) {
//     try {
//         const response = await axios.get('/api/instance/config/');
//         props.update(response.data);
//     } catch (error) {
//         console.error(error);
//     }
// }

function InstancePoller (props) {

    const dispatch = useDispatch();

    useEffect(() => {
        // fetch(props);
        dispatch(fetchInstances())
    }, []);

    // useEffect(() => {
    //     if (postStatus === 'idle') {
    //       dispatch(fetchPosts())
    //     }
    // }, [postStatus, dispatch])

    return props.children;
}

export default InstancePoller; //connect(null, mapDispatchToProps)(InstancePoller);
