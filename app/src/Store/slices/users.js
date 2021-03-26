import { createSlice, createSelector } from '@reduxjs/toolkit';
import { apiCallBegan } from './../api';
let lastId = 0;

const slice = createSlice({
	name: 'users',
	initialState: [],
	reducers: {
		// actions => action handlers
		usersReceived: (users, action) => {
			const items = action.payload.users
				.filter(user => user.deleted === false)
				.filter(user => user.role !== 'company')
				.map(user => ({
					id: ++lastId,
					userId: user._id,
					name: user.fullName,
					email: user.email,
					role: user.role,
					telephone: user.telephone,
					cpr: user.cpr,
					contractNumber: user.contractNumber
				}));
			items.forEach(user => users.push(user));
		},
		userReceived: (users, action) => {
			users.push({
				id: ++lastId,
				userId: action.payload.userId,
				name: action.payload.fullName,
				email: action.payload.email,
				role: action.payload.role,
				telephone: action.payload.telephone,
				cpr: action.payload.cpr,
				contractNumber: action.payload.contractNumber
			})
		},
		userUpdated: (users, action) => {
			const newState = deepClone(users);
			const editedUser = newState.find(user => user.userId === action.payload.userId);
			editedUser.name = action.payload.fullName;
			editedUser.email = action.payload.email;
			editedUser.telephone = action.payload.telephone;
			editedUser.cpr = action.payload.cpr;
			editedUser.contractNumber = action.payload.contractNumber;
			return newState;
		},
		userAdded: (users, action) => {
			users.push({

				id: ++lastId,
				name: action.payload.name,
				email: action.payload.email,
				password: action.payload.password,
				telephone: action.payload.telephone,
				cpr: action.payload.cpr,
				contractNumber: action.payload.contractNumber
			})
		},
		userRemoved: (users, action) => {
			return users.filter(user => user.userId !== action.payload.userId);
		},
		usersReset: (user, action) => {
			return []
		}
	}
});


export const getUsersArray = createSelector(
	state => state.entities.users,
	users => users
)

export const { userAdded, usersReset, userRemoved, usersReceived, userReceived, userUpdated } = slice.actions;
export default slice.reducer;

// Action Creators
const url = "/v1/user";

export const loadUsers = session => apiCallBegan({
	url: `${url}s`,
	headers: {
		session
	},
	onSuccess: usersReceived.type
})

export const postUser = (session, data) => apiCallBegan({
	url,
	method: "post",
	data,
	headers: {
		session
	},
	onSuccess: userReceived.type
})
export const editUser = (session, urlExtension, data) => apiCallBegan({
	url: `${url}/${urlExtension}`,
	method: "PATCH",
	data,
	headers: {
		session
	},
	onSuccess: userUpdated.type
})
export const deleteUser = (session, urlExtension, data) => apiCallBegan({
	url: `${url}/${urlExtension}`,
	method: "PATCH",
	data,
	headers: {
		session
	},
	onSuccess: userRemoved.type
})





function deepClone(obj) {
	return JSON.parse(JSON.stringify(obj))
}