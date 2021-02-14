import { createSlice, createSelector } from '@reduxjs/toolkit';

const slice = createSlice({
	name: 'login',
	initialState: {
		isAuthenticated: false,
		session: null,
		token: null,
		ttl: null,
		userId: null,
		role: null,
		error: ''
	},
	reducers: {
		// actions => action handlers

		loggedIn: (state, action) => {
			return {
				isAuthenticated: true,
				session: action.payload.session,
				token: action.payload.token,
				ttl: action.payload.ttl,
				userId: action.payload.userId,
				role: action.payload.role,
				error: ''
			}
		},
		loggedOut: (state, action) => {
			return {
				isAuthenticated: false,
				session: null,
				token: null,
				ttl: null,
				userId: null,
				role: null,
				error: ''
			}
		},
		errorHandled: (state, action) => {
			state.error = action.payload.error;
			return state;
		}
	}
});

export const getLoginData = createSelector(
	state => state.entities.login,
	login => login
)

export const { loggedIn, loggedOut, errorHandled } = slice.actions;
export default slice.reducer;