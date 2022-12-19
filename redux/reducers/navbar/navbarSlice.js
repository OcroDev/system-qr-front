import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  openProduct: false,
  openDepartment: false,
  openReport: false,
  openOperation: false,
  openWarehouse: false,
  openUser: false,
  openUserAvatar: false,
};

export const navbarSlice = createSlice({
  name: "navbar",
  initialState: initialState,
  reducers: {
    dropdownSetter: (state, action) => {
      switch (action.payload) {
        case "products":
          state.openProduct = !state.openProduct;
          break;
        case "department":
          state.openDepartment = !state.openDepartment;
          break;
        case "operation":
          state.openOperation = !state.openOperation;
          break;
        case "warehouse":
          state.openWarehouse = !state.openWarehouse;
          break;
        case "report":
          state.openReport = !state.openReport;
          break;
        case "user":
          state.openUser = !state.openUser;
          break;
        case "avatar":
          state.openUserAvatar = !state.openUserAvatar;
          break;
        default:
          break;
      }
    },
  },
});

export const { dropdownSetter } = navbarSlice.actions;

export default navbarSlice.reducer;
