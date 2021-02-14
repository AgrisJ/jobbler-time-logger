import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit';
import api from './middleware/api';
import reducer from './reducers/reducer';


// eslint-disable-next-line import/no-anonymous-default-export
export default function () {
	return configureStore({
		reducer,
		middleware: [
			...getDefaultMiddleware(),
			api
		]
	});
};