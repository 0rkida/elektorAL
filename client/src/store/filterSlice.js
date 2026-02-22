import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  county: "",        // countyId
  municipality: ""   // municipalityId
};

const filterSlice = createSlice({
  name: "filters",
  initialState,
  reducers: {
    setCounty(state, action) {
      state.county = action.payload;
      state.municipality = ""; // kur ndryshon qarku, reset bashkia
    },
    setMunicipality(state, action) {
      state.municipality = action.payload;
    },
    clearFilters(state) {
      state.county = "";
      state.municipality = "";
    }
  }
});

export const { setCounty, setMunicipality, clearFilters } = filterSlice.actions;
export default filterSlice.reducer;