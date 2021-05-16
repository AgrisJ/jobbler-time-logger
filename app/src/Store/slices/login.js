import { createSlice, createSelector } from '@reduxjs/toolkit';
import { apiCallBegan } from './../api';

const slice = createSlice({
	name: 'login',
	initialState: {
		isAuthenticated: false,
		session: null,
		companyId: null,
		token: null,
		ttl: null,
		userId: null,
		role: null,
		name: null,
		error: ''
	},
	reducers: {
		// actions => action handlers

		loggedIn: (state, action) => {
			return {
				isAuthenticated: true,
				session: action.payload.session,
				companyId: action.payload.companyId,
				token: action.payload.token,
				ttl: action.payload.ttl,
				userId: action.payload.userId,
				role: action.payload.role,
				name: action.payload.fullName,
				error: ''
			}
		},
		loggedOut: (state, action) => {
			return {
				isAuthenticated: false,
				session: null,
				companyId: null,
				token: null,
				ttl: null,
				userId: null,
				role: null,
				name: null,
				error: ''
			}
		},
		errorHandled: (state, action) => {
			state.error = action.payload;
		}
	}
});

export const getLoginData = createSelector(
	state => state.entities.login,
	login => login
)

export const { loggedIn, loggedOut, errorHandled } = slice.actions;
export default slice.reducer;


// Action Creators
const url = "/v1/login";
const url2 = "/v1/logout";


export const postLogin = data => apiCallBegan({
	url,
	method: "post",
	data,
	onSuccess: loggedIn.type,
	onError: errorHandled.type
});

export const postLogout = session => apiCallBegan({
	url: url2,
	method: "post",
	headers: {
		session
	}
});
