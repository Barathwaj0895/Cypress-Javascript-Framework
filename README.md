# CypressAutomation
End to end automated flows

# Reference of tagging test scenarios.          
cypress-grep is used for tagging. Tagging can be applied on test case level or test suite level. 

**Example** : ```it('Test scenario description',{tags : ['Regression','Smoke']}, () => { }``` 

```"test:tag:SmokeOrRegression": "cypress run --env grepTags=\"Smoke Regression \""```,    
```"test:tag:SmokeAndRegression": "cypress run --env grepTags=\"Smoke+Regression \""```,    
```"test:tag:invertRegression": "cypress run --env grepTags=\"-Regression \""``` 

# To run the test suites please use the below command as format      
```npm run test incognito headed grepTags=-Regression spec=[path\any_spec.js]```

### To open the cypress local dashborad 
```npx cypress open --env configFile=production```

### npm run command parameters description
- incognito = opens the chrome in incognito mode.   
- headed = Arg will run the cypress scenarios in headed mode (Browser open and running in frontend)  
- grepTags = Tags used for the test scenarios like Regression,smoke , p1 etc.  
- spec = list of relative paths of spec files
- browser = specify the browser name (eg. firefox). default browser it set to chrome.
- device = name of the device (eg. iphone-x)
- configFile="production" note : Default value is set to development

List of devices used for test execution
Below listed devices will be used for View port related test scenarios 

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

    Sample Command:
    npm run test headed device=iphone-x 
    parameter to be passed is "device=iphone-x"

# Enable google pay in chrome browser
```/usr/bin/google-chrome --user-data-dir=/home/<user>/.config/Cypress/cy/production/browsers/chrome-stable/interactive```
### note : replace ```<user>``` with your machine user
- run the above command in terminal, it will open a browser
- go to chrome settings
- go to 'auto fill' then 'payment methods' and add the payment details and save (note : This details is to enable google pay in the browser. At run time, data will be picked from the automation suite)
- go to 'auto fill' then 'Addresses and more' and add the address details and save (note : This details is to enable google pay in the browser. At run time, data will be picked from the automation suite)
- close the browser (these details are saved in the browser and will be there when we open the browser using cypress)

# manage different environments
Now we can manage environment specific files, so we do not need to change the value every time in cypress.json

### folder structure
```
-cypress                        #root folder
    -configFiles                #config files folder
        -development            #env folder
            -.env               # .env file contains the confidential keys, do not commit this to the repo
            -development.json   # this file contains the env specific urls and timeouts
        -production            #env folder
            -.env               # .env file contains the confidential keys, do not commit this to the repo
            -production.json   # this file contains the env specific urls and timeouts
```
### configFiles/.env data fields (Get this data from the team) : 
- stripeBearerToken="Bearer "
- cognitoUserPoolWebClientID=""
- challengebypass=""
- test_mode=""

### Important points : 
- If the local setup is runnig in ssl mode update serverUrl as ```https://local.glossier.io:3000``` and baseUrl as ```https://local.glossier.io:8000``` in cypress/configFiles/development/development.json
- else you can use serverUrl as ```http://localhost:3000``` and baseUrl as ```http://localhost:8000``` in cypress/configFiles/development/development.json