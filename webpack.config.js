const path = require('path');

module.exports = {
    entry: "./src/background/detect.js",
    output: {
        filename: "test.js",
        path: path.resolve(__dirname, "./"),
    }
}