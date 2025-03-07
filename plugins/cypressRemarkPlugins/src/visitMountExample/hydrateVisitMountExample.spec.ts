import { expect, it } from 'vitest'
import { hydrateVisitMountExample } from './hydrateVisitMountExample'

it(`should replace simple visit/mount token with parsed visit/mount commands`, () => {
  let code = `-{cy.visit('/index.html')::cy.mount(<DatePicker id="date" />)}-`
  let { visitCode, mountCode } = hydrateVisitMountExample(code)
  expect(visitCode).toEqual(`cy.visit('/index.html')`)
  expect(mountCode).toEqual(`cy.mount(<DatePicker id="date" />)`)
})

it(`should replace multi-line code with parsed visit/mount commands`, () => {
  let code = `
  cy.clock(now)
  -{cy.visit('/index.html')::cy.mount(<DatePicker id="date" />)}-
  cy.get('#date').should('have.value', '04/14/2021')
  `
  let { visitCode, mountCode } = hydrateVisitMountExample(code)
  expect(visitCode).toEqual(`
  cy.clock(now)
  cy.visit('/index.html')
  cy.get('#date').should('have.value', '04/14/2021')
  `)
  expect(mountCode).toEqual(`
  cy.clock(now)
  cy.mount(<DatePicker id="date" />)
  cy.get('#date').should('have.value', '04/14/2021')
  `)
})

it(`should replace multi-line token with parsed visit/mount commands`, () => {
  let code = `-{// visiting the dashboard should make requests that match
  // the two routes above
  cy.visit('http://localhost:8888/dashboard')::// mounting the dashboard should make requests that match
  // the two routes above
  cy.mount(<Dashboard />)}-`
  let { visitCode, mountCode } = hydrateVisitMountExample(code)
  expect(visitCode).toEqual(`// visiting the dashboard should make requests that match
  // the two routes above
  cy.visit('http://localhost:8888/dashboard')`)
  expect(mountCode).toEqual(`// mounting the dashboard should make requests that match
  // the two routes above
  cy.mount(<Dashboard />)`)
})



it('blank code string should throw error', () => {
  let code = ''
  expect(() => hydrateVisitMountExample(code)).toThrowError(
    'No valid token to replace in visit-mount-example code block: ' + code
  )
})

it('code string without replace string should throw error', () => {
  let code = 'let abc = 123'
  expect(() => hydrateVisitMountExample(code)).toThrowError(
    'No valid token to replace in visit-mount-example code block: ' + code
  )
})

it('code with invalid token should throw error', () => {
  let code = '-{hello}-'
  expect(() => hydrateVisitMountExample(code)).toThrowError(
    'Token format invalid in visit-mount-example: hello'
  )
})
