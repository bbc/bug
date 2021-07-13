import { createSlice } from "@reduxjs/toolkit";

const initialState = {
};

export default createSlice({
    name: "panelData",
    initialState,
    reducers: {
        update: (state, action) => {
            return action.payload;
        },
        clear: (state) => {
            return {};
        },
    },
});
