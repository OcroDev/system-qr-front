import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  operation_type: "",
};

export const operationTypeSlice = createSlice({
  name: "opType",
  initialState: initialState,
  reducers: {
    setOperationType: (state, action) => {
      state.operation_type = action.payload;
    },
  },
});

export const { setOperationType } = operationTypeSlice.actions;

export default operationTypeSlice.reducer;
