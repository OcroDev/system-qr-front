import { configureStore } from "@reduxjs/toolkit";

//REDUCERS
// import todosReducer from "./reducers/todo/todoSlice";
// import userReducer from "./reducers/user/userSlice";
// import filterReducer from "./reducers/filter/filterSlice";
import navbarReducer from "./reducers/navbar/navbarSlice";
import userLoginReducer from "./reducers/userLogin/userLoginSlice";

export default configureStore({
  reducer: {
    // user: userReducer,
    navbar: navbarReducer,
    userLogin: userLoginReducer,
  },
});
