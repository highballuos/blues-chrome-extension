const path = require('path');

module.exports = {
    entry: "./background/detect.js",
    output: {
        filename: "test.js",
        path: path.resolve(__dirname, "./"),
    }
}