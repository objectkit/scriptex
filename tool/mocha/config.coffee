# give access to project metadata
global.PACKAGE = require("../../package.json")
# Fix path resolution for mocha require
require("app-module-path").addPath(process.cwd())
# Define path to module built for tests
global.SCRIPTEX_TEST= "build/RELEASE-#{PACKAGE.version}/scriptex-test.js"
# Export test framework to reduce need for require
global.chai = require("chai")
global.sinon = require("sinon")
global.sinonChai = require("sinon-chai")
global.uuid = require("uuid") # like a
# Bind Sinon assertions to Chai expect and assert
global.chai.use(global.sinonChai)
# @see https://github.com/chaijs/chai/issues/86
# global.Should   = global.chai.Should()
global.expect = global.chai.expect
global.assert = global.chai.assert
