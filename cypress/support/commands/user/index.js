import * as profilePage from '../../pages/profilePage'
import * as signInPage from '../../pages/signInPage'
import * as cartPage from '../../pages/cartPage'
const loyaltyAPI = require("../../../fixtures/loyaltyAPI.json")


Cypress.Commands.add('login', user => {
  cy.log('Login In with email and password');
  signInPage.getAccountToggle_btn()
    .click({ force: true })
  signInPage.getEmailSignIn_txtBox()
    .type(user.email)
    .blur()
  signInPage.getPasswordSignIn_txtBox()
    .type(user.password)
    .blur()
  signInPage.getSubmitLoginForm_btn().click()
  profilePage.getLogOut_btn()
    .should('be.visible')
  cy.log('Logged in sucessfully with email and password');
})

Cypress.Commands.add('logOut', () => {
  profilePage.getLogOut_btn()
    .should('be.visible')
    .click()
  cy.log('Logged out sucessfully');
})

Cypress.Commands.add('OpenProfilePanel', () => {
  profilePage.getAccountToggle_btn()
    .should('be.visible')
    .click()
  cy.log('Profile panel opened');
})

Cypress.Commands.add('closeProfilePanel', () => {
  profilePage.getCloseProfilePanel_btn()
    .should('be.visible')
    .click()
  cy.log('Profile panel closed');
})

Cypress.Commands.add('verifyLogin', () => {
  cy.OpenProfilePanel()
  profilePage.getLogOut_btn()
    .should('be.visible')
    .log("Successfully logged in")
  cy.closeProfilePanel()
})

Cypress.Commands.add("verifyPageLoaded", () => {
  profilePage.getAccountToggle_btn()
    .should('be.visible')
})

Cypress.Commands.add("loginUsingApis", (user) => {
  //Client Session ids
  cy.request({
    method: `GET`, url: Cypress.config('serverUrl') + '/api/client-session', timeout: 60000
  }).then(response => {
    cy.log(`client session response :  ${JSON.stringify(response.body)}`)
    cy.wrap(response.status).should("equal", 200)
    cy.wrap(response.body.anonymousId).as("anonymousId")
  })
  cy.get("@anonymousId").then(anonymousId => {
    let payloadLogin = {
      "AuthFlow": "USER_PASSWORD_AUTH",
      "ClientId": Cypress.env("cognitoUserPoolWebClientID"),
      "AuthParameters": { "USERNAME": user.email, "PASSWORD": user.password },
      "ClientMetadata": { "anonId": anonymousId }
    }
    //login in initiate
    cy.request({
      method: `POST`, url: Cypress.config("awsCognitoUrl"), body: payloadLogin,
      headers: {
        "Content-Type": "application/x-amz-json-1.1",
        "X-Amz-Target": "AWSCognitoIdentityProviderService.InitiateAuth",
        "challengebypass": Cypress.env("challengebypass"),
        "referer": Cypress.config('baseUrl')
      }
    }).then(response => {
      cy.log(`Cognito Response :  ${JSON.stringify(response.body)}`)
      cy.wrap(response.status).should("equal", 200)

      let accessToken = response.body.AuthenticationResult.AccessToken
      let tokenType = response.body.AuthenticationResult.TokenType
      let refreshToken = response.body.AuthenticationResult.RefreshToken
      let idToken = response.body.AuthenticationResult.IdToken
      let awsKeyPrefix = `CognitoIdentityServiceProvider.${Cypress.env("cognitoUserPoolWebClientID")}`
      let awsKeyPrefixWithUsername = `${awsKeyPrefix}.${user.email}`

      cy.setLocalStorage(`${awsKeyPrefixWithUsername}.idToken`, idToken)
      cy.setLocalStorage(`${awsKeyPrefixWithUsername}.refreshToken`, refreshToken)
      cy.setLocalStorage(`${awsKeyPrefixWithUsername}.accessToken`, accessToken)
      cy.setLocalStorage(`${awsKeyPrefixWithUsername}.clockDrift`, 0)
      cy.setLocalStorage(`${awsKeyPrefix}.LastAuthUser`, user.email)

      //get the logged in user
      cy.request({
        method: `POST`, url: Cypress.config("awsCognitoUrl"),
        body: { "AccessToken": accessToken },
        headers: {
          "Content-Type": "application/x-amz-json-1.1",
          "X-Amz-Target": "AWSCognitoIdentityProviderService.GetUser",
          "challengebypass": Cypress.env("challengebypass"),
          "referer": Cypress.config('baseUrl')
        }
      }).then(response => {
        cy.log(`Get User Cognito Response :  ${JSON.stringify(response.body)}`)
        cy.wrap(response.status).should("equal", 200)

        cy.setLocalStorage(`${awsKeyPrefixWithUsername}.userData`, JSON.stringify(response.body))
        cy.request({
          method: `GET`, url: Cypress.config('serverUrl') + '/api/client-session' + "?accessToken=" + accessToken,
          headers: {
            "Cookie": "state.glossier.account.isReturningUser=true; newsSubEmail=undefined; new_sign_in_flag=true"
          },
          timeout: 60000
        }).then(response => {
          cy.log(`Client-Session Response :  ${JSON.stringify(response.body)}`)
          cy.wrap(response.status).should("equal", 200)
        })
      })
    })
  })
  cy.reload()
})

