const glob = require("glob");
const fs = require("fs");
let report = require("./reports/mochareports/report.json");

let stats = {
    "testsRegistered": 0,
    "passes": 0,
    "failures": 0
};

glob("cypress/reports/mocha/*.json", function (err, files) {
    if (err) return;
    files.forEach(file => {
        const stat = require(file.replace("cypress", "."));

        stats.testsRegistered += stat.stats.suites;

        stat.results[0].suites.forEach((suite) => {
            let passed = true;
            for (let test of suite.tests) {
                if (test.fail) {
                    passed = false;
                    stats.failures += 1;
                    break;
                }
            }
            if (passed)
                stats.passes += 1;
        })
    });

    Object.assign(report.stats, stats);
    fs.writeFileSync("cypress/reports/mochareports/report.json", JSON.stringify(report, null, 2));
})