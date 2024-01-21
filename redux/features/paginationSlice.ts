import { createSlice } from "@reduxjs/toolkit";

const LIMIT = 10;

type paginationState = {
  page: number;
  skip: number;
  start: number;
  end: number;
  totalProducts: number;
};

const initialState = {
  page: 0,
  skip: 0,
  start: 1,
  end: 10,
  totalProducts: 0,
} as paginationState;

export const pagination = createSlice({
  name: "pagination",
  initialState,
  reducers: {
    next: (state) => {
      if (state.skip + 10 < state.totalProducts) {
        state.page += 1;
        state.skip = LIMIT * state.page;
        state.start = state.page * LIMIT + 1;
        state.end = (state.page + 1) * LIMIT;
        if (state.end > state.totalProducts) {
          state.end = state.totalProducts;
        }
      }
    },
    previous: (state) => {
      if (state.page > 0) {
        state.page -= 1;
        state.skip = LIMIT * state.page;
        state.start = state.page * LIMIT + 1;
        state.end = (state.page + 1) * LIMIT;
        if (state.end > state.totalProducts) {
          state.end = state.totalProducts;
        }
      }
    },
    updateTotalProducts: (state, action) => {
      if (state.totalProducts === state.end) {
        state.end = action.payload;
      }
      state.totalProducts = action.payload;
      if (state.end > state.totalProducts) {
        state.end = state.totalProducts;
      }
    },
  },
});

export const { next, previous, updateTotalProducts } = pagination.actions;
export default pagination.reducer;
