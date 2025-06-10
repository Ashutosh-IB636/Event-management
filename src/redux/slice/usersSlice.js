import { createSlice } from "@reduxjs/toolkit";
import allUsers from '../../data/MOCK_DATA'

const initialState = {
    allUsers,
    isAdmin: null,
    current: null,
}

const usersSlice = createSlice({
    name: "userdata",
    initialState,
    reducers: {
        setUser: (state, action) => {
            state.current = action.payload.user;
            state.isAdmin = action.payload.isAdmin;
        }
    }
})

export const { setUser } = usersSlice.actions;
export default usersSlice.reducer;