const fs = require("fs");
const path = require("path");

function cleanBuild() {
  fs.readdir("dist/", (err, files) => {
    if (err) console.log(err);
    else {
      files.forEach((file) => {
        fs.rm(path.resolve("dist/" + file), { recursive: true }, (err) => {
          if (err) {
            // File deletion failed
            console.error(err.message);
            return;
          }
        });
      });
    }
  });
}

module.exports = {
  cleanBuild,
};
