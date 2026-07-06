const axios = require("axios");
const crypto = require("crypto");

class MagewellClient {
    constructor(options = {}) {
        this.address = options.address;
        this.username = options.username;
        this.password = options.password;
        this.protocol = options.protocol || "http";
        this.apiPath = options.apiPath || "/mwapi";
        this.codeField = options.codeField || "status";
        this.timeout = options.timeout || 2000;
        this.successCodes = options.successCodes || [0];
        this.authFailureCodes = options.authFailureCodes || [36, 37, -17];
        this.autoLogin = options.autoLogin !== false;

        this.cookie = null;
    }

    get baseUrl() {
        return `${this.protocol}://${this.address}${this.apiPath}`;
    }

    static md5(value) {
        return crypto.createHash("md5").update(String(value || ""), "utf8").digest("hex");
    }

    normalizeResponse(data) {
        const code = Number(data?.[this.codeField]);
        const payload = { ...(data || {}) };
        delete payload[this.codeField];

        return {
            ok: this.successCodes.includes(code),
            code,
            payload,
            raw: data,
        };
    }

    async send(method, params = {}, options = {}) {
        const response = await axios.get(this.baseUrl, {
            params: {
                method,
                ...params,
            },
            timeout: options.timeout || this.timeout,
            headers: this.cookie ? { Cookie: this.cookie } : undefined,
        });

        return response;
    }

    async login() {
        const response = await this.send("login", {
            id: this.username,
            pass: MagewellClient.md5(this.password),
        }, { timeout: this.timeout });

        this.cookie = response.headers?.["set-cookie"] || this.cookie;
        return this.normalizeResponse(response.data);
    }

    async logout() {
        const response = await this.send("logout");
        this.cookie = null;
        return this.normalizeResponse(response.data);
    }

    async request(method, params = {}, options = {}) {
        if (!this.address) {
            throw new Error("Magewell client requires an address");
        }

        const requireAuth = options.requireAuth !== false;
        const allowCodes = options.allowCodes || [];
        const acceptedCodes = new Set([...this.successCodes, ...allowCodes]);

        if (requireAuth && this.autoLogin && !this.cookie) {
            await this.login();
        }

        try {
            let response = await this.send(method, params, options);
            let normalized = this.normalizeResponse(response.data);

            if (
                requireAuth &&
                this.autoLogin &&
                this.authFailureCodes.includes(normalized.code)
            ) {
                await this.login();
                response = await this.send(method, params, options);
                normalized = this.normalizeResponse(response.data);
            }

            return {
                ...normalized,
                ok: acceptedCodes.has(normalized.code),
            };
        } catch (error) {
            const clientError = new Error(`Magewell request failed: ${method}`);
            clientError.cause = error;
            throw clientError;
        }
    }
}

module.exports = MagewellClient;
