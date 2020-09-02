{ Processor
  Scriptex
  Scripter
  ProcessorFixture
  ScripterFixture
} = require(SCRIPTEX_TEST)

describe "Processor", ->

  describe "static deploy([system=Scripter],[configurable=false]) : Array<string>", ->

    beforeEach ->
      sinon.spy(Scriptex::, "deploy")

    afterEach ->
      Scriptex::deploy.restore()

    context "Given Processor.deploy has instantiated and deployed a plugin", ->


      getDeployedPlugin = -> Scriptex::deploy.lastCall.args[0]


      context "When system is provided", ->
        specify "Then plugin is deployed to that system", ->
          system = new ScripterFixture()
          Processor.deploy(system, true)
          plugin = getDeployedPlugin()

          expect(plugin.system).eql(system)
          return

        return

      context "When system is absent", ->
        specify "Then the plugin is deployed to Scripter [default]", ->
          Processor.deploy()
          plugin = getDeployedPlugin()
          expect(plugin.system).eql(Scripter)
          return

        return

      context "When configurable is false", ->
        specify "Then #system properties are non-configurable", ->
          system = new ScripterFixture()
          keys = ProcessorFixture.deploy(system)
          for key in keys
            expect(system)
              .ownPropertyDescriptor(key)
                .to.have.property("configurable")
                  .eql(false)

          return

        return

      context "When configurable is not supplied", ->
        specify "Then #system properties are non-configurable [default]", ->
          system = new ScripterFixture()
          keys = ProcessorFixture.deploy(system)
          for engineKey in keys
            expect(system)
              .ownPropertyDescriptor(engineKey)
                .to.have.property("configurable")
                  .eql(false)

          return

        return

      context "When configurable is true", ->
        specify "Then #system properties are configurable", ->
          system = new ScripterFixture()
          keys = ProcessorFixture.deploy(system, true)
          for key in keys
            expect(system)
              .ownPropertyDescriptor(key)
                .to.have.property("configurable")
                  .eql(true)

          return

        return

      return

    return

  return
