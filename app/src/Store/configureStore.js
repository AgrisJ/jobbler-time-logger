import { configureStore } from '@reduxjs/toolkit';
import reducer from './reducers/reducer';


export default function () {
	return configureStore({ reducer });
};