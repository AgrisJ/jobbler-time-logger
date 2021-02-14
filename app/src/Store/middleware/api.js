import axios from "axios";
import * as actions from "../api";

const api = ({ dispatch }) => next => async action => {
	if (action.type !== actions.apiCallBegan.type) return next(action);

	next(action);

	const { url, method, data, headers, onSuccess, onError } = action.payload;

	try {

		const response = await axios.request({
			baseURL: 'https://localhost/api',
			url,
			method,
			data,
			headers
		});

		// General
		dispatch(actions.apiCallSuccess(response.data));
		// Specific
		if (onSuccess) dispatch({ type: onSuccess, payload: response.data });

	} catch (error) {
		// General
		dispatch(actions.apiCallFailed(error));
		// Specific
		if (onError) dispatch({ type: onError, payload: error });

	}


};

export default api;