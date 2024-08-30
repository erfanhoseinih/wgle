#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const projectName = process.argv[2];

if (!projectName) {
    console.error('Please provide a project name.');
    process.exit(1);
}

const projectPath = path.join(process.cwd(), projectName);

if (fs.existsSync(projectPath)) {
    console.error('Project already exists.');
    process.exit(1);
}

fs.mkdirSync(projectPath);
fs.writeFileSync(path.join(projectPath, 'index.js'), 'console.log("Hello, world!");');
console.log(`Project ${projectName} created successfully!`);
