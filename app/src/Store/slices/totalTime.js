import { createSlice, createSelector } from '@reduxjs/toolkit';

const slice = createSlice({
	name: 'totalTime',
	initialState: 0,
	reducers: {
		// actions => action handlers
		totalTimeChanged: (state, action) => {
			return action.payload
		},
		totalTimeReset: (state, action) => {
			return 0
		}
	}
});

export const gettotalTime = createSelector(
	state => state.entities.totalTime,
	totalTime => totalTime
)

export const { totalTimeChanged, totalTimeReset } = slice.actions;
export default slice.reducer;