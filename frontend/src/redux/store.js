import { configureStore } from '@reduxjs/toolkit';
import storage from 'redux-persist/lib/storage';
import { persistReducer, persistStore } from 'redux-persist';
import { rootReducer } from './index'; 
import autoMergeLevel1 from 'redux-persist/es/stateReconciler/autoMergeLevel1';

const persistConfig = {
    key: 'root',
    storage,
    stateReconciler: autoMergeLevel1,
    whitelist: ['user','Products' , 'UserCart'], 
    blacklist: [], 
};


const persistedReducer = persistReducer(persistConfig, rootReducer);


const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false, 
        }),
});

export const persistor = persistStore(store);

export default store;
