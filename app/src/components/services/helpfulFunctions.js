export function isLocalStored(name) {
	if (localStorage.getItem(name) === 'undefined') return false;
	if (localStorage.getItem(name)) return localStorage.getItem(name);
	return false
};