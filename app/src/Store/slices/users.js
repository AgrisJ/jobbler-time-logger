import { createSlice, createSelector } from '@reduxjs/toolkit';
let lastId = 0;

const slice = createSlice({
	name: 'users',
	initialState: [],
	reducers: {
		// actions => action handlers
		usersReceived: (users, action) => {
			const items = action.payload.users.map(user => ({
				id: ++lastId,
				userId: user._id,
				name: user.fullName,
				role: user.role
			}));
			items.forEach(user => users.push(user));
		},
		userReceived: (users, action) => {
			users.push({
				id: ++lastId,
				userId: action.payload.userId,
				name: action.payload.name,
				role: action.payload.role
			})
		},
		userAdded: (users, action) => {
			users.push({
				id: ++lastId,
				name: action.payload.name,
				email: action.payload.email,
				password: action.payload.password
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

export const { userAdded, usersReset, userRemoved, usersReceived, userReceived } = slice.actions;
export default slice.reducer;