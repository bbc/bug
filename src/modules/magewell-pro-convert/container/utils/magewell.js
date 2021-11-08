const axios = require("axios");
const md5 = require("md5");

let cookie;
let status;

class Magewell {
    constructor(address, username, password) {
        this.address = address;
        this.username = username;
        this.hash = md5(password);
    }

    async login() {
        const response = await axios.get(`http://${this.address}/mwapi`, {
            params: {
                method: "login",
                id: this.username,
                pass: this.hash,
            },
        });

        if (response.data.status === 0) {
            cookie = response.headers["set-cookie"];
        } else {
            console.log("magewell-pro-convert: Device login failed");
        }
        status = response.data.status;
    }

    async logout() {
        const response = await axios.get(`http://${workerData.address}/mwapi`, {
            params: {
                method: "logout",
            },
        });
        console.log("magewell-pro-convert: Device logged out");
    }

    async fetchSources() {
        if (status !== 0) {
            await this.login();
        }

        const response = await axios.get(`http://${this.address}/mwapi`, {
            headers: {
                Cookie: cookie,
            },
            params: { method: "get-ndi-sources" },
        });

        status = response.data.status;
        return response.data?.sources;
    }

    async fetchData(method) {
        if (status !== 0) {
            await this.login();
        }

        const response = await axios.get(`http://${this.address}/mwapi`, {
            headers: {
                Cookie: cookie,
            },
            params: { method: method },
        });

        status = response.data.status;
        delete response.data.status;

        const data = response?.data;

        if (typeof data === "object") {
            return data;
        }

        return null;
    }

    async setData(method, data) {
        if (status !== 0) {
            await this.login();
        }

        const params = { ...{ method: method }, ...data };

        const response = await axios.get(`http://${this.address}/mwapi`, {
            headers: {
                Cookie: cookie,
            },
            params: params,
        });

        status = response.data.status;
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
}

module.exports = Magewell;
