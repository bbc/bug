import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    data: [],
    status: "idle",
    error: null,
};

export default createSlice({
    name: "panelConfig",
    initialState,
    reducers: {
        idle: (state) => {
            state.status = "idle";
            state.data = {};
            state.error = null;
        },
        loading: (state) => {
            state.status = "loading";
            state.error = null;
        },
        success: (state, action) => {
            state.status = "success";
            state.data = action.payload.data;
            state.error = null;
        },
        failure: (state, action) => {
            state.status = "failure";
            state.data = {};
            state.error = action.payload.error;
        },
    },
});
