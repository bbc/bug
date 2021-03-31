import React, { useState, useRef } from "react";
import Switch from "@material-ui/core/Switch";

export default function BugSwitch(props) {
    const [stateChecked, setStateChecked] = useState(props.checked);
    const updateTimeout = props.timeout || 5000;
    const enabled = useRef(true);
    const timer = useRef(null);

    const handleChanged = (event) => {
        // disable control
        enabled.current = false;

        // clear any previous timers
        clearTimeout(timer.current);

        // update state with new 'checked' valud
        setStateChecked(event.target.checked);

        // call the 'onChange' callback defined in props
        props.onChange(event.target.checked);

        // re-enable after timeout
        setTimeout(() => {
            enabled.current = true;
        }, updateTimeout.current);
    };

    var checkedDisplayValue = stateChecked;
    if(props.checked === stateChecked) {
        // the states agree - we can enable the control
        enabled.current = true;
    }
    if(enabled.current && props.checked != stateChecked) {
        // the states don't agree - prefer the prop value and wait for timeout
        checkedDisplayValue = props.checked;
    }

console.log('render');
    return (
        <Switch
            checked={checkedDisplayValue}
            disabled={!enabled.current}
            color="primary"
            onChange={(e) => handleChanged(e)}
        />
    )
}

// class BugSwitch extends React.Component {
//     constructor(props) {
//         super(props);
//         this.state = {
//             checked: props.checked
//         };
//         this.updateTimeout = props.timeout || 5000;
//         this.enabled = true;
//         this.timer = null;
//     }

//     handleChanged(event) {
//         this.enabled = false;
//         clearTimeout(this.timer);
//         this.setState({
//             checked: event.target.checked
//         });
//         this.props.onChange(event.target.checked);
//         setTimeout(() => {
//             this.enabled = true;
//         }, this.updateTimeout);
//     };

//     render() {
//         var checked = this.state.checked;
//         if(this.props.checked == this.state.checked) {
//             this.enabled = true;
//         }

//         if(this.enabled && this.props.checked != this.state.checked) {
//             checked = this.props.checked;
//         }
//         return (
//             <Switch
//                 checked={checked}
//                 disabled={!this.enabled}
//                 color="primary"
//                 onChange={(e) => this.handleChanged(e)}
//             />
//         )
//     }
// }

// export default BugSwitch;
