{
  RT60Plugin
  RT60Calculator
  ScripterFixture
  Scriptex
} = require(SCRIPTEX_TEST)

describe "RT60Plugin", ->

  Help =
    SANDBOX: sinon.createSandbox()
    DEPLOYMENT: ["NeedsTimingInfo", "PluginParameters", "Reset", "ProcessMIDI", "ParameterChanged"]
    ENGINE: null


  beforeEach ->
    Help.SANDBOX.spy(RT60Plugin::, "handleProcess")
    Help.SANDBOX.spy(RT60Plugin::, "handleParameter")
    Help.SANDBOX.spy(RT60Plugin::, "handleReset")
    Help.SANDBOX.spy(RT60Plugin::, "renderCalculations")
    Help.SANDBOX.spy(ScripterFixture::, "Trace")
    Help.SANDBOX.spy(ScripterFixture::, "GetTimingInfo")
    Help.SANDBOX.stub(Scriptex, "ENGINE").get(-> Help.ENGINE = new ScripterFixture())

  afterEach ->
    Help.SANDBOX.restore()

  describe "integration test", ->

    describe "When Calculate is pressed", ->
      it "Then renderCalculations is set to true", ->

        api = RT60Plugin.deploy()
        ngn = Help.ENGINE

        expect(api).members(Help.DEPLOYMENT)

        # trial UI integration
        ngn.ProcessMIDI()
        expect(RT60Plugin::handleProcess).calledOnce
        expect(ngn.GetTimingInfo).not.called
        expect(ngn.Trace).not.called
        ngn.ParameterChanged(1,1) # tick Delays
        ngn.ParameterChanged(2,1) # tick Decays
        ngn.ParameterChanged(3,1) # tick Modulations
        ngn.ParameterChanged(4,1) # press calculate button
        expect(ngn.GetTimingInfo).not.called
        expect(ngn.Trace).not.called
        ngn.ProcessMIDI()
        expect(ngn.GetTimingInfo).called
        expect(ngn.Trace).called

        # inspect console
        traces = ngn.Trace.getCalls().map( (call) => call.lastArg )
        traced = traces.join("\n")

        # validate the results
        expect(traced).to.have.string("BPM 120", "METER 4|4")

        return
