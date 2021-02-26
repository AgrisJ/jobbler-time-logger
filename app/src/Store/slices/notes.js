import { createSelector, createSlice } from '@reduxjs/toolkit';
let lastId = 0;

const slice = createSlice({
	name: 'notes',
	initialState: [],
	reducers: {
		// actions => action handlers
		notesReceived: (notes, action) => {
			const items = action.payload.notes
				.filter(note => note.active === true)
				.map(note => ({
					id: ++lastId,
					noteId: note._id,
					timecardId: note.timecardId,
					content: note.content
				}));
			items.forEach(note => notes.push(note));
		},
		noteReceived: (note, action) => {
			note.push({
				id: ++lastId,
				noteId: note._id,
				timecardId: note.timecardId,
				content: action.payload.content
			})
		},
		noteAdded: (notes, action) => {
			notes.push({
				id: ++lastId,
				timecardId: action.payload.timecardId,
				content: action.payload.content
			})
		},
		noteRemoved: (notes, action) => {
			return notes.filter(note => note.noteId !== action.payload.noteId);
		},
		notesReset: (notes, action) => {
			return []
		}
	}
});


export const getnotesArray = createSelector(
	state => state.entities.notes,
	notes => notes
)

export const { noteAdded, noteRemoved, notesReset, noteReceived, notesReceived } = slice.actions;
export default slice.reducer;