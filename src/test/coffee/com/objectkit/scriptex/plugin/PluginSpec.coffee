{ Plugin
  Scriptex
  Scripter
} = require(SCRIPTEX_TEST)

PluginFixture = require("./PluginFixture")
ScripterFixture = require("../engine/ScripterFixture")

describe "Plugin", ->

  describe "static deploy(engine,customisable) : Array<string>", ->

    beforeEach ->
      sinon.spy(Scriptex::, "deploy")

    afterEach ->
      Scriptex::deploy.restore()

    context "Given Plugin.deploy(...rest) has deployed a plugin", ->

      getDeployedPlugin = ->
        Scriptex::deploy.lastCall.args[0]

      context "When engine argument was provided", ->
        specify "Then plugin is deployed to provided engine", ->
          engine = new ScripterFixture()
          Plugin.deploy(engine)
          plugin = getDeployedPlugin()
          expect(plugin.engine).eql(engine)
          return

        return

      context "When engine argument was not provided", ->
        specify "Then plugin is deployed to Scripter", ->
          Plugin.deploy()
          plugin = getDeployedPlugin()
          expect(plugin.engine).eql(Scripter)
          return

        return

      context "When customisable argument was provided as true", ->
        specify "Then properties deployed to engine are configurable", ->
          engine = new ScripterFixture()
          keys = PluginFixture.deploy(engine, true)
          for key in keys
            expect(engine)
              .ownPropertyDescriptor(key)
                .to.have.property("configurable")
                  .eql(true)

          return

        return

      context "When customisable argument was provided as false", ->
        specify "Then properties deployed to engine are non-configurable", ->
          engine = new ScripterFixture()
          keys = PluginFixture.deploy(engine, false)
          for engineKey in keys
            expect(engine)
              .ownPropertyDescriptor(engineKey)
                .to.have.property("configurable")
                  .eql(false)

          return

        return

      context "When customisable argument was not provided", ->
        specify "Then properties deployed to engine are non-configurable", ->
          engine = new ScripterFixture()
          keys = PluginFixture.deploy(engine)
          for engineKey in keys
            expect(engine)
              .ownPropertyDescriptor(engineKey)
                .to.have.property("configurable")
                  .eql(false)

          return

        return

      return

    return

  return
