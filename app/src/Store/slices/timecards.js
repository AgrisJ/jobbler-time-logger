import { createSelector, createSlice } from '@reduxjs/toolkit';
import { useSelector } from 'react-redux';
let lastId = 0;

const slice = createSlice({
	name: 'timecards',
	initialState: [{ id: 0, userId: '', projectId: '', jobDate: '', hours: '' }],
	reducers: {
		// actions => action handlers
		timecardAdded: (timecards, action) => {
			timecards.push({
				id: ++lastId,
				userId: action.payload.userId,
				projectId: action.payload.projectId,
				jobDate: action.payload.jobDate,
				hours: action.payload.hours
			})
		},
		timecardRemoved: (timecards, action) => {
			return timecards.filter(card => card.id !== action.payload.id);
		},
		timecardsReset: (timecard, action) => {
			return []
		}
	}
});


export const getTimecardArray = createSelector(
	state => state.entities.timecards,
	timecards => timecards
)

const getTimecards = state => state.entities.timecards;
const getId = (_, id) => id;

const getTimecardsPerUserId = createSelector(
	getTimecards,
	getId,
	(timecards, id) => timecards.filter(card => card.userId === id)
);

export function TimeCards(id) {
	const cards = useSelector(state => getTimecardsPerUserId(state, id));
	return cards;
}



// export const getOrdersToday = createSelector(
// 	state => state.entities.kolli,
// 	kolli => kolli.length
// )
// export const getLastOrder = createSelector(
// 	state => state.entities.kolli,
// 	kolli => kolli[kolli.length - 1]
// )

export const { timecardAdded, timecardRemoved, timecardsReset } = slice.actions;
export default slice.reducer;





