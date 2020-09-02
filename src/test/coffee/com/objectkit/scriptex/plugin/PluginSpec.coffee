{ Processor
  Scriptex
  Scripter
  PluginFixture
  ScripterFixture
} = require(SCRIPTEX_TEST)

describe "Processor", ->

  describe "static deploy([engine=Scripter],[configurable=false]) : Array<string>", ->

    beforeEach ->
      sinon.spy(Scriptex::, "deploy")

    afterEach ->
      Scriptex::deploy.restore()

    context "Given Processor.deploy has instantiated and deployed a plugin", ->


      getDeployedPlugin = -> Scriptex::deploy.lastCall.args[0]


      context "When engine is provided", ->
        specify "Then plugin is deployed to that engine", ->
          engine = new ScripterFixture()
          Processor.deploy(engine, true)
          plugin = getDeployedPlugin()

          expect(plugin.engine).eql(engine)
          return

        return

      context "When engine is absent", ->
        specify "Then the plugin is deployed to Scripter [default]", ->
          Processor.deploy()
          plugin = getDeployedPlugin()
          expect(plugin.engine).eql(Scripter)
          return

        return

      context "When configurable is false", ->
        specify "Then #engine properties are non-configurable", ->
          engine = new ScripterFixture()
          keys = PluginFixture.deploy(engine)
          for key in keys
            expect(engine)
              .ownPropertyDescriptor(key)
                .to.have.property("configurable")
                  .eql(false)

          return

        return

      context "When configurable is not supplied", ->
        specify "Then #engine properties are non-configurable [default]", ->
          engine = new ScripterFixture()
          keys = PluginFixture.deploy(engine)
          for engineKey in keys
            expect(engine)
              .ownPropertyDescriptor(engineKey)
                .to.have.property("configurable")
                  .eql(false)

          return

        return

      context "When configurable is true", ->
        specify "Then #engine properties are configurable", ->
          engine = new ScripterFixture()
          keys = PluginFixture.deploy(engine, true)
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
