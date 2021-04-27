import { configureStore } from '@reduxjs/toolkit'
import panelListSlice from './panelListSlice'
import pageTitleSlice from './pageTitleSlice'
import panelSlice from './panelSlice'

export default configureStore({
    reducer: {
        panelList: panelListSlice.reducer,
        pageTitle: pageTitleSlice.reducer,
        panel: panelSlice.reducer,
    },
})