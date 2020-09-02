{
  Processor
  GenericProcessor
  ScripterFixture
  Scriptex
  Event
  TargetEvent
  Note
  NoteOff
  NoteOn
  PolyPressure
  ControlChange
  ProgramChange
  ChannelPressure
  PitchBend
} = require(SCRIPTEX_TEST)

### MIDI status to MIDI event class association

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


NOTE:
Note and NoteOn do indeed have the same status code in the Scripter implementation
###

describe "GenericProcessor", ->

  Help =
    sandbox: sinon.createSandbox()

    setupEnv: ->
      # @sandbox.stub(Scriptex, "SYSTEM").get( -> new ScripterFixture)
      @sandbox.spy(Scriptex::, "deploy")
      @sandbox.spy(GenericProcessor::)
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
      @deployPlugin(GenericProcessor)

    deployPlugin: (pluginClass, autoUpdate=true)->
      # trigger an internal deployment
      pluginClass.deploy(new ScripterFixture())

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
    Help.setupEnv()

  afterEach ->
    Help.teardownEnv()

  context "#system", ->

    context "When #system is not set", ->
      specify "Then accessing #system throws \"EngineAccessFault\" ", ->
        plugin = new GenericProcessor()
        expect(-> plugin.system).to.throw("EngineAccessFault")
        return

      return

    context "When #system is set", ->
      mockEngine = Object.create(null)
      expectedDescriptor =
        value: mockEngine
        writable: false
        enumerable: true
        configurable: false

      specify "Then #system is redefined as a data property ", ->
        plugin = new GenericProcessor()
        expect(plugin.initProcessor).not.called
        expect(plugin).not.to.have.ownPropertyDescriptor("system", expectedDescriptor)
        plugin.system = mockEngine
        expect(plugin.initProcessor).calledOnce
        expect(plugin).to.have.ownPropertyDescriptor("system", expectedDescriptor)

        return

      specify "And #initProcessor is self-invoked", ->
        plugin = new GenericProcessor()
        expect(plugin.initProcessor).not.called
        plugin.system = mockEngine
        expect(plugin.initProcessor).calledOnce

        return

      return

  context "#midi", ->

    context "When #system is not set", ->
      specify "Then accessing #midi throws \"EngineAccessFault\"", ->
        plugin = new GenericProcessor()
        expect( -> plugin.midi).to.throw("EngineAccessFault")
        return

      return

    context "When #system is set", ->
      specify "Then #midi accesses Scripter.MIDI", ->
        scripter = new ScripterFixture()
        plugin = new GenericProcessor()
        plugin.system = scripter
        expect(plugin.midi).eql(scripter.MIDI)
        return

      return

    return

  context "onParam(key, val)", ->
    context "Given key is a valid parameter index,", ->
      context "And the parameter at index has an \"ID\" property,", ->
        specify "Then ID is treated as a plugin property name and val is assignment to it.", ->
          plugin = new GenericProcessor()
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
        returned = new GenericProcessor().sendMidi(midiEvent)
        expect(Number.isInteger(returned)).to.be.true
        expect(midiEvent.sendAfterMilliseconds).calledOnce
        expect(midiEvent.sendAfterMilliseconds).calledWith(beatPosNumber)
        expect(beatPosNumber).eql(returned)
        return

      return

    describe "Given midi.beatPos is a negative number", ->
      specify "Then Scripter.SendMIDIEventAfterBeats is invoked", ->
        timing = -500
        midiEvent = Help.newMidiEvent(beatPos:timing)
        plugin = new GenericProcessor
        beatPos = plugin.sendMidi(midiEvent)
        expect(midiEvent.sendAfterBeats).calledOnce
        expect(timing * -1).eql(beatPos)
        return

      return

    describe "Given midi.beatPos is empty", ->
      specify "Then Scripter.SendMIDIEventNow is invoked", ->
        midiEvent = Help.newMidiEvent()
        expect(midiEvent.beatPos).to.be.undefined
        returned = new GenericProcessor().sendMidi(midiEvent)
        expect(midiEvent.send).calledOnce
        expect(returned).equal(0)
        return

      return

    describe "Given midi.beatPos is a positive number", ->
      specify "Then Scripter.SendMIDIEventAtBeat is invoked", ->

        doSendMidi = (midi) ->
          new GenericProcessor().sendMidi(midi)

        returned1 = null
        returned2 = null
        beatPosNumber = 500
        midiEvent = Help.newMidiEvent(beatPos:beatPosNumber)

        expect(midiEvent).property("beatPos", beatPosNumber)

        returned1 = doSendMidi(midiEvent)

        expect(returned1).eql(beatPosNumber)
        expect(midiEvent.sendAtBeat).calledOnce

        return

      return

    return

  context "#onMidi(event):number", ->
    describe "Given any midi event", ->
      specify "Then #sendMidi is invoked", ->
        plugin = new GenericProcessor()
        events = [
          new ChannelPressure
          new PolyPressure
          new ProgramChange
          new ControlChange
          new PitchBend
          # new Note # ommitted due to duplicate status code replicated by NoteOn
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

        return

      return

    return

  context "GenericProcessor.deploy():Array<string>",->
    describe "When GenericProcessor is deployed", ->
      specify "Then Scripter.ParameterChanged delegates to GenericProcessor#onParam", ->
        key = 0
        val = 1
        { plugin, system, api } = Help.deployPluginTemplate()
        plugin.params = [
          ID: "a", name: "A", type: "checkbox", checked: 0
        ]
        expect(api).includes("ParameterChanged")
        expect(plugin.onParam).not.called

        system.ParameterChanged(key, val)
        expect(plugin.onParam).calledWith(key, val)
        expect(plugin).property("a", val)

        system.ParameterChanged(key, val + 1)
        expect(plugin.onParam).calledWith(key, val + 1)
        expect(plugin).property("a", val + 1)

        return

      specify "Then Scripter.HandleMIDI delegates to GenericProcessor#onMidi", ->
        midi1 = new NoteOn()
        midi2 = new NoteOff()
        midi3 = new ControlChange()
        { plugin, system, api } = Help.deployPluginTemplate()
        plugin.params = [
          { ID: "b", name: "B", type: "lin", defaultValue: 63, minValue: 1, maxValue: 127}
        ]
        expect(system).property("HandleMIDI").instanceOf(Function)
        system.HandleMIDI(midi1)
        expect(plugin.onMidi).calledOnce
        expect(plugin.onMidi).calledWith(midi1)
        system.HandleMIDI(midi2)
        expect(plugin.onMidi).calledTwice
        expect(plugin.onMidi).calledWith(midi2)
        system.HandleMIDI(midi3)
        expect(plugin.onMidi).calledThrice
        expect(plugin.onMidi).calledWith(midi3)

        return

      return

    return
