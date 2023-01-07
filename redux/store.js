import { configureStore } from "@reduxjs/toolkit";

//REDUCERS
import navbarReducer from "./reducers/navbar/navbarSlice";
import productOperationReducer from "./reducers/products/productOperationSlice";
import userLoginReducer from "./reducers/userLogin/userLoginSlice";
import operationTypeReducer from "./reducers/operations_type/operationTypeSlice";
import departmentOperationReducer from "./reducers/department/departmentOperationSlice";

export default configureStore({
  reducer: {
    navbar: navbarReducer,
    userLogin: userLoginReducer,
    opProduct: productOperationReducer,
    opType: operationTypeReducer,
    opDepartment: departmentOperationReducer,
  },
});
