import { createSlice } from '@reduxjs/toolkit'

const initialState = { contents: [] };

const instancesSlice = createSlice({
    name: 'instances',
    initialState,
    reducers: {
        update(state, action) {
            state.contents = action.payload;
        },
    },
})

export const { update } = instancesSlice.actions
export default instancesSlice.reducer
