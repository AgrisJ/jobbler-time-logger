import { createSelector, createSlice } from '@reduxjs/toolkit';

const slice = createSlice({
	name: 'currentContractor',
	initialState: null,
	reducers: {
		// actions => action handlers
		currentContractorChanged: (state, action) => {
			return action.payload
		},
		currentContractorReset: (state, action) => {
			return null
		}
	}
});


export const getcurrentContractor = createSelector(
	state => state.entities.currentContractor,
	currentContractor => currentContractor
)

export const { currentContractorChanged, currentContractorReset } = slice.actions;
export default slice.reducer;