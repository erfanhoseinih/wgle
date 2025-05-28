#!/usr/bin/env node


const fs = require('fs');
const path = require('path');

const args = process.argv.slice(2);
let projectName;
if (args.length === 0) {
  console.log("please put your project name!");
  process.exit(1);
} else {
  projectName = args[0];
}


const currentDirectory = process.cwd();
const libDirectory = __dirname;

fs.mkdir(currentDirectory + "/" + projectName, { recursive: true }, (err) => {
  if (err) throw err;
});

fs.cp(libDirectory + "/../build", currentDirectory + "/" + projectName + "/lib/build", { recursive: true }, (err) => {
  if (err) throw err;
})
fs.cp(libDirectory + "/../src", currentDirectory + "/" + projectName + "/lib/src", { recursive: true }, (err) => {
  if (err) throw err;
})

const indexHtmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${projectName}</title>
</head>
<body>
<script src="./lib/build/wgle.js"></script>
<script src="./main.js"></script>
</body>
</html>
`;

fs.writeFile(currentDirectory + "/" + projectName + "/" + 'index.html', indexHtmlContent, (err) => {
  if (err) throw err;
});

const mainJavascriptContent = `
function main() {
    let canvas = document.createElement("canvas");
    document.body.appendChild(canvas)
    gl = canvas.createWebGlContext();
    gl.background(0)
}
`;

fs.writeFile(currentDirectory + "/" + projectName + "/" + 'main.js', mainJavascriptContent, (err) => {
  if (err) throw err;
}); 

console.log(`project is ready in ${currentDirectory}/${projectName}`);
