import React from "react";
import { connect } from "react-redux";

import {
    addArticle,
    startPoll
} from '../redux/instancesSlice';
  
function mapStateToProps(state) {
    return { instances: state.instances };
};

function mapDispatchToProps(dispatch) {
    return {
        addArticle: (article) => dispatch(addArticle(article)),
    };
};

function test(props) {
    props.addArticle({ text: "YEH BABY", id: Date.now()});
}

function ReduxList (props) {
    let instances = props.instances;
    console.log(instances);
    return (
        <>
            <ul>
                {instances.map((el) => (
                    <li key={el.id}>{el.text}</li>
                ))}
            </ul>
            <input type="button" onClick={() => test(props)} value="Test"></input>
        </>
    )
}

export default connect(mapStateToProps, mapDispatchToProps)(ReduxList);
