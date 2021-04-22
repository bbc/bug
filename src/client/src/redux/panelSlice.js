import { createSlice } from '@reduxjs/toolkit'

export default createSlice({
    name: 'panel',
    initialState: null,
    reducers: {
        set: (state, action) => {
            return action.payload;
        }
    }
})
