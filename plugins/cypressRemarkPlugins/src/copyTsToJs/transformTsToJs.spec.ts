import { expect, it } from 'vitest'
import { transformTsToJs } from './transformTsToJs'

it(`should strip out any typings`, async () => {
  let code = `let age: number = 23
  let name: string = 'joe';
  function foo(bar: string) {}
  `

  let { jsCode } = await transformTsToJs(code, {})

  expect(jsCode).toEqual(`let age = 23
let name = 'joe'
function foo(bar) {}`)
})

it('should maintain newlines', async () => {
  let code = `import { defineConfig } from 'cypress'

export default defineConfig({})

export let name = 'joe'`

  let { jsCode } = await transformTsToJs(code, {})

  expect(jsCode).toEqual(`let { defineConfig } = require('cypress')

module.exports = defineConfig({})

module.exports.name = 'joe'`)
})

it('should convert imports/exports to require/modules', async () => {
  let code = `import { defineConfig } from 'cypress'
export default defineConfig({})
export let name = 'joe'`
  let { jsCode } = await transformTsToJs(code, {})

  expect(jsCode).toEqual(`let { defineConfig } = require('cypress')
module.exports = defineConfig({})
module.exports.name = 'joe'`)
})
