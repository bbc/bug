import { configureStore } from '@reduxjs/toolkit'
import panelListSlice from './panelListSlice'
import pageTitleSlice from './pageTitleSlice'

export default configureStore({
    reducer: {
        panelList: panelListSlice.reducer,
        pageTitle: pageTitleSlice.reducer
    },
})