Cypress.Commands.add("logOutUsingApis", () => {
  //logout api
  cy.request({
    method: 'GET', url: Cypress.config('serverUrl') + '/logout', timeout: 60000
  }).then(response => {
    cy.log(`Logout Response :  ${JSON.stringify(response.body)}`)
    cy.wrap(response.status).should("equal", 200)

    //client session api
    cy.request({
      method: `GET`, url: Cypress.config('serverUrl') + '/api/client-session'
    }).then(response => {
      cy.log(`Client-Session Response :  ${JSON.stringify(response.body)}`)
      cy.wrap(response.status).should("equal", 200)
    })

  })
})

Cypress.Commands.add('validateLoyaltyBanner', (text) => {
  profilePage.getLoyaltyBanner_panel()
    .contains(text)
    .should('be.visible')
})

Cypress.Commands.add('validateGlossierMembershipPanelElements', () => {
  profilePage.getGlossierMembership_panel()
    .contains("Glossier Membership")
    .should('exist')
  cy.verifyButton('Tell me more')
  cy.verifyButton('Join us')
})

Cypress.Commands.add('fillMembershipForm', (firstName, month, day) => {
  profilePage.getUserName_txtBox().focus().clear()
  if (firstName != "") {
    profilePage.getUserName_txtBox().focused().type(firstName)
    cy.log(firstName)
  }
  profilePage.getSelectMonth_list().select(month)
  profilePage.getSelectDay_list().select(day)
  if (profilePage.getCheckBoxBtn_status(false)) {
    profilePage.getCheckBox_btn().click()
  }
  profilePage.getFinalJoinUs_btn().should('be.visible')
    .click()
})

Cypress.Commands.add('verifyMembershipTier', (tier) => {
  profilePage.getMemberInfoSection_div().contains(tier).should('be.visible')
})

Cypress.Commands.add('unenrollUserFromLoyaltyProgram', () => {
  cy.request("GET", "https://sihjgy3npk.execute-api.us-east-1.amazonaws.com/prod/resetSeedData-euvaeHeopuja6Eedunoul1acu9loh4")
    .then(response => {
      cy.log(response.body)
    })
})

Cypress.Commands.add('createEmailAddress', () => {
  const d = new Date();
  const dateNum = d.getDate().toString();
  const month = (d.getMonth() + 1).toString();
  const year = d.getFullYear().toString();
  const time = d.getTime().toString().substr(0, 10);
  const completeDateAndTime = dateNum.concat(month).concat(year).concat(time)
  const email_address = "loyalty-enroll-test+".concat(completeDateAndTime).concat("@glossier.com")
  cy.log(email_address)
  cy.wrap(email_address).as("emailAddress")
})

