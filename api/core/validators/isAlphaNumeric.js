// Validate alpha numeric, English alphabet only
function isAlphaNumeric(value) {
    // Check if value is null
    if (value === null || value === undefined) {
        return false;
    }

    // Convert whatever the input is to string
    const text = String(value);

    // Validate alpha numeric
    if (text.match(/^[\p{L}0-9]+$/i) !== null) {
        return true;
    }

    return false;
}

module.exports = isAlphaNumeric;