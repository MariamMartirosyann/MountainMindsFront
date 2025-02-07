import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./userSlice";
import feedReducer from "./feedSlice";
import connectionReducer from "./connectionslice";
import requestsReducer from "./requestsSlice";


const appStore = configureStore({
  reducer: {
    user: userReducer,
    feed: feedReducer,
    connection:connectionReducer,
    request:requestsReducer
  },
});
export default appStore;
