{ Plugin
  Scriptex
  Scripter
  PluginFixture
  ScripterFixture
} = require(SCRIPTEX_TEST)

describe "Plugin", ->

  # describe "static deploy([engine=Scripter],[customisable=false]) : Array<string>", ->
  describe "static deploy([configurable=false],[api=Plugin.API][engine=Scripter]) : Array<string>", ->

    beforeEach ->
      sinon.spy(Scriptex::, "deploy")

    afterEach ->
      Scriptex::deploy.restore()

    context "Given Plugin.deploy has instantiated and deployed a plugin", ->


      getDeployedPlugin = -> Scriptex::deploy.lastCall.args[0]


      context "When the engine argument was provided", ->
        specify "Then the plugin was deployed to that engine", ->
          engine = new ScripterFixture()
          Plugin.deploy(true,Plugin.API,engine)
          plugin = getDeployedPlugin()

          expect(plugin.engine).eql(engine)
          return

        return

      context "When the engine argument was not provided", ->
        specify "Then the plugin was deployed to Scripter", ->
          Plugin.deploy()
          plugin = getDeployedPlugin()
          expect(plugin.engine).eql(Scripter)
          return

        return

      context "When the customisable argument was provided as false", ->
        specify "Then the properties deployed to engine are non-configurable", ->
          engine = new ScripterFixture()
          keys = PluginFixture.deploy(false, PluginFixture.API, engine)
          for key in keys
            expect(engine)
              .ownPropertyDescriptor(key)
                .to.have.property("configurable")
                  .eql(false)

          return

        return

      context "When the customisable argument was not provided", ->
        specify "Then the properties deployed to engine are non-configurable", ->
          engine = new ScripterFixture()
          keys = PluginFixture.deploy(undefined, PluginFixture.API, engine)
          for engineKey in keys
            expect(engine)
              .ownPropertyDescriptor(engineKey)
                .to.have.property("configurable")
                  .eql(false)

          return

        return

      context "When the customisable argument was provided as true", ->
        specify "Then the properties deployed to engine are configurable", ->
          engine = new ScripterFixture()
          keys = PluginFixture.deploy(true, undefined, engine)
          for key in keys
            expect(engine)
              .ownPropertyDescriptor(key)
                .to.have.property("configurable")
                  .eql(true)

          return

        return

      return

    return

  return
