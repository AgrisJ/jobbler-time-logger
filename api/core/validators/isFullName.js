// Validate alpha numeric, English alphabet only
function isFullName(value) {
    // Check if value is null
    if (value === null || value === undefined) {
        return false;
    }

    // Convert whatever the input is to string
    const text = String(value);

    // Validate name
    if (text.match(/^([\p{L}'.-]*) ([\p{L}'.-]*) ?([\p{L}'.-]*)$/) !== null) {
        return true;
    }

    return false;
}

module.exports = isFullName;