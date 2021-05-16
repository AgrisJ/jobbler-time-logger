export function isLocalStored(name) {
	if (localStorage.getItem(name) === 'undefined') return false;
	if (localStorage.getItem(name)) return localStorage.getItem(name);
	return false
};
export function isRounded(number) {
	return Math.round(+number * 10) / 10;
};

export function isObject(obj) {
	return Object.prototype.toString.call(obj) === '[object Object]';
};

export function getTimeFormat(current_datetime) {
	const minutes = (current_datetime.getMinutes() < 10 ? '0' : '') + current_datetime.getMinutes();
	const hours = (current_datetime.getHours() < 10 ? '0' : '') + current_datetime.getHours();
	return hours + ":" + minutes;
}

export function totalHours(startTime, endTime) {
	let msHour = 60 * 60 * 1000,
		msDay = 60 * 60 * 24 * 1000;
	const start = new Date(startTime);
	const end = new Date(endTime);
	const hours = Math.floor(((end - start) % msDay) / msHour)
	return hours;
}

export function totalMinutes(startTime, endTime) {
	let msMinute = 60 * 1000,
		msDay = 60 * 60 * 24 * 1000;
	const start = new Date(startTime);
	const end = new Date(endTime);
	const minutes = Math.floor(((end - start) % msDay) / msMinute) % 60;

	return minutes;
}

export function totalTime(
	formatted = false,
	start,
	end
) {
	const hours = totalHours(start, end);
	const minutes = totalMinutes(start, end);
	const timeFormat = (hours, minutes) => (`${Math.floor(hours)}h ${Math.abs(minutes)}min`);
	const readyToReturn = end !== '' && start !== '';

	const decimalMin = minutes / 60;
	const decimalTime = +(decimalMin + hours).toPrecision(3);

	if (formatted) {
		if (readyToReturn) return timeFormat(hours, minutes);
		else return timeFormat(0, 0);
	} else {
		return decimalTime;
	}
}

export function resultDate(date) {
	const DATE = new Date(date);
	const timezoneCorrectedNow = new Date(DATE - DATE.getTimezoneOffset() * 60000)
	const formattedDate = timezoneCorrectedNow.toJSON()/* .split("T")[0] */;
	return formattedDate;
}

export function decimalToTime(time) {
	let hrs = Math.floor(time)
	let min = Math.round(time % 1 * 60)
	min = min < 10 ? "0" + min : min.toString();
	return hrs + ":" + min;
};

export function deepClone(obj) {
	return JSON.parse(JSON.stringify(obj))
}