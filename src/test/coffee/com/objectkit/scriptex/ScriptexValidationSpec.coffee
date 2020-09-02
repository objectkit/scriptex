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
      system = new ScripterFixture()

      # assert deployment OK
      expect(PluginFixture.deploy(system)).members(@EXPECTED_KEYS)

      # configure the params with an UpdatePluginParameters emulation
      for parameter in system.PluginParameters
        key = parameter.name
        val = parameter.defaultValue or 0
        system.SetParameter(key, val)

      # refactor to make possible:
      # system.UpdatePluginParameters()

      # plugin is not visible, but behaviour should be detectable
      return system


  beforeEach ->
    Help.SANDBOX.spy(ScripterFixture::)
    Help.SANDBOX.spy(PluginFixture::)
    # spy on the property needsTiming

  afterEach ->
    Help.SANDBOX.restore()

  context "Given PluginFixture has been deployed", ->

    describe "When Reset is invoked", ->
      specify "Then Trace is invoked with the message 'RESET'", ->
        system = Help.newPluginFixtureDeployment()
        expect(system.Trace).not.called
        system.Reset()
        expect(system.Trace).calledWith("RESET")

    describe "When ProcessMIDI is invoked", ->
      describe "And NeedsTimingInfo is true", ->
        specify "Then GetTimingInfo is called", ->
          system = Help.newPluginFixtureDeployment()
          expect(system.NeedsTimingInfo).eql(true)
          system.ProcessMIDI()
          expect(system.GetTimingInfo).calledOnce
          system.ProcessMIDI()
          expect(system.GetTimingInfo).calledTwice
          system.ProcessMIDI()
          expect(system.GetTimingInfo).calledThrice
          return

    describe "When Idle is invoked", ->
      describe "And ResetParameterDefaults is false", ->

        stub = null

        before ->
          stub = Help.SANDBOX.stub(PluginFixture::, "needsDefaults").get( -> no )

        after ->
          stub.restore()

        specify "Then UpdatePluginParameters is invoked", ->
          system = Help.newPluginFixtureDeployment()
          expect(system.ResetParameterDefaults).eql(no)
          system.Idle()
          expect(system.UpdatePluginParameters).calledOnce
          return

      describe "And ResetParameterDefaults is true", ->

        specify "Then UpdatePluginParameters is not invoked", ->
          system = Help.newPluginFixtureDeployment()
          expect(system.ResetParameterDefaults).eql(true)
          system.Idle()
          expect(system.UpdatePluginParameters).not.called
          return

    describe "When the parameter view has changed", ->
      describe "And 'Minimum Velocity' is set > 'Maximum Velocity'", ->
        specify "Then 'Minimum Velocity' is automatically set to 'Maximum Velocity' - 1", ->
          system = Help.newPluginFixtureDeployment()
          system.SetParameter("Maximum Velocity", 50)
          system.SetParameter("Minimum Velocity", 51)
          expect(system.GetParameter("Minimum Velocity")).eql(49)
          return

      describe "And 'Maximum Velocity' is set > 'Minimum Velocity'", ->
        specify "Then 'Maximum Velocity' is automatically set to 'Minimum Velocity' + 1", ->
          system = Help.newPluginFixtureDeployment()
          system.SetParameter("Minimum Velocity", 50)
          system.SetParameter("Maximum Velocity", 49)
          expect(system.GetParameter("Maximum Velocity")).eql(51)
          return

    describe "And HandleMIDI is invoked", ->

      describe "When midi.velocity > 'Maximum Velocity'", ->
        specify "Then midi.velocity is reduced to match", ->
          system = Help.newPluginFixtureDeployment()

          midi = velocity : 127

          system.SetParameter("Maximum Velocity", 127)
          system.HandleMIDI(midi)
          expect(midi).property("velocity", 127)

          system.SetParameter("Maximum Velocity", 64)
          system.HandleMIDI(midi)
          expect(midi).property("velocity", 64)

          system.SetParameter("Maximum Velocity", 32)
          system.HandleMIDI(midi)
          expect(midi).property("velocity", 32)

          return

      describe "When midi.velocity < 'Minimum Velocity'", ->
        specify "Then midi.velocity is increased to match", ->
          system = Help.newPluginFixtureDeployment()

          midi = velocity : 0

          system.SetParameter("Minimum Velocity", 32)
          system.HandleMIDI(midi)
          expect(midi).property("velocity", 32)

          system.SetParameter("Minimum Velocity", 64)
          system.HandleMIDI(midi)
          expect(midi).property("velocity", 64)

          system.SetParameter("Minimum Velocity", 127)
          system.HandleMIDI(midi)
          expect(midi).property("velocity", 127)

          return

      describe "When 'Processing' has been set to ON", ->
        specify "Then the midi event is sent via SendMIDIEventNow", ->
          system = Help.newPluginFixtureDeployment()
          midi = Help.newMIDIEvent()

          system.SetParameter("Processing", 1)
          system.HandleMIDI(midi)
          expect(system.SendMIDIEventNow).calledWith(midi)
          return

      describe "When 'Processing' has been set to OFF", ->
        specify "Then the midi event is not sent", ->
          system = Help.newPluginFixtureDeployment()
          midi = Help.newMIDIEvent()

          system.SetParameter("Processing", 0)
          system.HandleMIDI(midi)
          expect(system.SendMIDIEventNow).not.called
          return

      describe "When 'Log MIDI' parameter has been set to ON", ->
        specify "Then the midi event is traced to console", ->
          system = Help.newPluginFixtureDeployment()
          midi = Help.newMIDIEvent()

          # set log midi to ON
          system.SetParameter("Log MIDI", 1)
          system.HandleMIDI(midi)
          expect(system.Trace).calledWith(midi)
          return

      describe "When 'Log MIDI' parameter has been set to OFF", ->
        specify "Then the midi event is NOT traced to console", ->
          system = Help.newPluginFixtureDeployment()
          midi = Help.newMIDIEvent()

          # set log midi to OFF
          system.SetParameter("Log MIDI", 0)
          system.HandleMIDI(midi)
          expect(system.Trace).not.called
          return
