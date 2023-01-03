import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  totalcount: 0,
  products: [],
};

export const productOperationSlice = createSlice({
  name: "OpProduct",
  initialState: initialState,
  reducers: {
    addProduct: (state, action) => {
      state.products = [...state.products, action.payload];
      state.totalcount += 1;
    },
    deleteProducts: (state, action) => {
      state.products = [];
      state.totalcount = 0;
    },
    deleteOneProduct: (state, action) => {
      state.products.splice(action.payload, 1);
      state.totalcount -= 1;
    },
  },
});

export const { addProduct, deleteProducts, deleteOneProduct } =
  productOperationSlice.actions;

export default productOperationSlice.reducer;
