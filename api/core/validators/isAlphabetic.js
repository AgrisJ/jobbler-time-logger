// Validate alpha numeric, English alphabet only
function isAlphabetic(value) {
    // Check if value is null
    if (value === null || value === undefined) {
        return false;
    }

    // Convert whatever the input is to string
    const text = String(value);

    // Validate alpha numeric
    if (text.match(/^[\p{L}]+$/i) !== null) {
        return true;
    }

    return false;
}

module.exports = isAlphabetic;