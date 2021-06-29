import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    data: null,
    status: "idle",
    error: null,
};

export default createSlice({
    name: "user",
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
            state.data = null;
            state.error = action.payload.error;
        },
    },
});