Cypress.Commands.add('createUserAccount', (firstName, lastName, password) => {
  cy.createEmailAddress();
  cy.get("@emailAddress").then(createdEmailAddress => {
    cy.log(createdEmailAddress)
    cy.request({
      method: 'GET', url: Cypress.config('serverUrl') + '/api/client-session', timeout: 60000
    }).then(response => {
      cy.log(`client session response :  ${JSON.stringify(response.body)}`)
      cy.wrap(response.status).should("equal", 200)
      cy.wrap(response.body.anonymousId).as("anonymousId")
    })
    cy.get("@anonymousId").then(anonymousId => {
      let payloadSignup = {
        "ClientId": Cypress.env('cognitoUserPoolWebClientID'),
        "Username": createdEmailAddress,
        "Password": password,
        "UserAttributes": [],
        "ValidationData": null,
        "ClientMetadata": {
          "email": createdEmailAddress,
          "first_name": firstName,
          "last_name": lastName,
          "subscribed": "1",
          "requireConfirm": "false",
          "anonId": anonymousId
        }
      }

      //login to initiate
      cy.request({
        method: 'POST', url: Cypress.config("awsCognitoUrl"), body: payloadSignup,
        headers: {
          "Content-Type": "application/x-amz-json-1.1",
          "X-Amz-Target": "AWSCognitoIdentityProviderService.SignUp",
          "challengebypass": Cypress.env("challengebypass"),
          "referer": Cypress.config('baseUrl')
        }
      }).then(response => {
        cy.log(`Sign Up Response :  ${JSON.stringify(response.body)}`)
        cy.wrap(response.status).should("equal", 200)
        cy.wrap(response.body.UserSub).as("Username")
      })
      cy.get('@Username').then(anonymousId, username => {
        if (Cypress.env('configFile') === 'production') {
          cy.confirmSignUp(anonymousId, username, firstName, lastName)
        }
      })

      cy.log('Loggin in')
      let user = {
        "email": createdEmailAddress,
        "password": password
      }
      cy.loginUsingApis(user)
    })
  })
})
Cypress.Commands.add('confirmSignUp', (anonymousId, username) => {
  var otp = prompt("Please enter otp");
  let payloadSignup = {
    "ClientId": Cypress.env('cognitoUserPoolWebClientID'),
    "ConfirmationCode": otp,
    "Username": username,
    "ForceAliasCreation": true,
    "ClientMetadata": {
      "first_name": "john",
      "last_name": "cena",
      "subscribed": "1",
      "anonId": anonymousId
    }
  }

  cy.request({
    method: 'POST', url: Cypress.config("awsCognitoUrl"), body: payloadSignup,
    headers: {
      "Content-Type": "application/x-amz-json-1.1",
      "X-Amz-Target": "AWSCognitoIdentityProviderService.ConfirmSignUp",
      "challengebypass": Cypress.env("challengebypass"),
      "referer": Cypress.config('baseUrl')
    },
    timeout: 60000
  }).then(response => {
    cy.log(`ConfirmSignUp Response :  ${JSON.stringify(response.body)}`)
    cy.wrap(response.status).should("equal", 200)
  })
})

Cypress.Commands.add('loginWithUserCredentials', (userCreds) => {
  cy.loginUsingApis(userCreds)
  cy.log(JSON.stringify(userCreds))
  cy.reload()
  cy.log('Login Successfull');
})

Cypress.Commands.add('validateMembershipBannerDetails', (bannerTxt, infoTxt, heading) => {
  profilePage.getAccountToggle_btn().should('be.visible').click()
  profilePage.getExploreMyMembership_btn().should('be.visible').click()
  profilePage.getPayWithPointsBanner_txt(bannerTxt).should('be.visible')
  profilePage.getPayWithPointsUsageInformation_txt(infoTxt).should('be.visible')
  cy.wait(7000)
})

