{ Plugin
  Scriptex
  ScripterFixture
  PluginFixture
  RT60PluginFixture
} = require(SCRIPTEX_TEST)

describe.only "RT60PluginFixtureIntegration", ->

  describe "updateCalculations()", ->

    beforeEach ->
      sinon.spy(Scriptex::, "deploy")
      sinon.spy(ScripterFixture::, "Trace")
      sinon.spy(RT60PluginFixture::, "calculateDecays")
      sinon.spy(RT60PluginFixture::, "calculateDelays")
      sinon.spy(RT60PluginFixture::, "traceCalculations")

    afterEach ->
      Scriptex::deploy.restore()

    getDeployedPlugin = ->
      Scriptex::deploy.lastCall.args[0]

    it "calculateDelays():void", ->
      # setup deployed plugin
      RT60PluginFixture.deploy(undefined, undefined, new ScripterFixture())
      fixture = Scriptex::deploy.lastCall.args[0]
      fixture.doCalculateDecays = true
      fixture.doCalculateDelays = true
      fixture.doUpdateCalculations = true

      # bootstrap the test
      fixture.handleProcess()

      expect(fixture.calculateDecays).calledOnce
      expect(fixture.calculateDelays).calledOnce
      expect(fixture.traceCalculations).calledTwice

      decays = fixture.calculateDecays.returnValues[0]
      delays = fixture.calculateDelays.returnValues[0]
      tracedDecays = fixture.traceCalculations.returnValues[0]
      tracedDelays = fixture.traceCalculations.returnValues[1]

      # console.info(decays)
      # console.info(delays)
      console.info(tracedDecays)
      console.info(tracedDelays)

      # Scripter was called successfully
      expect(fixture.engine.Trace).calledWith(tracedDecays)
      expect(fixture.engine.Trace).calledWith(tracedDelays)
      return

    # it "calculateDecays():void", ->
    #   # setup deployed plugin
    #   RT60PluginFixture.deploy(undefined, undefined, new ScripterFixture())
    #   fixture = Scriptex::deploy.lastCall.args[0]
    #   fixture.doCalculateDecays = true
    #   fixture.doCalculateDelays = false
    #   fixture.doUpdateCalculations = true
    #
    #   # bootstrap the test
    #   fixture.handleProcess()
    #
    #   delays = fixture.calculateDelays.returnValues[0]
    #   traced = fixture.traceCalculations.returnValues[0]
    #
    #   # Scripter was called successfully
    #   expect(fixture.engine.Trace).calledWith(traced)
    #   return
