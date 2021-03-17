import React from 'react';
import axios from 'axios';

class ApiPoller extends React.Component {

    constructor(props) {
        super(props);
        this.timer = null;
        this.source = null;

        this.state = {
            state: 'idle',
            result: null
        };
    }

    componentDidMount() {
        this.poll();
    }

    componentWillUnmount() {
        if(this.timer) {
            clearTimeout(this.timer);
        }
        this.source.cancel('User navigated to different page');
    }
    
    async poll() {
        clearTimeout(this.timer);

        this.setState({
            state: 'loading'
        });

        // create cancel token
        const CancelToken = axios.CancelToken;
        this.source = CancelToken.source();

        const refreshInterval = parseInt(this.props.interval) ?? 10000;
        try {
            const response = await axios.get(this.props.url, {
                cancelToken: this.source.token
            });
            this.setState({
                state: 'succeeded',
                result: response.data
            });
            this.timer = setTimeout(() => { this.poll(); }, refreshInterval);
            console.log(response.data);
        } catch (error) {
            if(axios.isCancel(error)) {
                console.log(error.message);
                return;
            }
            this.setState({
                state: 'failed',
            });
            this.timer = setTimeout(() => { this.poll(); }, refreshInterval);
            console.error(error)
        }
    }      
        
    render() {
        return <>Hey hey hey</>;
    }   
}

export default ApiPoller;