Cypress.Commands.add('validateOfferBannerDetailsAndApplyToBag', () => {
  profilePage.getOfferHeading_txt().should('be.visible')
  profilePage.getOfferHeading_txt().invoke("text").then((offer) => {
    let offerAmount = parseFloat(offer.toString().replace("$", "").split(" ")[0].trim())
    cy.log(offerAmount)
    if (offerAmount == "20") {
      profilePage.getFirstNameBlankError_txt().contains('Use 400 points today')
    } else if (offerAmount == "15") {
      profilePage.getFirstNameBlankError_txt().contains('Use 300 points today')
    } else if (offerAmount == "10") {
      profilePage.getFirstNameBlankError_txt().contains('Use 200 points today')
    } else if (offerAmount == "5") {
      profilePage.getFirstNameBlankError_txt().contains('Use 100 points today')
    }
    cy.wait(6000)
    profilePage.getApplyInBag_btn().should('be.visible').click()
    cartPage.getCartObject_panel().should('be.visible').log("Apply to Bag is successfull")
    cy.wait(10000)
    cartPage.getGlossierRewardCash_txt().then((rewards) => {
      let rewardPoints = parseFloat(rewards.replace("-$", "").trim())
      cy.log("Glossier Reward Points: ", +rewardPoints)
      expect(offerAmount).equal(rewardPoints)
    })
  })
})

Cypress.Commands.add('validateMembershipPointsAvailabilityDetails', () => {
  profilePage.getPayWithPoints_txt().find('span').invoke("text").then((points) => {
    let payWithPoints = parseFloat(points.toString().replace(",", "").trim())
    cy.log("Tier Pay With Points: ", +payWithPoints)
    cy.wrap(payWithPoints).as('payWithPoints')
    profilePage.getPayWithPointsMarkDown_txt().invoke("text").then((points) => {
      let markDownPayWithPoints = parseFloat(points.toString().split("/")[0].trim())
      cy.log("Mark Down Pay With Points: ", +markDownPayWithPoints)
      cy.wrap(markDownPayWithPoints).as('markDownPayWithPoints')
      expect(payWithPoints).to.equal(markDownPayWithPoints)
      profilePage.getPayWithPointsMarkDown_txt().find('span').invoke("text").then((points) => {
        let payWithPointsPerDollar = parseFloat(points.toString().split(" pts")[0].trim())
        cy.log("Pay With Points Per Dollar: ", +payWithPointsPerDollar)
        profilePage.getPayWithPointsMarkDown_txt().find('span').invoke("text").then((points) => {
          let howManyDollars = parseFloat(points.toString().split("$")[0].trim())
          cy.log("How Many Dollars In Total: ", +howManyDollars)
          let actualAmount = markDownPayWithPoints / payWithPointsPerDollar * 5
          cy.log(actualAmount)
          let expectedAmount = howManyDollars
          cy.log(expectedAmount)
          expect(actualAmount).equal(expectedAmount)
        })
      })
    })
  })
})

Cypress.Commands.add("clientSessionAPI", () => {
  //Client Session ids
  cy.request({
    method: `GET`, url: "https://www.glossier.com/api/client-session", timeout: 60000
  }).then(response => {
    cy.wrap(response.status).should("equal", 200)
    cy.wrap(response.body.anonymousId).as("anonymousId")
    cy.wrap(response.body.token).as("token")
    cy.setCookie("LOYALTY_API_BEARER_TOKEN", response.body.token)
  })
})

Cypress.Commands.add('validateGetMessagesGetAPI', (expectedGetMessageResponse, token) => {
  cy.request({
    method: `GET`, url: "http://loyalty.glossier.com/prod/getMessages", timeout: 60000,
    headers: {
      "Accept": "application/json",
      "Authorization": token,
    }
  }).then(response => {
    cy.log(`Get Messages response :  ${JSON.stringify(response.body)}`)
    let actualGetMessageResult = response.body
    expect(actualGetMessageResult).to.eql(expectedGetMessageResponse)
    cy.wrap(response.status).should("equal", 200)
  })
})

