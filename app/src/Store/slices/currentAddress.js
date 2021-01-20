import { createSelector, createSlice } from '@reduxjs/toolkit';

const slice = createSlice({
	name: 'currentAddress',
	initialState: { address: null, projectId: null },
	reducers: {
		// actions => action handlers
		currentAddressChanged: (state, action) => {
			return action.payload
		},
		currentAddressReset: (state, action) => {
			return 0
		}
	}
});


export const getcurrentAddress = createSelector(
	state => state.entities.currentAddress,
	currentAddress => currentAddress
)

export const { currentAddressChanged, currentAddressReset } = slice.actions;
export default slice.reducer;