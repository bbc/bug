import React from 'react';
import axios from 'axios';

export default class ApiPoller extends React.Component {

    constructor(props) {
        super(props);
        this.timer = null;
        this.source = null;
        this.status = 'idle';
        this.data = null;
        this.error = null;
        this.hasLoaded = false;
    }

    componentDidMount() {
        this.fetch();
    }

    componentWillUnmount() {
        if(this.timer) {
            clearTimeout(this.timer);
        }
        this.source.cancel();
    }

    handleUpdated() {
        this.props.onChanged({
            status: this.status,
            data: this.data,
            error: this.error
        });
        // console.log(this.status, this.data);
    }

    async fetch() {
        clearTimeout(this.timer);

        if(!this.hasLoaded) {
            this.status = 'loading';
        }
        this.handleUpdated();

        // create cancel token
        const CancelToken = axios.CancelToken;
        this.source = CancelToken.source();

        try {
            const response = await axios.get(this.props.url, {
                cancelToken: this.source.token
            });
            this.status = 'succeeded';
            this.data = response.data;
            this.hasLoaded = true;
            this.handleUpdated();
            const _fetch = () => this.fetch()
            this.timer = setTimeout( _fetch, 10000 )
        } catch (error) {
            if(axios.isCancel(error)) {
                return;
            }
            this.status = 'failed';
            this.data = [];
            this.handleUpdated();
            const _fetch = () => this.fetch()
            this.timer = setTimeout( _fetch, 20000 )
            console.error(error)
        }
    }      
        
    render() {
        return null;
    }   
}
