// import rootReducer from '@reducer/reducer';
// import { configureStore } from '@reduxjs/toolkit';
import { AnyAction, combineReducers, configureStore } from "@reduxjs/toolkit";
import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import thunk, { ThunkDispatch } from "redux-thunk";

import { usersListReducer } from "./reducers/usersListReducer";

// const preloadedState = (window as any).__PRELOADED_STATE__;

// const store = configureStore({
//   reducer: rootReducer,
//   middleware: getDefaultMiddleware => getDefaultMiddleware({ serializableCheck: false }),
//   preloadedState,
// });

// export default store;

const rootReducer = combineReducers({
  usersListReducer,
});

export const store = configureStore({
  reducer: persistReducer(
    {
      key: "root",
      storage: storage,
      whitelist: ["usersListReducer"],
    },
    rootReducer,
  ),
  devTools: true,
  middleware: [thunk],
});

export type RootState = ReturnType<typeof store["getState"]>;

export type AppDispatch = typeof store["dispatch"] &
  ThunkDispatch<RootState, void, AnyAction>;
