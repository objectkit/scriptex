{
  DelayLinePlugin
  DelayLineCalculator
  DelayLineRenderer
  ScripterFixture
  Scriptex
  Processor
} = require(SCRIPTEX_TEST)


describe "DelayLinePlugin", ->

  Help =
    sandbox: sinon.createSandbox()

    setupTest: ->
      @sandbox.spy(DelayLinePlugin::, "processDelayLines")
      @sandbox.spy(ScripterFixture::, "Trace")
      @sandbox.spy(ScripterFixture::, "GetTimingInfo")
      @sandbox.spy(Scriptex::, "deploy")

    teardownTest: ->
      @sandbox.restore()

    getLastTimingInfo: ->
      return ScripterFixture::GetTimingInfo.lastCall.returnValue

    getLastScripterTrace: ->
      return ScripterFixture::Trace.lastCall.lastArg

    getScripterTraces: ->
      return ScripterFixture::Trace.getCalls().map((call) -> call.lastArg)

    newDelayLinePluginDeployment: ->

      # trigger an internal deployment
      DelayLinePlugin.deploy(new ScripterFixture())

      # retrieve call metadata concerning the deployment
      {
        returnValue:api
      , lastArg:plugin
      } = Scriptex::deploy.lastCall

      system = plugin.system

      # balance the test
      expect(api).instanceof(Array)
      expect(plugin).instanceof(Processor)
      expect(system).instanceof(ScripterFixture)

      # emulated system call at time of script evaluation, thus deployment
      system.UpdatePluginParameters()

      # return metadata as an object
      return { api, plugin, system }


  beforeEach ->
    Help.setupTest()

  afterEach ->
    Help.teardownTest()

  # integration test
  context "Given `Automatic Mode` is checked", ->

    describe "When Scripter.Reset is triggered", ->

      it "Scripter.Reset hook is deployed", ->
        { plugin, system, api } = Help.newDelayLinePluginDeployment()
        expect(api).includes("Reset")
        expect(system).property("Reset").instanceof(Function)
        expect(plugin.doAutomaticUpdates).equal(1)
        # this needs to be 1 in order for the calculation to proceed
        expect(plugin.doUpdateDelayLines).equal(0)
        # demonstrate that Reset prepares the plugin for calculation
        system.Reset()
        expect(plugin.doUpdateDelayLines).equal(true)
        # and only does calculation when ProcessMIDI is invoked
        system.ProcessMIDI()

        textBlock = Help.getScripterTraces().join("\n")
        # confirm it equals same for manual calculation

        calc = new DelayLineCalculator()
        view = new DelayLineRenderer(system)
        info = Help.getLastTimingInfo()

        result = calc.calculateDelayLines(info.tempo, info.meterNumerator, info.meterDenominator)

        expect(result).instanceof(Array)

        expect(plugin.doUpdateDelayLines).equal(false)
        return
