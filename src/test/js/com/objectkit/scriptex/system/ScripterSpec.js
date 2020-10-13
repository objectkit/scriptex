import { Scripter } from "@objectkit/scriptex"
describe(`Scripter`, () => {
  specify(`Scripter is a reference to the global scope`, () => {
    assert.strictEqual(Scripter, global)
  })
})
