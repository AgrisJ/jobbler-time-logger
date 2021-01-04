const crypto = require('crypto');
const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

rl.input.on("keypress", function (c, k) {
    // get the number of characters entered so far:
    var len = rl.line.length;
    // move cursor back to the beginning of the input:
    readline.moveCursor(rl.output, -len, 0);
    // clear everything to the right of the cursor:
    readline.clearLine(rl.output, 1);
    // replace the original input with asterisks:
    for (var i = 0; i < len; i++) {
        rl.output.write("*");
    }
});

console.log("What would you like to hash?");

rl.question("Input: ", function (input) {
    hash = crypto.createHash("sha256").update(input).digest("hex");
    console.log("Output: \x1b[32m" + hash + "\x1b[0m");
    console.log("Thank you for using our supreme service and good luck!");
    rl.close();
});