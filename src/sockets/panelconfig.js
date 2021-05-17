const getPanelConfig = require("@services/panel-configget");
const { response } = require("@bin/api");

const intervals = {};
const panelsConfig = {};

const getPanelConfig = async (panelID) => {
  let response;
  try {
    response = {
      status: "success",
      data: await getPanelConfig(panelID),
    };
  } catch (error) {
    response = {
      status: "error",
      message: `Failed to get ${panelID} config`,
    };
  }
  return response;
};

const panelConfigHandler = (io, socket) => {
  socket.on("panelconfig", async (panelID) => {

    if (intervals[panelID]) {
      clearInterval(interval);
    } 
    else {
      intervals[panelID] = setInterval(async () => {
        const newPanelConfig = await getPanelConfig(panelID)

        if (JSON.stringify(panelsConfig[panelID]) !== JSON.stringify(newPanelConfig)) {
            panelsConfig[panelID] = newPanelConfig;
            io.emit("panel", panels);
        }
      }, 1000);
    }

    socket.join(panelID);
    socket.emit("panel", await getPanelConfig(panelID));
  });

  socket.on("disconnect", () => {
    clearInterval(interval);
  });
};

module.exports = panelHandler;
