import React from "react";
import axios from "axios";
import { withSnackbar } from "notistack";

class ApiPoller extends React.Component {
    constructor(props) {
        super(props);
        this.timer = null;
        this.source = null;
        this.status = "idle";
        this.data = null;
        this.error = null;
        this.hasLoaded = false;
        this.interval = props.interval ?? 10000;
        this.debug = (props.debug === true);
    }

    componentDidMount() {
        this.fetch();
    }

    componentWillUnmount() {
        if (this.timer) {
            clearTimeout(this.timer);
        }
        this.source.cancel();
    }

    handleUpdated() {
        if(this.debug) {
            console.log("sending onChanged", this.status, this.data, this.error);
        }
        this.props.onChanged({
            status: this.status,
            data: this.data,
            error: this.error,
        });
    }

    async fetch() {
        clearTimeout(this.timer);

        if (!this.hasLoaded) {
            this.status = "loading";
        }
        this.handleUpdated();

        // create cancel token
        const CancelToken = axios.CancelToken;
        this.source = CancelToken.source();

        try {
            if(this.debug) {
                console.log(`ApiPoller: fetching from ${this.props.url}`);
            }
            const response = await axios.get(this.props.url, {
                cancelToken: this.source.token,
            });
            if(this.debug) {
                console.log(`ApiPoller: got data from ${this.props.url}:`, response.data);
            }
            if (response.data.status === "error") {
                throw response.data.message;
            }
            this.status = "success";
            this.data = response.data.data;
            this.hasLoaded = true;
            this.handleUpdated();
            const _fetch = () => this.fetch();
            this.timer = setTimeout(_fetch, this.interval);
        } catch (error) {
            if (axios.isCancel(error)) {
                return;
            }
            
            this.props.enqueueSnackbar("Failed to fetch panel list", {
                variant: "error",
            });

            this.status = "failed";
            this.data = [];
            this.handleUpdated();
            const _fetch = () => this.fetch();
            this.timer = setTimeout(_fetch, this.interval * 4);
            console.error(error);
        }
    }

    render() {
        return null;
    }
}

export default withSnackbar(ApiPoller);
