import { createSelector, createSlice } from '@reduxjs/toolkit';

const slice = createSlice({
	name: 'language',
	initialState: 'en',
	reducers: {
		// actions => action handlers
		languageChanged: (state, action) => {
			return action.payload
		}
	}
});


export const getlanguage = createSelector(
	state => state.entities.language,
	language => language
)

export const { languageChanged } = slice.actions;
export default slice.reducer;