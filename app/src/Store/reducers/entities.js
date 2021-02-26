import { combineReducers } from 'redux';
import timecardReducer from '../slices/timecards';
import projectReducer from '../slices/projects';
import usersReducer from '../slices/users';
import monthIndexReducer from '../slices/monthIndex';
import currentAddressReducer from '../slices/currentAddress';
import currentContractorReducer from '../slices/currentContractor';
import currentModeIndexReducer from '../slices/currentModeIndex';
import totalTimeReducer from '../slices/totalTime';
import cardCountReducer from '../slices/cardCount';
import loginReducer from '../slices/login';
import noteReducer from '../slices/notes';


export default combineReducers({
	projects: projectReducer,
	timecards: timecardReducer,
	users: usersReducer,
	monthIndex: monthIndexReducer,
	currentAddress: currentAddressReducer,
	currentContractor: currentContractorReducer,
	currentModeIndex: currentModeIndexReducer,
	totalTime: totalTimeReducer,
	cardCount: cardCountReducer,
	login: loginReducer,
	notes: noteReducer
});