import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  searchQuery: '',
  isSidebarOpen: true,
};

export const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
    },
    toggleSidebar: (state) => {
      state.isSidebarOpen = !state.isSidebarOpen;
    },
  },
});

export const { setSearchQuery, toggleSidebar } = uiSlice.actions;
export default uiSlice.reducer;
