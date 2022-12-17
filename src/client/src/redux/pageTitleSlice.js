import { createSlice } from '@reduxjs/toolkit'

export default createSlice({
    name: 'pageTitle',
    initialState: 'BUG',
    reducers: {
        set: (state, action) => {
            return action.payload;
        }
    }
})
