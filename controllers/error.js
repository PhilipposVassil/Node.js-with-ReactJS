const path = require("path");
const rootDir = require("../helpers/path");
exports.error404 = ((request, response, next) =>{
    response.status(404).sendFile(path.join(rootDir,'404.html'));
})