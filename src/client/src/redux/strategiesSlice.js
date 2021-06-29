import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    data: [],
    status: "idle",
    error: null,
};

export default createSlice({
    name: "strategies",
    initialState,
    reducers: {
        idle: (state) => {
            state.status = "idle";
            state.data = [];
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
        failed: (state, action) => {
            state.status = "failed";
            state.data = [];
            state.error = action.payload.error;
        },
    },
});