Cypress.Commands.add('validateGetOfferGetAPI', (expectedGetOfferResponse, token) => {
  cy.request({
    method: `GET`, url: "http://loyalty.glossier.com/prod/getOffer?offerId=21525c6f-0722-40e4-a206-866b05471c40&locale=en-US", timeout: 60000,
    headers: {
      "Accept": "application/json",
      "Authorization": token,
    }
  }).then(response => {
    let actualGetOfferResult = response.body
    expect(actualGetOfferResult).to.eql(expectedGetOfferResponse)
    cy.wrap(response.status).should("equal", 200)
  })
})

Cypress.Commands.add('validateGetOffersGetAPI', (token) => {
  cy.request({
    method: `GET`, url: "https://loyalty.glossier.com/prod/getOffers?country=US", timeout: 60000,
    headers: {
      "Accept": "application/json",
      "Authorization": token,
    }
  }).then(response => {
    for (let key in loyaltyAPI.getOffers) {
      loyaltyAPI.getOffers[key] === response.body[key]
    }
    cy.wrap(response.status).should("equal", 200)
  })
})

Cypress.Commands.add('validateViewProfileGetAPI', (token) => {
  cy.request({
    method: `GET`, url: "http://loyalty.glossier.com/prod/viewProfile", timeout: 60000,
    headers: {
      "Accept": "application/json",
      "Authorization": token,
    }
  }).then(response => {
    for (let key in loyaltyAPI.viewProfile) {
      loyaltyAPI.viewProfile[key] === response.body[key]
    }
    cy.wrap(response.status).should("equal", 200)
  })
})


Cypress.Commands.add('validatePostRedeemOffer', (token) => {
  let redeemParameters = {
    "customerId": "1c60097e-5d38-4e36-bfdb-c6f3a2aab720",
    "country": "us",
    "offerId": "21525c6f-0722-40e4-a206-866b05471c40",
    "channel": "ecom",
    "locale": "en-US",
    "offerType": "gcash"
  }
  cy.request({
    method: 'POST', url: "https://loyalty.glossier.com/prod/redeemOffer", body: redeemParameters,
    headers: {
      "Accept": "application/json",
      "content-type": "application/json",
      "Authorization": token,
    },
    timeout: 60000
  }).then(response => {
    for (let key in loyaltyAPI.redeemOffer) {
      loyaltyAPI.redeemOffer[key] === response.body[key]
    }
    cy.wrap(response.status).should("equal", 200)
  })
})

Cypress.Commands.add('validatePostCreateProfile', (token) => {
  let profileParameters = {
    "birth_day": 20,
    "birth_month": 7,
    "email": "capacity-999004-test@glossier.com",
    "first_name": "Glossier",
    "last_name": "User",
    "age_range": "25-35"
  }
  cy.request({
    method: 'POST', url: "https://loyalty.glossier.com/prod/createProfile", body: profileParameters,
    headers: {
      "Accept": "application/json",
      "content-type": "application/json",
      "Authorization": token,
    },
    timeout: 60000
  }).then(response => {
    cy.wrap(response.status).should("equal", 200)
  })
})

Cypress.Commands.add('validatePutUpdateProfile', (token) => {
  let profileParameters = {
    "customer_id": "1c60097e-5d38-4e36-bfdb-c6f3a2aab720",
    "first_name": "Automation",
    "last_name": "User",
    "email": "capacity-999003-test@glossier.com",
    "country": "us",
    "roles": [""],
    "age_range": "25-35",
    "loyalty_enrolled": "true"
  }
  cy.request({
    method: 'POST', url: "https://loyalty.glossier.com/prod/updateProfile", body: profileParameters,
    headers: {
      "Accept": "application/json",
      "content-type": "application/json",
      "Authorization": token,
    },
    timeout: 60000
  }).then(response => {
    cy.wrap(response.status).should("equal", 200)
  })
})

Cypress.Commands.add('clickAccountToggleAndOpenMembershipPanel', () => {
  signInPage.getAccountToggle_btn().should('be.visible').click()
  profilePage.getExploreMyMembership_btn().should('be.visible').click()
  cy.wait(10000)
})

