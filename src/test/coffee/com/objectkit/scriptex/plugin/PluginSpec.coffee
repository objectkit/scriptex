{ Plugin
  Scriptex
  Scripter
} = require(SCRIPTEX_TEST)

APIKeys = require("../APIKeys")
PluginFixture = require("./PluginFixture")
ScripterFixture = require("../engine/ScripterFixture")

describe.only "Plugin", ->

  API = new APIKeys()

  describe "static deploy(engine,customisable) : Array<string>", ->

    context "Given Plugin.deploy(...rest) has deployed a plugin", ->

      beforeEach ->
        sinon.spy(Scriptex::, "deploy")

      afterEach ->
        Scriptex::deploy.restore()

      context "When no arguments were provided", ->
        specify "Then plugin is deployed with Scriptex defaults", ->
          keys = Plugin.deploy()
          # property writing to global scope avoided in this case
          expect(keys).to.be.empty
          plugin = Scriptex::deploy.lastCall.args[0]
          # Scriptex uses Scripter as the default engine
          expect(plugin.engine).eql(Scripter)
          return

        return

      context "When engine argument was provided", ->
        specify "Then plugin is deployed to provided engine", ->
          engine = new ScripterFixture()
          Plugin.deploy(engine)
          plugin = Scriptex::deploy.lastCall.args[0]
          expect(plugin.engine).eql(engine)
          return

        return

      context "When engine argument was not provided", ->
        specify "Then plugin is deployed to Scripter", ->
          Plugin.deploy(undefined)
          plugin = Scriptex::deploy.lastCall.args[0]
          expect(plugin.engine).eql(Scripter)
          return

        return

      context "When true is passed to customisable argument", ->
        specify "Then properties deployed to engine are configurable", ->
          customisable = true
          engine = new ScripterFixture()
          keys = PluginFixture.deploy(engine, customisable)
          expect(keys).to.have.members(API.getScripterKeys())
          for key in keys
            expect(engine)
              .ownPropertyDescriptor(key)
                .property("configurable", customisable)

          return

        return

      context "When false is passed to customisable argument", ->
        specify "Then properties deployed to engine are non-configurable", ->
          customisable = false
          engine = new ScripterFixture()
          keys = PluginFixture.deploy(engine, customisable)
          expect(keys).to.have.members(API.getScripterKeys())
          for engineKey in keys
            expect(engine).ownPropertyDescriptor(engineKey).property("configurable", customisable)

          return

        return
