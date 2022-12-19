import { configureStore } from "@reduxjs/toolkit";

//REDUCERS
// import todosReducer from "./reducers/todo/todoSlice";
// import userReducer from "./reducers/user/userSlice";
// import filterReducer from "./reducers/filter/filterSlice";
import navbarReducer from "./reducers/navbar/navbarSlice";

export default configureStore({
  reducer: {
    // user: userReducer,
    navbar: navbarReducer,
  },
});
