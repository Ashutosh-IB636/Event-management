import { configureStore } from "@reduxjs/toolkit";
import rootReducer from './reducers';
import storage from 'redux-persist/lib/storage';
import persistReducer from "redux-persist/es/persistReducer";

const persistConfig = {
    key: 'root',
    version: 1,
    storage,
}

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
    reducer: persistedReducer,
})

export default store;