import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  u_id: "",
  u_firstname: "",
  u_lastname: "",
  u_username: "",
  u_password: "",
  u_type: "",
  u_admin: false,
  isdeleted: false,
};

export const userLoginSlice = createSlice({
  name: "userLogin",
  initialState: initialState,
  reducers: {
    setUser: (state, action) => {
      state.u_id = action.payload.id;
      state.u_firstname = action.payload.u_firstname;
      state.u_lastname = action.payload.u_lastname;
      state.u_username = action.payload.u_username;
      state.u_admin = action.payload.u_admin;
      state.isdeleted = action.payload.isdeleted;
      state.u_type = action.payload.u_type;
    },
    unSetUser: (state, action) => {
      state.u_id = "";
      state.u_firstname = "";
      state.u_lastname = "";
      state.u_username = "";
      state.u_admin = "";
      state.isdeleted = false;
    },
  },
});

export const { setUser, unSetUser } = userLoginSlice.actions;

export default userLoginSlice.reducer;
