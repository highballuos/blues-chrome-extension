const path = require('path');

module.exports = {
    entry: "./test.js",
    output: {
        filename: "index.js",
        path: path.resolve(__dirname, "./"),
    }
}