import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const APPKEY = "Py9YJXgBecbbqxjRVaHarcSnJyuzhxGqJTkY6xKZRfrdXFy72HPXvFRvfEjy";

const fetchUserActivity = createAsyncThunk(
  "activity/fetchUserActivity",
  async ({ ladder_id }, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        "https://ne-games.com/leaderBoard/api/user/activity",
        {
          params: { ladder_id },
          headers: { APPKEY:APPKEY },
        }
      );

      const data = response.data;
      if (data.status === 200) {
        return data; // return full response or data.activities if needed
      } else {
        return rejectWithValue(data.message || "Failed to fetch activity");
      }
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const activitySlice = createSlice({
  name: "activity",
  initialState: {
    loading: false,
    data: null,
    error: null,
  },
  reducers: {
    clearActivityState(state) {
      state.loading = false;
      state.data = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserActivity.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserActivity.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchUserActivity.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Something went wrong";
      });
  },
});

export const { clearActivityState } = activitySlice.actions;
export { fetchUserActivity }
export default activitySlice.reducer;
