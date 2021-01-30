function isDate(date) {
    if (!isNaN(Date.parse(date))) {
        return true;
    }
    
    return false;
}

module.exports = isDate;