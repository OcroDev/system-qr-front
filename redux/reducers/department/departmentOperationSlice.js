import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  department_id: null,
  department_name: "",
};
export const departmentOperationSlice = createSlice({
  name: "opDepartment",
  initialState: initialState,
  reducers: {
    addDepartment: (state, action) => {
      state.department_id = action.payload.id;
      state.department_name = action.payload.name;
    },
    deleteDepartment: (state, action) => {
      state.department_id = null;
      state.department_name = "";
    },
  },
});

export const { addDepartment, deleteDepartment } =
  departmentOperationSlice.actions;

export default departmentOperationSlice.reducer;
