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
      console.log(state.totalOrders);
    },
  },
});

export const { setTotalOrders, discountOne } = orderBadgeSlice.actions;

export default orderBadgeSlice.reducer;
