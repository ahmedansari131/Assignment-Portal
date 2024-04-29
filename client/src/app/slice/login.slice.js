import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    status: false,
    role: "student"
}

const loginSlice = createSlice({
    name: "login",
    initialState,
    reducers: {
        setLoggedIn: (state, actions) => {
            state.status = actions.payload
        },
        setRole: (state, actions) => {
            state.role = actions.payload
        }
    }
});

export default loginSlice.reducer;
export const { setLoggedIn, setRole } = loginSlice.actions;