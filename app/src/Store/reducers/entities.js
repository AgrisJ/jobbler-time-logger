import { combineReducers } from 'redux';
import timecardReducer from '../slices/timecards';
import projectReducer from '../slices/projects';
import usersReducer from '../slices/users';


export default combineReducers({
	projects: projectReducer,
	timecards: timecardReducer,
	users: usersReducer
});