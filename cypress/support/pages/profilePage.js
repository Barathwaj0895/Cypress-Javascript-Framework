export const getLogOut_btn = () => cy.get('button[aria-label="Sign Out"]')

export const getCloseProfilePanel_btn = () => cy.get('button[aria-label="Blade Close"]')

export const getAccountToggle_btn = () => cy.get('button[aria-label="Account Toggle"]')

export const getLoyaltyBanner_panel = () => cy.get('div[data-testid="account-blade-member-card"]')

export const getGlossierMembership_panel = () => cy.get('div[data-testid="umbrella-dna-interstitial"]')

export const getUserName_txtBox = () => cy.get('input[id="firstName"]')

export const getSelectMonth_list = () => cy.get('select[id="month-dropdown"]')

export const getSelectDay_list = () => cy.get('select[id="day-dropdown"]')

export const getCheckBox_btn = () => cy.get('input[id="terms-checkbox"]')

export const getCheckBoxBtn_status = (value) => cy.get(`input[aria-checked=${value}]`)

export const getFinalJoinUs_btn = () => cy.get('button[name="enroll-button"]')

export const getMemberInfoSection_div = () => cy.get('.gAMjcf > .iHZvIS > .Heading-y4ipw2-0')

export const getMemberCardBadgeName_txt = () => cy.get('div[data-testid="user-info-section"] h4')

export const getMemberCardJoining_txt = () => cy.get('div[data-testid="user-info-section"] p')

export const getMemberCardPoints_txt = () => cy.get('[data-testid=pill-wrapper] > span')

export const getMemberCardTier_txt = () => cy.get('div[data-testid="member-info-section"] h5')

export const getMemberCardNextTier_txt = () => cy.get('[data-testid=member-info-next-level-spend]')

export const getMemberCardManageProfile_link = () => cy.get('a[href$="/account/membership"]')

export const getProfileName_txt = () => cy.get('div[data-testid="header-account-info"] h4')

export const getProfileMemberSince_txt = () => cy.get('div[data-testid="header-account-info"] p')

export const getEditProfile_link = () => cy.get('div[data-testid="header-account-info"] button')

export const getProfileCurrentTier_txt = () => cy.get('div[data-testid="header-tier-info"] > div > div > h5')

export const getProfileNextTier_txt = () => cy.get('[data-testid=tier-info-next-level-spend]')

export const getJustForYou_section = () => cy.get('div[data-testid="account-membership-info"] > :first-child')

export const getPayWithPoints_section = () => cy.get('h4').contains('Pay with points').parent()

export const getProfileNeedHelp_section = () => cy.get('h3').contains('Need help?')

export const getProfileBenifitsHeader_txt = () => cy.get('table[data-testid="membership-benefits-table"]').parent()

export const getProfilePoints_txt = () => cy.get('div[data-testid="header-tier-info"] div[data-testid=pill-wrapper] > span')

export const getFirstNameBlankError_txt = () => cy.get('p[class^="Text"]')

export const getBirthDayError_txt = () => cy.get('p[class^="Text"]').contains('Select a valid date of birth')

export const getPayWithPointsBanner_txt = (text) => cy.get('h3[class^="Heading"]').contains(text)

export const getPayWithPointsUsageInformation_txt = (text) => cy.get('p[class^="Text"]').contains(text)

export const getPayWithPoints_txt = () => cy.get('div[data-testid="pill-wrapper"]')

export const getPayWithPointsMarkDown_txt = () => cy.get('p[data-testid="progress-text"]')

export const getExploreMyMembership_btn = () => cy.get('a[class="StyledButtonBlock-sc-1pt6r5n-2 hShZFu"]')

export const getOfferHeading_txt = () => cy.get('p[class^="Heading"]')

export const getApplyInBag_btn = () => cy.get('button[class^="StyledButtonBlock"]').contains('Apply in bag')

export const getScroll_view = () => cy.get('div[class^="ScrollableList"]')

export const getHeading_txt = () => cy.get('h2[class^="Heading"]')

export const getCTA_btn = (value) => cy.get(`${value}[data-testid="cta"]`)
export const getBenefitsTableTier_btn = () => cy.get('button[class^="TabberButton"]')

export const getProfileBenefitsTable_table = () =>  cy.get('table[data-testid^="membership-benefits-table"]')

export const getPointsAmount_label = () => cy.get('button[class^="StyledButtonBlock"]').contains('Apply in bag').should("be.visible").scrollIntoView().siblings('p[class*="Heading"]')

export const getHowDoIEarnPoints_btn = () => cy.get('button[aria-controls="how-to-earn-points-accordion"]')

export const getHowDoIEarnPointsMembershipTerms_btn = () => cy.get('div[id="how-to-earn-points-accordion"] button').contains('Membership Terms')