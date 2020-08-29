{
  Plugin
  PluginTemplate
  ScripterFixture
  Scriptex
} = require(SCRIPTEX_TEST)

describe "PluginTemplate", ->

  # TODO add as classes
  class Event
    send: ->
    sendAtBeat: ->
    sendAfterBeats: ->
    sendAfterMilliseconds: ->

  ###

    0     Event
    80    TargetEvent
    144   Note
    128   NoteOff
    144   NoteOn
    160   PolyPressure
    176   ControlChange
    192   ProgramChange
    208   ChannelPressure
    224   PitchBend
  ###

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

  class ChannelPressure extends Event
  class PolyPressure extends Event
  class ProgramChange extends Event
  class ControlChange extends Event
  class Pitchbend extends Event
  class NoteOn extends Event
  class NoteOff extends Event
  class Note extends Event
  class TargetEvent extends Event

  Help =
    sandbox: sinon.createSandbox()

    setupEnv: ->
      # @sandbox.stub(Scriptex, "ENGINE").get( -> new ScripterFixture)
      @sandbox.spy(Scriptex::, "deploy")
      @sandbox.spy(PluginTemplate::)
      @sandbox.spy(ScripterFixture::)

    teardownEnv: ->
      @sandbox.verifyAndRestore()

    newMidiEvent: (properties={}) ->
      midiEvent =
        send: sinon.stub()
        sendAtBeat: sinon.stub()
        sendAfterBeats: sinon.stub()
        sendAfterMilliseconds: sinon.stub()

      Object.assign(midiEvent, properties)
      return midiEvent

    deployPluginTemplate: ->
      @deployPlugin(PluginTemplate)

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
        beatPosNumber = 500
        beatPosString = "#{beatPosNumber}"
        midiEvent = Help.newMidiEvent( beatPos:beatPosString )
        returned = new PluginTemplate().sendMidi(midiEvent)
        expect(Number.isInteger(returned)).to.be.true
        expect(midiEvent.sendAfterMilliseconds).calledOnce
        expect(midiEvent.sendAfterMilliseconds).calledWith(beatPosNumber)
        expect(beatPosNumber).eql(returned)
        return


    describe "Given 0 > midi.beatPos", ->
      specify "Then Scripter.SendMIDIEventAfterBeats is invoked", ->
        timing = -500
        midiEvent = Help.newMidiEvent(beatPos:timing)
        plugin = new PluginTemplate
        beatPos = plugin.sendMidi(midiEvent)
        expect(midiEvent.sendAfterBeats).calledOnce
        expect(timing * -1).eql(beatPos)
        return

    describe "Given 0 <= midi.beatPos || !midi.beatPos", ->
      specify "Then Scripter.SendMIDIEventAtBeat is invoked", ->

        doSendMidi = (midi) ->
          new PluginTemplate().sendMidi(midi)

        returned1 = null
        returned2 = null
        beatPosNumber = 500
        midiEvent = Help.newMidiEvent(beatPos:beatPosNumber)

        expect(midiEvent).property("beatPos", beatPosNumber)

        returned1 = doSendMidi(midiEvent)

        expect(returned1).eql(beatPosNumber)
        expect(midiEvent.sendAtBeat).calledOnce

        midiEvent.beatPos = undefined

        returned2 = doSendMidi(midiEvent)

        expect(returned2).equal(0)
        expect(midiEvent.sendAtBeat).calledTwice

        return

    ###
    @deprecated
    The latest library version uses sendMIDIAtBeat as last alternative
    as beatPos equals 0 by default, even when NeedsTimingInfo is false

    ###
    # describe.skip "Given midi.beatPos is neither string nor number", ->
    #   specify "Then Scripter.SendMIDIEventNow is invoked", ->
    #     midiEvent = Help.newMidiEvent()
    #     expect(midiEvent.beatPos).is.undefined
    #     plugin = new PluginTemplate
    #     beatPos = plugin.sendMidi(midiEvent)
    #     expect(midiEvent.send).calledOnce
    #     expect(0).eql(beatPos)
    #     return

  context "#onMidi(event):number", ->
    describe "Given any midi event", ->
      specify "Then #sendMidi is invoked", ->
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
          handlerName = "on#{event.constructor.name}"
          expect(plugin).property(handlerName).not.called
          timing = plugin.onMidi(event)
          expect(0).eql(timing)
          expect(plugin).property(handlerName).calledOnce
          expect(plugin.sendMidi).called

  context "PluginTemplate.deploy():Array<string>",->
    describe "When PluginTemplate is deployed", ->
      specify "Then Scripter.ParameterChanged delegates to PluginTemplate#onParam", ->
        key = 0
        val = 1
        { plugin, engine, api } = Help.deployPluginTemplate()
        plugin.params = [
          ID: "a", name: "A", type: "checkbox", checked: 0
        ]
        expect(api).includes("ParameterChanged")
        expect(plugin.onParam).not.called

        engine.ParameterChanged(key, val)
        expect(plugin.onParam).calledWith(key, val)
        expect(plugin).property("a", val)

        engine.ParameterChanged(key, val + 1)
        expect(plugin.onParam).calledWith(key, val + 1)
        expect(plugin).property("a", val + 1)

        return

      specify "Then Scripter.HandleMIDI delegates to PluginTemplate#onMidi", ->
        midi1 = new NoteOn()
        midi2 = new NoteOff()
        midi3 = new ControlChange()
        { plugin, engine, api } = Help.deployPluginTemplate()
        plugin.params = [
          { ID: "b", name: "B", type: "lin", defaultValue: 63, minValue: 1, maxValue: 127}
        ]
        expect(engine).property("HandleMIDI").instanceOf(Function)
        engine.HandleMIDI(midi1)
        expect(plugin.onMidi).calledOnce
        expect(plugin.onMidi).calledWith(midi1)
        engine.HandleMIDI(midi2)
        expect(plugin.onMidi).calledTwice
        expect(plugin.onMidi).calledWith(midi2)
        engine.HandleMIDI(midi3)
        expect(plugin.onMidi).calledThrice
        expect(plugin.onMidi).calledWith(midi3)

        return

      return

    return
