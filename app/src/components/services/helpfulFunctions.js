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