Cypress.Commands.add('validateCTA', (position, text, heading) => {
  profilePage.getScroll_view().scrollTo(position, { ensureScrollable: true })
  profilePage.getFirstNameBlankError_txt().contains(text).should('be.visible')
    .click()
  profilePage.getHeading_txt().contains(heading).should('be.visible')
})

Cypress.Commands.add('validateMembershipTableSelected', () => {
  profilePage.getMemberCardManageProfile_link()
    .should('be.visible')
    .click()
  profilePage.getProfileCurrentTier_txt()
    .should("be.visible")
    .invoke('text')
    .then(tier => {
      cy.log(tier.split(" ")[1])
      cy.scrollTo(0, 500)
      profilePage.getProfileBenefitsTable_table()
        .scrollIntoView()
        .should("be.visible")
        .invoke('attr', 'data-testid')
        .then(viewPort => {
          if (viewPort.includes('mobile')) {
            profilePage.getBenefitsTableTier_btn()
              .should("be.visible")
              .contains(tier.split(" ")[1])
              .should('have.attr', 'color', 'black')
          }
        })
    })
})

Cypress.Commands.add('validateMembershipTableInteractions', () => {
  profilePage.getProfileBenefitsTable_table()
    .scrollIntoView()
    .should("be.visible")
    .invoke('attr', 'data-testid')
    .then(viewPort => {
      if (viewPort.includes('mobile')) {
        cy.log('interacting membership table tiers')
        let tiers = ["Glossy", "Glossi-er", "Glossiest"]
        for (let i = 0; i < tiers.length; i++) {
          profilePage.getBenefitsTableTier_btn()
            .eq(i)
            .should("be.visible")
            .click({ force: true })
            .should("have.text", tiers[i])
            .should('have.attr', 'color', 'black')
        }
      }
    })
})

Cypress.Commands.add('amountThatCanBeAvailedAgainstPoints', () => {
  cy.intercept('GET', '**/getOffers?country**').as(`getOffers`)

  profilePage.getMemberCardManageProfile_link()
    .should('be.visible')
    .click()
  profilePage.getProfilePoints_txt()
    .should('be.visible')
    .invoke('text')
    .then(text => {
      let points = text.match(/\d/g)
      points = parseInt(points.join(""))
      cy.log(points)
      cy.wait('@getOffers', { timeout: 60000 }).then(interception => {
        cy.wrap(interception.response.statusCode).should('be.eq', 200)
      })
      if (points < 100) {
        profilePage.getPointsAmount_label()
          .should("have.text", "Keep going!")
      } else if (100 <= points && points < 200) {
        profilePage.getPointsAmount_label()
          .should("have.text", "$5 off")
      } else if (200 <= points && points < 300) {
        profilePage.getPointsAmount_label()
          .should("have.text", "$10 off")
      } else if (300 <= points && points < 400) {
        profilePage.getPointsAmount_label()
          .should("have.text", "$15 off")
      } else if (points >= 400) {
        profilePage.getPointsAmount_label()
          .should("have.text", "$20 off")
      }
    })
})

Cypress.Commands.add('verifyHowDoIEarnPoints', () => {
  cy.log('expand the panel')
  profilePage.getHowDoIEarnPoints_btn()
    .should("be.visible")
    .invoke('attr', 'aria-expanded')
    .should("eq", "false")
  profilePage.getHowDoIEarnPoints_btn()
    .click()
  profilePage.getHowDoIEarnPoints_btn()
    .should("be.visible")
    .invoke('attr', 'aria-expanded')
    .should("eq", "true")
  profilePage.getHowDoIEarnPointsMembershipTerms_btn()
    .should("exist")
    .should("be.visible")

  cy.log('collapse the panel')
  profilePage.getHowDoIEarnPoints_btn()
    .click()
  profilePage.getHowDoIEarnPoints_btn()
    .should("be.visible")
    .invoke('attr', 'aria-expanded')
    .should("eq", "false")
  profilePage.getHowDoIEarnPointsMembershipTerms_btn()
    .should("not.be.visible")
})