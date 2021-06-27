import { configureStore } from "@reduxjs/toolkit";
import panelListSlice from "./panelListSlice";
import panelConfigSlice from "./panelConfigSlice";
import pageTitleSlice from "./pageTitleSlice";
import panelSlice from "./panelSlice";
import userSlice from "./userSlice";

export default configureStore({
    reducer: {
        panelList: panelListSlice.reducer,
        pageTitle: pageTitleSlice.reducer,
        panelConfig: panelConfigSlice.reducer,
        panel: panelSlice.reducer,
        user: userSlice.reducer,
    },
});
