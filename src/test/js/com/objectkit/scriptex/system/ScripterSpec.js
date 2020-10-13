import { Scripter } from "@objectkit/scriptex"
import chai from "chai"

describe(`Scripter`, () => {
  specify(`Scripter is a reference to the global scope`, () => {
    chai.expect(Scripter).eql(global)
  })
})
