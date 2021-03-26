import { createSelector, createSlice } from '@reduxjs/toolkit';
import { useSelector } from 'react-redux';
import { resultDate } from '../../components/services/helpfulFunctions';
import { apiCallBegan } from './../api';
let lastId = 0;

const slice = createSlice({
	name: 'timecards',
	initialState: [{ id: 0, cardId: '', userId: '', projectId: '', startTime: '', hours: '' }],
	reducers: {
		// actions => action handlers
		timecardsReceived: (timecards, action) => { //TODO seperate action for receiveing timecards after adding one
			const endSourceName = Object.keys(action.payload)[0];
			const emptySource = action.payload[endSourceName].length === 0;
			const isValidSource = Array.isArray(action.payload[endSourceName]);
			let items = [];
			if (!emptySource) {
				if (isValidSource)
					items = action.payload[endSourceName].map(timecard => {
						return ({
							id: ++lastId,
							cardId: timecard._id,
							userId: timecard.userId,
							projectId: timecard.projectId,
							startTime: timecard.startTime,
							endTime: timecard.endTime,
							breakTime: timecard.breakTime,
							notes: timecard.notes,
							hours: timecard.hours
						})
					});
				else
					items.push(
						{
							id: ++lastId,
							cardId: action.payload.timecardId,
							userId: action.payload.userId,
							projectId: action.payload.projectId,
							startTime: action.payload.startTime ? resultDate(action.payload.startTime) : '2000-01-01T00:00:00.000Z',
							endTime: action.payload.endTime ? resultDate(action.payload.endTime) : '2000-01-01T00:00:00.000Z',
							breakTime: action.payload.breakTime,
							notes: action.payload.notes,
							hours: action.payload.hours
						}

					);
			}

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
				startTime: "2000-01-01",
				hours: null,
				error: `Error - ${action.payload.message}`
			})
		},
		timecardAdded: (timecards, action) => {
			timecards.push({
				id: ++lastId,
				cardId: action.payload.cardId,
				userId: action.payload.userId,
				projectId: action.payload.projectId,
				startTime: action.payload.startTime,
				breakTime: action.payload.breakTime,
				notes: action.payload.notes,
				hours: action.payload.hours
			})
		},
		timecardRenamed: (timecards, action) => {
			const selectedCard = timecards.find(card => card.cardId === action.payload.cardId)
			const newStartDate = action.payload.startTime;
			const newEndDate = action.payload.endTime;
			selectedCard.startTime = newStartDate;
			selectedCard.endTime = newEndDate;
		},
		timecardWorkingTimeEdited: (timecards, action) => {
			const selectedCard = timecards.find(card => card.cardId === action.payload.cardId)
			const newStartTime = action.payload.startTime;
			const newEndTime = action.payload.endTime;
			const newHours = action.payload.hours;
			const newBreakTime = action.payload.breakTime;
			selectedCard.startTime = newStartTime;
			selectedCard.endTime = newEndTime;
			selectedCard.hours = newHours;
			selectedCard.breakTime = newBreakTime;
		},
		timecardProjectChanged: (timecards, action) => {
			const selectedCard = timecards.find(card => card.cardId === action.payload.cardId)
			const newId = action.payload.newProjectId;
			selectedCard.projectId = newId;
		},
		timecardRemoved: (timecards, action) => {
			return timecards.filter(card => card.cardId !== action.payload.cardId);
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

export const { timecardAdded, timecardRemoved, timecardsOfUserRemoved, timecardsOfProjectRemoved, timecardProjectChanged, timecardRenamed, timecardWorkingTimeEdited, timecardsReceived, timecardsReset, error } = slice.actions;
export default slice.reducer;

// Action Creators
const url = "/v1/timecard";
const url2 = "/v1/user/hours";

export const loadTimecards = (session, urlExtension, data) => apiCallBegan({
	url: `${url}s/${urlExtension}`,
	data,
	headers: {
		session
	},
	onSuccess: timecardsReceived.type
});

export const loadUserTimecards = session => apiCallBegan({
	url: url2,
	headers: {
		session
	},
	onSuccess: timecardsReceived.type
});

export const postUserTimecard = (session, urlExtension, data) => apiCallBegan({
	url: `${url}/${urlExtension}`,
	method: "post",
	data,
	headers: {
		session
	},
	onError: error.type,
	onSuccess: timecardsReceived.type
});
export const editTimecard = (session, urlExtension, data) => apiCallBegan({
	url: `${url}/${urlExtension}`,
	method: "PATCH",
	data,
	headers: {
		session
	},
	onError: error.type
});

export const deleteTimecard = (session, urlExtension) => apiCallBegan({
	url: `${url}/${urlExtension}`,
	method: "DELETE",
	headers: {
		session
	},
	onSuccess: "timecards/timecardRemoved"
});





