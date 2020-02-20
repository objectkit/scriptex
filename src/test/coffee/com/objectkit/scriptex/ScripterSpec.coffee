{ Scripter } = require(SCRIPTEX_TEST)

describe "Scripter", ->
  specify "Scripter is the global scope", ->
    expect(global).eql(Scripter)
