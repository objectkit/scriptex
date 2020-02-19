{ Scripter } = require(SCRIPTEX_TEST)

describe "Scripter", ->
  context "Given access to Scripter", ->
    specify "Given access to an alias of the global scope.", ->
      expect(global).eql(Scripter)
