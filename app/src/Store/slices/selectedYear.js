import { createSlice, createSelector } from '@reduxjs/toolkit';
const yearNow = new Date().getFullYear();
export function getYearObj(year) {
	return year && new Date(year.toString());
}
export function getYearNum(year) {
	return year && new Date(year).getFullYear();
}

const slice = createSlice({
	name: 'selectedYear',
	initialState: yearNow,
	reducers: {
		// actions => action handlers
		selectedYearChanged: (state, action) => {
			return getYearNum(action.payload)
		},
		selectedYearReset: (state, action) => {
			return yearNow
		}
	}
});

export const getSelectedYear = createSelector(
	state => state.entities.selectedYear,
	selectedYear => getYearObj(selectedYear)
)

export const { selectedYearChanged, selectedYearReset } = slice.actions;
export default slice.reducer;