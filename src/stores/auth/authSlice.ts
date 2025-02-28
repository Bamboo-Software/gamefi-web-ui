import { createSlice } from "@reduxjs/toolkit";

interface Auth {
    token: string
}

const initialState: Auth= {
        token: ""
}

export const namespace = 'auth';

const authSlice = createSlice({
    name: namespace,
    initialState,
    reducers: {}
});

export default authSlice.reducer;
export type { Auth };

