import { createSelector, createSlice } from '@reduxjs/toolkit';
let lastId = 0;

const slice = createSlice({
	name: 'projects',
	initialState: [],
	reducers: {
		// actions => action handlers
		projectAdded: (projects, action) => {
			projects.push({
				id: ++lastId,
				name: action.payload.name,
				address: action.payload.address
			})
		},
		projectRemoved: (projects, action) => {
			return projects.filter(project => project.id !== action.payload.id);
		},
		projectsReset: (projects, action) => {
			return []
		}
	}
});


export const getProjectArray = createSelector(
	state => state.entities.projects,
	projects => projects/* .reduce((acc, cur) => { acc.push(cur.project); return acc }, []) || null */
)

export const { projectAdded, projectRemoved, projectsReset } = slice.actions;
export default slice.reducer;