const axios = require("axios");
const md5 = require("md5");

class Magewell {
    constructor(address, username, password, timeout = 2000) {
        this.cookie = null;
        this.status = null;
        this.address = address;
        this.username = username;
        this.hash = md5(password);
        this.timeout = timeout;
    }

    async login() {
        let response;
        if (this.address && this.username && this.hash) {
            try {
                response = await axios.get(`http://${this.address}/mwapi`, {
                    params: {
                        method: "login",
                        id: this.username,
                        pass: this.hash,
                    },
                    timeout: this.timeout,
                });
                this.status = response.data.status;
                if (!this.status === 0) {
                    console.log(`magewell-api: Failed to log into ${this.address}`);
                } else {
                    this.cookie = response.headers["set-cookie"];
                }
            } catch {
                this.status = false;
                console.log(`magewell-api: Failed to log into ${this.address}`);
            }
        }
        return this.status;
    }

    async logout() {
        const response = await axios.get(`http://${workerData.address}/mwapi`, {
            params: {
                method: "logout",
            },
            timeout: this.timeout,
        });
        console.log("magewell-api: Device logged out");
    }

    async fetchSources() {
        if (this.status !== 0) {
            await this.login();
        }

        try {
            const response = await axios.get(`http://${this.address}/mwapi`, {
                headers: {
                    Cookie: this.cookie,
                },
                params: { method: "get-ndi-sources" },
                timeout: this.timeout,
            });
            this.status = response.data.status;
        } catch {
            this.status = false;
            console.log(`magewell-api: cannot fetch data from ${this.address}`);
        }

        return this.status;
    }

    async fetchData(method) {
        if (this.status !== 0) {
            await this.login();
        }

        try {
            const response = await axios.get(`http://${this.address}/mwapi`, {
                headers: {
                    Cookie: this.cookie,
                },
                params: { method: method },
                timeout: this.timeout,
            });

            this.status = response.data.status;
            delete response.data.status;

            const data = response?.data;

            if (typeof data === "object") {
                return data;
            }
        } catch {
            console.log(`magewell-api: cannot fetch data from ${this.address}`);
        }
        return null;
    }

    async setData(method, data) {
        if (this.status !== 0) {
            await this.login();
        }

        const params = { ...{ method: method }, ...data };

        const response = await axios.get(`http://${this.address}/mwapi`, {
            headers: {
                Cookie: this.cookie,
            },
            params: params,
            timeout: this.timeout,
        });

        this.status = response.data.status;
        return response?.data;
    }
    getSources() {
        return this.fetchSources();
    }

    getNetwork() {
        return this.fetchData("get-eth-status");
    }

    getSignal() {
        return this.fetchData("get-signal-info");
    }

    getProduct() {
        return this.fetchData("get-caps");
    }

    getNDIConfig() {
        return this.fetchData("get-ndi-config");
    }

    getVideoConfig() {
        return this.fetchData("get-video-config");
    }

    getSummary() {
        return this.fetchData("get-summary-info");
    }

    reboot() {
        return this.fetchData("reboot");
    }

    setSource(name) {
        return this.setData("set-channel", { "ndi-name": true, name: name });
    }

    setName(name) {
        return this.setData("set-eth-config", { name: name });
    }

    setSourceName(name) {
        return this.setData("set-ndi-config", { "source-name": name });
    }

    setGroupName(name) {
        return this.setData("set-ndi-config", { "group-name": name });
    }

    setDiscoveryServer(address) {
        return this.setData("set-ndi-config", { "enable-discovery": true, "discovery-server": address });
    }
}

module.exports = Magewell;
