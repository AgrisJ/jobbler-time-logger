import { createSlice, createSelector } from '@reduxjs/toolkit';

const slice = createSlice({
	name: 'currentModeIndex',
	initialState: 0,
	reducers: {
		// actions => action handlers
		currentModeIndexChanged: (state, action) => {
			return action.payload
		},
		currentModeIndexReset: (state, action) => {
			return 0
		}
	}
});

export const getcurrentModeIndex = createSelector(
	state => state.entities.currentModeIndex,
	currentModeIndex => currentModeIndex
)

export const { currentModeIndexChanged, currentModeIndexReset } = slice.actions;
export default slice.reducer;