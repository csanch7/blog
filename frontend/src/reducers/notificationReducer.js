import { createSlice } from "@reduxjs/toolkit";

const notificationSlice = createSlice({
  name: "notification",
  initialState: "",
  reducers: {
    addNotification(state, action) {
      console.log(action.payload);

      return action.payload;
    },
    removeNotification(state, action) {
      return "";
    },
  },
});

export const { addNotification, removeNotification } =
  notificationSlice.actions;

export const notificationMaker = (content, time) => {
  return async (dispatch) => {
    dispatch(addNotification(content));
    setTimeout(() => {
      dispatch(removeNotification());
    }, time * 1000);
  };
};
export default notificationSlice.reducer;
