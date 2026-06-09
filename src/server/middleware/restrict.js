const strategyGetEnabledCount = require("@services/strategy-getenabledcount");
const checkUserRoles = require("@services/user-roles-check");
const hashResponse = require("@core/hash-response");
const userGet = require("@services/user-get");
const panelCheckKey = require("@services/panelconfig-checkkey");
const keyClean = require("@utils/key-clean");
const isPublicRoute = require("@services/panel-ispublicroute");
const logger = require("@core/logger")(module);

const logoutAsync = async (req) => {
    if (typeof req?.logout !== "function") {
        return null;
    }

    if (req.logout.length > 0) {
        return new Promise((resolve, reject) => {
            req.logout((error) => {
                if (error) {
                    reject(error);
                    return;
                }

                resolve(null);
            });
        });
    }

    return req.logout();
};

const restrictedTo = (roles) => {
    const checkCredentials = async (req, res, next) => {
        // checks if the request is directed at a panel and if the route is not subject to auth
        if (await isPublicRoute(req.params.panelid, req.path)) {
            return next();
        }

        // check if any stragetgies are enabled
        if ((await strategyGetEnabledCount()) === 0) {
            try {
                await logoutAsync(req);
            } catch (error) {
                logger.warning(`Failed to logout unauthenticated request for ${req.path}: ${error}`);
            }
            return next();
        }

        // if the endpoint is allowed to be accessed from a panel - check its keys
        if (roles.includes("panel")) {
            const apiKey = await keyClean(await req.headers["authorization"]);
            if (await panelCheckKey(apiKey)) {
                return next();
            }
        }

        // check if user has been authenticated by passport
        if (await req.isAuthenticated()) {
            // gets up to date info on the user from the model
            const user = await userGet(req.user);

            // check if the user is still enabled
            if (!user?.enabled) {
                try {
                    await logoutAsync(req);
                } catch (error) {
                    logger.warning(`Failed to logout disabled user ${user?.username}: ${error}`);
                }
                logger.warning(`Unauthorized access attempt to ${req.path} from ${req.ip} with user ${user?.username} - account disabled`);
                return hashResponse(res, req, {
                    status: "failure",
                    message: `Sorry to BUG but you're not authorised, please log in.`,
                    data: req?.user,
                });
            }

            // check if the user has the correct roles
            if (!checkUserRoles(roles, user?.roles)) {

                logger.warning(`Unauthorized access attempt to ${req.path} from ${req.ip} with user ${user?.username} - insufficient rights`);
                return hashResponse(res, req, {
                    status: "failure",
                    message: `Sorry to BUG but you don't have any of these roles - ${roles.toString()}.`,
                    data: null,
                });
            }
            return next();
        }

        // user must not pass. Give them the news
        logger.warning(`Unauthorized access attempt to ${req.path} from ${req.ip}`);
        return hashResponse(res, req, {
            status: "failure",
            message: `Sorry to BUG but you're not authorised, please log in.`,
            data: req?.user,
        });
    };

    return checkCredentials;
};

module.exports = {
    to: restrictedTo,
};
