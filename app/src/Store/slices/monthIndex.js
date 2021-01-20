import { createSlice, createSelector } from '@reduxjs/toolkit';

const slice = createSlice({
	name: 'monthIndex',
	initialState: 0,
	reducers: {
		// actions => action handlers
		monthIndexChanged: (state, action) => {
			return action.payload
		},
		monthIndexReset: (state, action) => {
			return 0
		}
	}
});

export const getMonthIndex = createSelector(
	state => state.entities.monthIndex,
	monthIndex => monthIndex.monthIndex
)

export const { monthIndexChanged, monthIndexReset } = slice.actions;
export default slice.reducer;