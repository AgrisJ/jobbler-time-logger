const fs = require('fs');
let logStream = fs.createWriteStream("./logs/server.log", {flags:'a'});

function log(message) {
    // Check if message is a message or a stack trace
    if (message.stack) {
        message = message.stack;
    }

    if (config.API_DEBUG_MESSAGES) {
        console.log('Debug said:\n\x1b[36m' + message + '\x1b[0m');
    }

    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May','Jun','Jul','Aug','Sept','Oct','Nov','Dec'];
    const date = new Date();
    const year = date.getFullYear();
    const month = months[date.getMonth()];
    const dayOfTheMonth = date.getDate();
    let hours = date.getHours(); if (hours < 10) { hours = '0' + hours}
    let minutes = date.getMinutes(); if (minutes < 10) { minutes = '0' + minutes}
    let seconds = date.getSeconds(); if (seconds < 10) { seconds = '0' + seconds}
    let text = '[' + month + '-' + dayOfTheMonth + '-' + year + ' ';
    text += hours + ':' + minutes + ':' + seconds + '] ' + message + '\r\n';
    try {
        logStream.write(text);
    } catch(exception) {
        console.log("Could not write to server.log, error:" + exception);
    }
}

module.exports = log;