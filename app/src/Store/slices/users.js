import { createSlice, createSelector } from '@reduxjs/toolkit';
let lastId = 0;

const slice = createSlice({
	name: 'users',
	initialState: [],
	reducers: {
		// actions => action handlers
		userAdded: (users, action) => {
			users.push({
				id: ++lastId,
				name: action.payload.name
			})
		},
		userRemoved: (users, action) => {
			return users.filter(user => user.id !== action.payload.id);
		},
		usersReset: (user, action) => {
			return []
		}
	}
});
// console.log('slice users', slice)

export const getUsersArray = createSelector(
	state => state.entities.users,
	users => users
)

export const { userAdded, usersUpdated, usersReset } = slice.actions;
export default slice.reducer;