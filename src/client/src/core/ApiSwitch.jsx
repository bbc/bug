import React from "react";
import Switch from "@material-ui/core/Switch";

class ApiSwitch extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            checked: props.checked
        };
        this.updateTimeout = props.timeout || 5000;
        this.enabled = true;
        this.timer = null;
    }

    handleChanged(event) {
        if(this.props.disabled) {
            return;
        }
        this.enabled = false;
        clearTimeout(this.timer);
        this.setState({
            checked: event.target.checked
        });
        this.props.onChange(event.target.checked);
        setTimeout(() => {
            this.enabled = true;
        }, this.updateTimeout);
    };

    render() {
        var checked = this.state.checked;
        if(this.props.checked === this.state.checked) {
            this.enabled = true;
        }

        if(this.enabled && this.props.checked !== this.state.checked) {
            checked = this.props.checked;
        }
        return (
            <Switch
                checked={checked}
                disabled={!this.enabled || this.props.disabled}
                color="primary"
                onChange={(e) => this.handleChanged(e)}
                onClick={(e) => {e.stopPropagation()}}
            />
        )
    }
}

export default ApiSwitch;
