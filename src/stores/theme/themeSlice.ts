import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type Theme = "dark" | "light" | "system";

export interface ThemeState {
  theme: Theme;
}

const initialState: ThemeState = {
  theme: (localStorage.getItem("vite-ui-theme") as Theme) || "system", // Lấy từ localStorage
};

export const namespace = "theme";

const themeSlice = createSlice({
  name: namespace,
  initialState,
  reducers: {
    setTheme(state, action: PayloadAction<Theme>) {
      state.theme = action.payload;
      localStorage.setItem("vite-ui-theme", action.payload); // Lưu vào localStorage
    },
  },
});

export const { setTheme } = themeSlice.actions;
export default themeSlice.reducer;