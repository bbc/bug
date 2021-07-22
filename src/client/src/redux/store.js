import { configureStore } from "@reduxjs/toolkit";
import panelListSlice from "./panelListSlice";
import panelConfigSlice from "./panelConfigSlice";
import pageTitleSlice from "./pageTitleSlice";
import panelSlice from "./panelSlice";
import panelDataSlice from "./panelDataSlice";
import userSlice from "./userSlice";
import strategiesSlice from "./strategiesSlice";

export default configureStore({
    reducer: {
        panelList: panelListSlice.reducer,
        pageTitle: pageTitleSlice.reducer,
        panelConfig: panelConfigSlice.reducer,
        panel: panelSlice.reducer,
        panelData: panelDataSlice.reducer,
        user: userSlice.reducer,
        strategies: strategiesSlice.reducer,
    },
});
