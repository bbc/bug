import { configureStore } from '@reduxjs/toolkit'
import panelListSlice from './panelListSlice'
import moduleListSlice from './moduleListSlice'
import pageTitleSlice from './pageTitleSlice'
import panelSlice from './panelSlice'

export default configureStore({
    reducer: {
        panelList: panelListSlice.reducer,
        moduleList: moduleListSlice.reducer,
        pageTitle: pageTitleSlice.reducer,
        panel: panelSlice.reducer,
    },
})