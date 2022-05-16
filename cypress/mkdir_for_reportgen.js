// Removing and creating the required directories

const fs = require('fs-extra');
const path = require('path');

fs.removeSync('cypress/reports', { recursive: true }, () => console.log('done'));
fs.mkdirs(path.join(__dirname, 'reports'), (err) => {
    if (err) {
        return console.error(err);
    }
    console.log('Directory created successfully!');
});

fs.mkdirs(path.join(__dirname, 'reports/mochareports'), (err) => {
    if (err) {
        return console.error(err);
    }
    console.log('Sub created successfully!');
});   