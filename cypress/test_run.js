const exec = require('child_process').exec;

//get the list of arguments passed in command line
let args = process.argv;
//ignore first two arguments
args.splice(0, 2);

// Dictionary for viewport
const devices = {
    "ipad-2": { width: 768, height: 1024 },
    "ipad-mini": { width: 768, height: 1024 },
    "iphone-3": { width: 320, height: 480 },
    "iphone-4": { width: 320, height: 480 },
    "iphone-5": { width: 320, height: 568 },
    "iphone-6": { width: 375, height: 667 },
    "iphone-6+": { width: 414, height: 736 },
    "iphone-7": { width: 375, height: 667 },
    "iphone-8": { width: 375, height: 667 },
    "iphone-x": { width: 375, height: 812 },
    "iphone-xr": { width: 414, height: 896 },
    "iphone-se2": { width: 375, height: 667 },
    "macbook-11": { width: 1366, height: 768 },
    "macbook-13": { width: 1280, height: 800 },
    "macbook-15": { width: 1440, height: 900 },
    "macbook-16": { width: 1536, height: 960 },
    "samsung-note9": { width: 414, height: 846 },
    "samsung-s10": { width: 360, height: 760 },
}

//variable declarations with default value
let env = "--env "
let config = "--config "
let browser = "chrome"
let spec = ""
let headed = ""
let parallel = ""
let incognito = ""
let tags = "grepTags=\"\""
let viewportWidth = ""
let viewportHeight = ""
let device = ""
let configFile = ""

args.forEach(arg => {
    console.log(`args: ${arg}`);
    let key = arg.split('=')[0]
    let value = arg.split('=')[1]
    console.log(`key : ${key}`)
    console.log(`value : ${value}`)
    switch (key) {
        case 'incognito':
            incognito = 'incognito=\" --incognito\"'
            break;
        case 'grepTags':
            tags = 'grepTags="' + value + '"'
            break;
        case 'browser':
            browser = value
            break;
        case 'spec':
            spec = '--spec ' + value
            break;
        case 'headed':
            headed = '--headed'
            break;
        case 'parallel':
            parallel = '--parallel'
            break;
        case "device":
            viewportWidth = "viewportWidth=" + devices[value]["width"]
            viewportHeight = "viewportHeight=" + devices[value]["height"]
            config += viewportWidth + ',' + viewportHeight
            device = value
            break;
        case 'configFile':
            if (value !== 'development') {
                configFile = 'configFile=' + value
            } 
            break;
    }
})

if (incognito !== "") {
    env += incognito + ','
}
if (device != "") {
    env += "device=" + device + ','
}
if(configFile !== ""){
    env += configFile + ','
}
env += tags
console.log(`final env value : ${env}`);

if(config === "--config "){
    config = ""
}

//final cypress command that will be executed
cypressCommand = `cypress run ${headed} ${config} ${env} ${spec} --browser ${browser} ${parallel}`

console.log("The Command getting executed is:");
console.log(cypressCommand);

//Command executions
async function execute_script(cmd) {
    await exec(cmd, function (err, stdout, stderr) {
        console.log(stdout)
        if (err) {
            console.log(err);
            return;
        }
        console.log("Test:run executed succesfully!");
    });
}
return async function () {
    await execute_script(cypressCommand);
}();