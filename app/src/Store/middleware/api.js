import axios from "axios";
import * as actions from "../api";

const api = ({ dispatch }) => next => async action => {
	if (action.type !== actions.apiCallBegan.type) return next(action);

	next(action);

	const { url, method, data, headers, onSuccess, onError } = action.payload;

	try {

		const response = await axios.request({
			baseURL: process.env.REACT_APP_API_URL + '/api',
			url,
			method,
			data,
			headers
		});

		// General
		dispatch(actions.apiCallSuccess(response.data));
		// Specific
		const _resData = response.data;
		const _payloadData = action.payload.data;
		console.log('payload', { ..._resData, ..._payloadData })
		console.log('payload deeper', { ...{ _resData }, ...{ _payloadData } })
		if (onSuccess) dispatch({ type: onSuccess, payload: { ..._resData, ..._payloadData } }); //TODO rename timecardId to cardId

	} catch (error) {
		// General
		dispatch(actions.apiCallFailed(error));
		// Specific
		if (onError) dispatch({ type: onError, payload: error });

	}


};

export default api;