// import { configureStore } from '@reduxjs/toolkit';
// import authReducer from "../features/auth_slice.jsx";

// export const store = configureStore({
//   reducer: {
//     auth:authReducer
//   },
// });
import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth_slice";
import storageSession from "redux-persist/lib/storage/session"; // Uses session storage (clears on tab close)
import { persistStore, persistReducer } from "redux-persist";

const persistConfig = {
    key: "auth",
    storage: storageSession, // Use `storage` instead for long-term persistence
};

const persistedAuthReducer = persistReducer(persistConfig, authReducer);

export const store = configureStore({
    reducer: {
        auth: persistedAuthReducer, // Use persisted reducer
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false, // Required for redux-persist
        }),
});

export const persistor = persistStore(store);

