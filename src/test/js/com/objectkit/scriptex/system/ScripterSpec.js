import chai from "chai"
import { Scripter } from "@objectkit/scriptex"

describe(`Scripter`, () => {
  specify(`Scripter is a reference to the global scope`, () => {
    const { assert } = chai
    assert.strictEqual(Scripter, global)
  })
})
