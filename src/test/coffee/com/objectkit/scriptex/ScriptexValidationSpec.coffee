{
  PluginFixture
  ScripterFixture
  APIKeyMap
} = require(SCRIPTEX_TEST)

describe "ScriptexValidationSpec", ->

  Help =

    SANDBOX: sinon.createSandbox()

    EXPECTED_KEYS: new APIKeyMap().getScripterKeys()

    newMIDIEvent: ->
      velocity: 100

    newPluginFixtureDeployment: ->
      engine = new ScripterFixture()

      # assert deployment OK
      expect(PluginFixture.deploy(undefined, undefined, engine)).members(@EXPECTED_KEYS)

      # configure the parameters with an UpdatePluginParameters emulation
      for parameter in engine.PluginParameters
        key = parameter.name
        val = parameter.defaultValue or 0
        engine.SetParameter(key, val)

      # refactor to make possible:
      # engine.UpdatePluginParameters()

      # plugin is not visible, but behaviour should be detectable
      return engine


  beforeEach ->
    Help.SANDBOX.spy(ScripterFixture::)
    Help.SANDBOX.spy(PluginFixture::)
    # spy on the property needsTiming

  afterEach ->
    Help.SANDBOX.restore()

  context "Given PluginFixture has been deployed", ->

    describe "When Reset is invoked", ->
      specify "Then Trace is invoked with the message 'RESET'", ->
        engine = Help.newPluginFixtureDeployment()
        expect(engine.Trace).not.called
        engine.Reset()
        expect(engine.Trace).calledWith("RESET")

    describe "When ProcessMIDI is invoked", ->
      describe "And NeedsTimingInfo is true", ->
        specify "Then GetTimingInfo is called", ->
          engine = Help.newPluginFixtureDeployment()
          expect(engine.NeedsTimingInfo).eql(true)
          engine.ProcessMIDI()
          expect(engine.GetTimingInfo).calledOnce
          engine.ProcessMIDI()
          expect(engine.GetTimingInfo).calledTwice
          engine.ProcessMIDI()
          expect(engine.GetTimingInfo).calledThrice
          return

    describe "When Idle is invoked", ->
      describe "And ResetParameterDefaults is false", ->

        stub = null

        before ->
          stub = Help.SANDBOX.stub(PluginFixture::, "needsResets").get( -> no )

        after ->
          stub.restore()

        specify "Then UpdatePluginParameters is invoked", ->
          engine = Help.newPluginFixtureDeployment()
          expect(engine.ResetParameterDefaults).eql(no)
          engine.Idle()
          expect(engine.UpdatePluginParameters).calledOnce
          return

      describe "And ResetParameterDefaults is true", ->

        specify "Then UpdatePluginParameters is not invoked", ->
          engine = Help.newPluginFixtureDeployment()
          expect(engine.ResetParameterDefaults).eql(true)
          engine.Idle()
          expect(engine.UpdatePluginParameters).not.called
          return

    describe "When the parameter view has changed", ->
      describe "And 'Minimum Velocity' is set > 'Maximum Velocity'", ->
        specify "Then 'Minimum Velocity' is automatically set to 'Maximum Velocity' - 1", ->
          engine = Help.newPluginFixtureDeployment()
          engine.SetParameter("Maximum Velocity", 50)
          engine.SetParameter("Minimum Velocity", 51)
          expect(engine.GetParameter("Minimum Velocity")).eql(49)
          return

      describe "And 'Maximum Velocity' is set > 'Minimum Velocity'", ->
        specify "Then 'Maximum Velocity' is automatically set to 'Minimum Velocity' + 1", ->
          engine = Help.newPluginFixtureDeployment()
          engine.SetParameter("Minimum Velocity", 50)
          engine.SetParameter("Maximum Velocity", 49)
          expect(engine.GetParameter("Maximum Velocity")).eql(51)
          return

    describe "And HandleMIDI is invoked", ->

      describe "When midi.velocity > 'Maximum Velocity'", ->
        specify "Then midi.velocity is reduced to match", ->
          engine = Help.newPluginFixtureDeployment()

          midi = velocity : 127

          engine.SetParameter("Maximum Velocity", 127)
          engine.HandleMIDI(midi)
          expect(midi).property("velocity", 127)

          engine.SetParameter("Maximum Velocity", 64)
          engine.HandleMIDI(midi)
          expect(midi).property("velocity", 64)

          engine.SetParameter("Maximum Velocity", 32)
          engine.HandleMIDI(midi)
          expect(midi).property("velocity", 32)

          return

      describe "When midi.velocity < 'Minimum Velocity'", ->
        specify "Then midi.velocity is increased to match", ->
          engine = Help.newPluginFixtureDeployment()

          midi = velocity : 0

          engine.SetParameter("Minimum Velocity", 32)
          engine.HandleMIDI(midi)
          expect(midi).property("velocity", 32)

          engine.SetParameter("Minimum Velocity", 64)
          engine.HandleMIDI(midi)
          expect(midi).property("velocity", 64)

          engine.SetParameter("Minimum Velocity", 127)
          engine.HandleMIDI(midi)
          expect(midi).property("velocity", 127)

          return

      describe "When 'Processing' has been set to ON", ->
        specify "Then the midi event is sent via SendMIDIEventNow", ->
          engine = Help.newPluginFixtureDeployment()
          midi = Help.newMIDIEvent()

          engine.SetParameter("Processing", 1)
          engine.HandleMIDI(midi)
          expect(engine.SendMIDIEventNow).calledWith(midi)
          return

      describe "When 'Processing' has been set to OFF", ->
        specify "Then the midi event is not sent", ->
          engine = Help.newPluginFixtureDeployment()
          midi = Help.newMIDIEvent()

          engine.SetParameter("Processing", 0)
          engine.HandleMIDI(midi)
          expect(engine.SendMIDIEventNow).not.called
          return

      describe "When 'Log MIDI' parameter has been set to ON", ->
        specify "Then the midi event is traced to console", ->
          engine = Help.newPluginFixtureDeployment()
          midi = Help.newMIDIEvent()

          # set log midi to ON
          engine.SetParameter("Log MIDI", 1)
          engine.HandleMIDI(midi)
          expect(engine.Trace).calledWith(midi)
          return

      describe "When 'Log MIDI' parameter has been set to OFF", ->
        specify "Then the midi event is NOT traced to console", ->
          engine = Help.newPluginFixtureDeployment()
          midi = Help.newMIDIEvent()

          # set log midi to OFF
          engine.SetParameter("Log MIDI", 0)
          engine.HandleMIDI(midi)
          expect(engine.Trace).not.called
          return
