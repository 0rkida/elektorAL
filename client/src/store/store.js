import { configureStore } from '@reduxjs/toolkit';
import uiSlice from './ui-slice';
import voteSlice from './vote-slice';
import filtersReducer from "./filterSlice";


const store = configureStore({
    reducer: {ui: uiSlice.reducer, vote: voteSlice.reducer, filters: filtersReducer}
});

export default store;