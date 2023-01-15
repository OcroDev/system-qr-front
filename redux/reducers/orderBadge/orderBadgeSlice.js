import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  totalOrders: 0,
};

export const orderBadgeSlice = createSlice({
  name: "orderBadge",
  initialState,
  reducers: {
    setTotalOrders: (state, action) => {
      state.totalOrders = action.payload;
    },
    discountOne: (state, action) => {
      state.totalOrders = state.totalOrders - 1;
    },
    addOne: (state, action) => {
      state.totalOrders = state.totalOrders + 1;
    },
  },
});

export const { setTotalOrders, discountOne, addOne } = orderBadgeSlice.actions;

export default orderBadgeSlice.reducer;
