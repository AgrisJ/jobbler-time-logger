import { createSelector, createSlice } from '@reduxjs/toolkit';
import { useSelector } from 'react-redux';
let lastId = 0;

const slice = createSlice({
	name: 'timecards',
	initialState: [{ id: 0, cardId: '', userId: '', projectId: '', jobDate: '', hours: '' }],
	reducers: {
		// actions => action handlers
		timecardsReceived: (timecards, action) => {
			const endSource = Object.keys(action.payload)[0];
			const items = action.payload[endSource].map(timecard => ({
				id: ++lastId,
				cardId: timecard._id,
				userId: timecard.userId,
				projectId: timecard.projectId,
				jobDate: timecard.date.split("T")[0],
				hours: timecard.hours
			}));
			items.forEach(timecard => {
				function isDuplicate(c) {
					return c.cardId === timecard.cardId;
				}
				function notADuplicate() {
					const foundDuplicate = timecards.findIndex(isDuplicate);
					if (foundDuplicate !== -1) return false;
					else return true;
				}
				if (notADuplicate())
					timecards.push(timecard)
			});
		},
		error: (timecards, action) => {
			timecards.push({
				id: ++lastId,
				cardId: null,
				userId: null,
				projectId: null,
				jobDate: "2000-01-01",
				hours: null,
				error: `error - ${action.payload.message}`
			})
		},
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
		timecardsOfUserRemoved: (timecards, action) => {
			return timecards.filter(card => card.userId !== action.payload.id);
		},
		timecardsOfProjectRemoved: (timecards, action) => {
			return timecards.filter(card => card.projectId !== action.payload.id);
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

export const { timecardAdded, timecardRemoved, timecardsOfUserRemoved, timecardsOfProjectRemoved, timecardsReceived, timecardsReset, error } = slice.actions;
export default slice.reducer;





