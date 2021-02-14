import { createSelector, createSlice } from '@reduxjs/toolkit';

const slice = createSlice({
	name: 'currentAddress',
	initialState: { address: null, projectId: null, loading: true },
	reducers: {
		// actions => action handlers
		currentAddressRequested: (state, action) => {
			state.loading = true;
		},
		currentAddressChanged: (state, action) => {
			// state.address = action.payload.address;
			// state.projectId = action.payload.projectId;
			// state.loading = false;
			return action.payload
		},
		currentAddressReset: (state, action) => {
			return { address: null, projectId: null, loading: false }
		}
	}
});


export const getcurrentAddress = createSelector(
	state => state.entities.currentAddress,
	currentAddress => currentAddress
)

export const { currentAddressChanged, currentAddressReset, currentAddressRequested } = slice.actions;
export default slice.reducer;