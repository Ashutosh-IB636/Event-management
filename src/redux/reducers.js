import { combineReducers } from "@reduxjs/toolkit";
import userReducer from './slice/usersSlice';
import eventReducer from './slice/eventSlice';

const rootReducer = combineReducers({
    user: userReducer,
    event: eventReducer,
})

export default rootReducer;