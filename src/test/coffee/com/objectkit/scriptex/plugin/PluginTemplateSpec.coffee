{
  Plugin
  PluginTemplate
  ScripterFixture
  Scriptex
} = require(SCRIPTEX_TEST)

describe.only "PluginTemplate", ->

  Help =
    sandbox: sinon.createSandbox()

    setupEnv: ->
      # @sandbox.stub(Scriptex, "ENGINE").get( -> new ScripterFixture)
      @sandbox.spy(Scriptex::, "deploy")
      @sandbox.spy(PluginTemplate::)
      @sandbox.spy(ScripterFixture::)

    teardownEnv: ->
      @sandbox.verifyAndRestore()

    newMIDIEvent: (beatPos)->
      send: sinon.stub()
      sendAtBeat: sinon.stub()
      sendAfterBeats: sinon.stub()
      sendAfterMilliseconds: sinon.stub()
      beatPos: beatPos


    deployPlugin: (pluginClass, autoUpdate=true)->

      # trigger an internal deployment
      pluginClass.deploy(new ScripterFixture())

      # retrieve call metadata concerning the deployment
      {
        returnValue:api
      , lastArg:plugin
      } = Scriptex::deploy.lastCall

      engine = plugin.engine

      # balance the test
      expect(api).instanceof(Array)
      expect(plugin).instanceof(Plugin)
      expect(engine).instanceof(ScripterFixture)

      # emulated system call at time of script evaluation, thus deployment
      engine.UpdatePluginParameters()

      # return metadata as an object
      return { api, plugin, engine }


  beforeEach ->
    Help.setupEnv()

  afterEach ->
    Help.teardownEnv()


  context "#engine", ->

    context "When #engine is not set", ->
      specify "Then accessing #engine throws \"EngineMissing\" ", ->
        plugin = new PluginTemplate()
        expect(-> plugin.engine).to.throw("EngineMissing")
        return

    context "When #engine is set", ->
      mockEngine = Object.create(null)
      expectedDescriptor =
        value: mockEngine
        writable: false
        enumerable: false
        configurable: false

      specify "Then #engine is redefined as a data property ", ->
        plugin = new PluginTemplate()
        expect(plugin.onInit).not.called
        expect(plugin).not.to.have.ownPropertyDescriptor("engine", expectedDescriptor)
        plugin.engine = mockEngine
        expect(plugin.onInit).calledOnce
        expect(plugin).to.have.ownPropertyDescriptor("engine", expectedDescriptor)
        return

      specify "And #onInit is self-invoked", ->
        plugin = new PluginTemplate()
        expect(plugin.onInit).not.called
        plugin.engine = mockEngine
        expect(plugin.onInit).calledOnce
        return

      return

  context "#midi", ->

    context "When #engine is not set", ->
      specify "Then accessing #midi throws \"EngineMissing\"", ->
        plugin = new PluginTemplate()
        expect( -> plugin.midi).to.throw("EngineMissing")
        return

    context "When #engine is set", ->
      specify "Then #midi accesses Scripter.MIDI", ->
        scripter = new ScripterFixture()
        plugin = new PluginTemplate()
        plugin.engine = scripter
        expect(plugin.midi).eql(scripter.MIDI)
        return

      return

    return

  context "onParam(key, val)", ->
    context "Given key is a valid parameter index,", ->
      context "And the parameter at index has an \"ID\" property,", ->
        specify "Then ID is treated as a plugin property name and val is assignment to it.", ->
          plugin = new PluginTemplate()
          # mock the parameters
          plugin.params = [
            { ID: "mockIdA", name: "A", defaultValue: 0 }
            { ID: "mockIdB", name: "B", defaultValue: 1 }
            { ID: "mockIdC", name: "C", defaultValue: 2 }
          ]
          for param, index in plugin.params
            { ID, defaultValue } = param
            expect(plugin).not.property(ID)
            plugin.onParam(index, defaultValue)
            expect(plugin).property(ID)

          return
        context "When the parameter at index has no ID property", ->
        context "When val equals an existing assignment", ->


  context "sendMIDI(midi):number", ->
    describe "Given midi.beatPos is a string", ->
      specify "Then Scripter.SendMIDIEventAfterMilliseconds is invoked", ->
        timing = 500
        midiEvent = Help.newMIDIEvent("#{timing}")

        plugin = new PluginTemplate
        beatPos = plugin.sendMidi(midiEvent)
        expect(midiEvent.sendAfterMilliseconds).calledOnce
        expect(timing).eql(beatPos)
        return

    describe "Given midi.beatPos is a number > 0", ->
      specify "Then Scripter.SendMIDIEventAtBeat is invoked", ->
        timing = 500
        midiEvent = Help.newMIDIEvent(timing)
        plugin = new PluginTemplate
        beatPos = plugin.sendMidi(midiEvent)
        expect(midiEvent.sendAtBeat).calledOnce
        expect(timing).eql(beatPos)
        return

    describe "Given midi.beatPos is a number < 0", ->
      specify "Then Scripter.SendMIDIEventAfterBeats is invoked", ->
        timing = -500
        midiEvent = Help.newMIDIEvent(timing)
        plugin = new PluginTemplate
        beatPos = plugin.sendMidi(midiEvent)
        expect(midiEvent.sendAfterBeats).calledOnce
        expect(timing * -1).eql(beatPos)
        return

    describe "Given midi.beatPos is neither string nor number", ->
      specify "Then Scripter.SendMIDIEventNow is invoked", ->
        midiEvent = Help.newMIDIEvent(undefined)
        expect(midiEvent.beatPos).is.undefined
        plugin = new PluginTemplate
        beatPos = plugin.sendMidi(midiEvent)
        expect(midiEvent.send).calledOnce
        expect(0).eql(beatPos)
        return

  context "onMidi(event):number", ->
    class Event
      send: ->
      sendAtBeat: ->
      sendAfterBeats: ->
      sendAfterMilliseconds: ->

    class ChannelPressure extends Event
    class PolyPressure extends Event
    class ProgramChange extends Event
    class ControlChange extends Event
    class Pitchbend extends Event
    class NoteOn extends Event
    class NoteOff extends Event
    class Note extends Event
    class TargetEvent extends Event

    describe "When invoked", ->
      specify "Then sendMidi is invoked", ->
        plugin = new PluginTemplate()
        events = [
          new ChannelPressure
          new PolyPressure
          new ProgramChange
          new ControlChange
          new Pitchbend
          new Note
          new NoteOn
          new NoteOff
          new TargetEvent
        ]

        for event in events
          timing = plugin.onMidi(event)
          console.info("timing= " + timing)
          expect(0).eql(timing)

      specify "And beatPos is returned", ->

  ###

  onMidi
  onNoteOn
  onNoteOff
  onNote
  onControlChange
  onParameterChange
  onChannelPressure
  onPolyPressure
  onPitchbend
  onTargetEvent
  ###
