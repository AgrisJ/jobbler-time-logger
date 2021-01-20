import { createSlice, createSelector } from '@reduxjs/toolkit';

const slice = createSlice({
	name: 'cardCount',
	initialState: 0,
	reducers: {
		// actions => action handlers
		cardCountChanged: (state, action) => {
			return action.payload
		},
		cardCountReset: (state, action) => {
			return 0
		}
	}
});

export const getcardCount = createSelector(
	state => state.entities.cardCount,
	cardCount => cardCount
)

export const { cardCountChanged, cardCountReset } = slice.actions;
export default slice.reducer;