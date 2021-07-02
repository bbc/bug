const userGet = require("@services/user-get");
const logger = require("@utils/logger")(module);

let users = {};
let enableUserPoll = {};
let userTimers = {};

module.exports = (namespace, socket) => {
    let lastUserId;

    const onSocket = async () => {
        if (socket.request.user) {
            // we store this in case the client gets disconnected - it's the last user id they were looking at
            lastUserId = socket.request.user;

            logger.debug(`socket id ${socket.id} subscribed to userId ${lastUserId}`);

            // join the room
            socket.join(`userId:${lastUserId}`);

            // send a new update to the room (cos this client is waiting for it)
            users[lastUserId] = await wrapUser(lastUserId);
            socket.emit("event", users[lastUserId]);
        }
    };

    const wrapUser = async (userId) => {
        try {
            return {
                status: "success",
                data: await userGet(userId),
            };
        } catch (error) {
            return {
                status: "error",
                message: `Failed to get user ${userId}`,
            };
        }
    };

    const poll = async (userId) => {
        // just in case
        clearTimeout(userTimers[userId]);

        if (userId) {
            // fetch the user
            const newUser = await wrapUser(userId);

            // see if it's changed
            if (JSON.stringify(users[userId]) !== JSON.stringify(newUser)) {
                // save for next time
                users[userId] = newUser;

                // send it out
                namespace.to(`userId:${lastUserId}`).emit("event", newUser);
            }
        }

        // we check this to prevent race conditions
        // (where the room has been deleted while we've been running the previous steps)
        if (enableUserPoll[userId]) {
            userTimers[userId] = setTimeout(() => poll(userId), 1000);
        } else {
            logger.debug(`socket id ${socket.id} stopped polling ${userId}`);
        }
    };

    namespace.adapter.once("join-room", (room, id) => {
        const roomElements = room.split(":");
        if (roomElements[0] === "userId") {
            logger.debug(`socket id ${id} joined room ${roomElements[1]}`);
        }
    });

    namespace.adapter.once("leave-room", (room, id) => {
        const roomElements = room.split(":");
        if (roomElements[0] === "userId") {
            logger.debug(`socket id ${id} left room ${roomElements[1]}`);
        }
    });

    namespace.adapter.once("create-room", (room) => {
        const elements = room.split(":");
        if (elements.length !== 2) {
            return;
        }

        if (elements[0] !== "userId") {
            return;
        }

        if (!enableUserPoll[elements[1]]) {
            logger.debug(`socket id ${socket.id} started polling ${elements[1]}`);

            // toggle the enabled flag
            enableUserPoll[elements[1]] = true;

            // start the regular timer to poll user
            poll(elements[1]);
        }
    });

    namespace.adapter.once("delete-room", (room) => {
        // this may be a user or the default room for each socket
        const elements = room.split(":");
        if (elements.length !== 2) {
            return;
        }

        if (elements[0] !== "userId") {
            return;
        }

        if (enableUserPoll[elements[1]]) {
            logger.debug(`socket id ${socket.id} stopped polling ${elements[1]}`);
            enableUserPoll[elements[1]] = false;

            // if the timer is valid (it was probably)
            if (userTimers[elements[1]]) {
                clearTimeout(userTimers[elements[1]]);
            }
        }
    });

    socket.on("disconnect", () => {
        // leave the room
        logger.debug(`socket id ${socket.id} unsubscribed from userId ${userId}`);
        socket.leave(`userId:${userId}`);

        if (lastUserId) {
            // clear socket id from list and check if timer needs stopping
            logger.debug(`socket id ${socket.id} unsubscribed from userId ${lastUserId}`);
            socket.leave(`userId:${lastUserId}`);
        }
    });

    onSocket();
};
