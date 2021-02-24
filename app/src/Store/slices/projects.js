import { createSelector, createSlice } from '@reduxjs/toolkit';
let lastId = 0;

const slice = createSlice({
	name: 'projects',
	initialState: [],
	reducers: {
		// actions => action handlers
		projectsReceived: (projects, action) => {
			const items = action.payload.projects
				.filter(project => project.active === true)
				.map(project => ({
					id: ++lastId,
					projectId: project._id,
					name: project.name,
					address: project.address
				}));
			items.forEach(project => projects.push(project));
		},
		projectReceived: (project, action) => {
			project.push({
				id: ++lastId,
				projectId: project._id,
				name: action.payload.name,
				address: action.payload.address
			})
		},
		projectAdded: (projects, action) => {
			projects.push({
				id: ++lastId,
				name: action.payload.name,
				address: action.payload.address
			})
		},
		projectRemoved: (projects, action) => {
			return projects.filter(project => project.projectId !== action.payload.projectId);
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

export const { projectAdded, projectRemoved, projectsReset, projectReceived, projectsReceived } = slice.actions;
export default slice.reducer;