import { expect, it } from 'vitest'
import { transformEsmToCjs } from './transformEsmToCjs'

it(`should replace "import foo from 'bar'" with "let foo = require('bar')"`, () => {
  let code = `import foo from 'bar'`
  let result = transformEsmToCjs(code)
  expect(result).toEqual(`let foo = require('bar')`)
})

it(`should replace "import { foo } from 'bar'" with "let { foo } = require('bar')"`, () => {
  let code = `import { foo } from 'bar'`
  let result = transformEsmToCjs(code)
  expect(result).toEqual(`let { foo } = require('bar')`)
})

it(`should replace "import { a, b, c } from 'bar'" with "let { a, b, c } = require('bar')"`, () => {
  let code = `import { a, b, c } from 'bar'`
  let result = transformEsmToCjs(code)
  expect(result).toEqual(`let { a, b, c } = require('bar')`)
})

it(`should replace "import 'bar'" with "require('bar')"`, () => {
  let code = `import 'bar'`
  let result = transformEsmToCjs(code)
  expect(result).toEqual(`require('bar')`)
})

it(`should replace "import { 
  a,
  b,
  c
} from 'bar'" with "let {
  a,
  b,
  c
} = require('bar')"`, () => {
  let code = `import {
  a,
  b,
  c
} from 'bar'`
  let result = transformEsmToCjs(code)
  expect(result).toEqual(`let {
  a,
  b,
  c
} = require('bar')`)
})

it(`should replace "export default defineConfig({})" with "module.exports = defineConfig({})"`, () => {
  let code = `export default defineConfig({})`
  let result = transformEsmToCjs(code)
  expect(result).toEqual(`module.exports = defineConfig({})`)
})

it(`should replace "export let name = 'joe'" with "module.exports.name = 'joe'"`, () => {
  let code = `export let name = 'joe'`
  let result = transformEsmToCjs(code)
  expect(result).toEqual(`module.exports.name = 'joe'`)
})

it(`should work on longer example`, () => {
  let code = `import { defineConfig } from 'cypress';
import '@cypress/instrument-cra';
export default defineConfig({
  component: {
    setupNodeEvents(on, config) {
      require("@cypress/code-coverage/task")(on, config);
      return config;
    },
    devServer: {
      framework: "create-react-app",
      bundler: "webpack"
    },
  },
});`

  let result = transformEsmToCjs(code)
  expect(result).toEqual(`let { defineConfig } = require('cypress')
require('@cypress/instrument-cra')
module.exports = defineConfig({
  component: {
    setupNodeEvents(on, config) {
      require("@cypress/code-coverage/task")(on, config);
      return config;
    },
    devServer: {
      framework: "create-react-app",
      bundler: "webpack"
    },
  },
});`)
})

it('should maintain newlines', () => {
  let code = `import { defineConfig } from 'cypress';

export default defineConfig({

});
export let name = 'joe';`
  let result = transformEsmToCjs(code)
  expect(result).toEqual(`let { defineConfig } = require('cypress')

module.exports = defineConfig({

});
module.exports.name = 'joe';`)
})
