import addContext from 'mochawesome/addContext';

//Allows credit card form to be accessed and type into
Cypress.Commands.add('iframe', { prevSubject: 'element' }, $iframe => {
  Cypress.log({
    name: 'iframe',
    consoleProps() {
      return {
        iframe: $iframe
      }
    }
  })
  return new Cypress.Promise(resolve => {
    onIframeReady(
      $iframe,
      () => {
        resolve($iframe.contents().find('body'))
      },
      () => {
        $iframe.on('load', () => {
          resolve($iframe.contents().find('body'))
        })
      }
    )
  })
})
//Allows credit card form to be accessed and typed into
function onIframeReady($iframe, successFn, errorFn) {
  try {
    const iCon = $iframe.first()[0].contentWindow,
      bl = 'about:blank',
      compl = 'complete'
    const callCallback = () => {
      try {
        const $con = $iframe.contents()
        if ($con.length === 0) {
          // https://git.io/vV8yU
          throw new Error('iframe inaccessible')
        }
        successFn($con)
      } catch (e) {
        // accessing contents failed
        errorFn()
      }
    }
    const observeOnload = () => {
      $iframe.on('load.jqueryMark', () => {
        try {
          const src = $iframe.attr('src').trim(),
            href = iCon.location.href
          if (href !== bl || src === bl || src === '') {
            $iframe.off('load.jqueryMark')
            callCallback()
          }
        } catch (e) {
          errorFn()
        }
      })
    }
    if (iCon.document.readyState === compl) {
      const src = $iframe.attr('src').trim(),
        href = iCon.location.href
      if (href === bl && src !== bl && src !== '') {
        observeOnload()
      } else {
        callCallback()
      }
    } else {
      observeOnload()
    }
  } catch (e) {
    // accessing contentWindow failed
    errorFn()
  }
}

Cypress.Commands.add('triggerQV', () => {
  cy.get('*[class^="QuickViewButtonWrapper"]')
    .first()
    .invoke('attr', 'style', 'display: block')
    .find('[aria-label$="quick view modal"]')
    .click({ force: true })
  cy.get('[class^="modal is-opened"]').should('be.visible')
})

//verifies navigation of a numbered link within a div
Cypress.Commands.add('verifyLink', (selector, num) => {
  cy.get(selector)
    .find('a')
    .eq(num)
    .then($productLink => {
      const url = $productLink.attr('href')
      cy.wrap($productLink).click()
      cy.url().should('include', url)
    })
})

Cypress.Commands.add('selectCarouselImage', () => {
  cy.get('*[class^="js-carousel-nav"]')
    .first()
    .find('button[aria-label="Carousel image 2"]')
    .click()
  cy.get('button[aria-label="Carousel image 2"]').should(
    'have.attr',
    'aria-selected',
    'true'
  )
})

Cypress.Commands.add('getTodaysDate', () => {
  //Date should be in this for format only : August 26, 2021
  const d = new Date();
  const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const date = months[d.getMonth()] + ' ' + d.getDate() + ', ' + d.getFullYear();
  return date
})

Cypress.Commands.add('waitForTheApiResponse', ({ name = 'waitForApi', method = '*', url, addToReport = false, timeout = 30000 }) => {
  // This command is designed to wait for a API repsonse.
  // params : name - A Unique name, method
  cy.intercept(`${method}`, `${url}`).as(`${name}`)
  cy.wait(`@${name}`, { timeout: timeout })
    .then(interception => {
      let logs = JSON.stringify(interception.response.body)
      cy.log(`${name} response :  ${logs}`)
      if (addToReport) {
        cy.once('test:after:run', (test) => addContext({ test }, logs));
      }
    })
})

Cypress.Commands.add('verifyUrl', (urlContent) => {
  cy.log(`Verify that the URL contains : ${urlContent}`)
  cy.url()
    .should('include', urlContent)
})