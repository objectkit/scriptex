{
  DefaultPlugin
  Event
  TargetEvent
  ChannelPressure
  PolyPressure
  ControlChange
  ProgramChange
  NoteOn
  NoteOff
  PitchBend
} = require(SCRIPTEX_TEST)

describe "DefaultPlugin", ->

  Help =

    SANDBOX: null

    setupSpec: ->
      @SANDBOX = sinon.createSandbox()
      @SANDBOX.spy(DefaultPlugin::)
      @SANDBOX.spy(Event::)

    teardownSpec: ->
      @SANDBOX.verifyAndRestore()
      @SANDBOX = null

    validateCallOrder: (event, calls) ->
      fixture = new DefaultPlugin()
      fixture.onMidi(event)
      for call in calls
        expect(fixture).property(call).calledOnce
      return

    validateGetEventName: (event, expectedName) ->
      fixture = new DefaultPlugin()
      eventName = fixture.getEventName(event)
      expect(expectedName).eql(eventName)
      return

    validateParamIDAssignment: () ->
      fixture = new DefaultPlugin()

    newMockParamsWithIDs: (count=3) ->
      mockParams = []
      while count--
        mockParam =
          ID: uuid()
          name: uuid()
          type: "momentary"

        mockParams.push(mockParam)
      return mockParams

  beforeEach ->
    Help.setupSpec()

  afterEach ->
    Help.teardownSpec()

  context "onMidi(event:Event):number", ->

    describe "Given event:Event", ->
      specify "Then onEvent is invoked", ->
      describe "When onEvent is invoked", ->
        specify "Then sendMidi is invoked", ->
          Help.validateCallOrder(new Event, ["onEvent", "sendMidi"])

    describe "Given event:TargetEvent", ->
      specify "Then onTargetEvent is invoked", ->
      describe "When onTargetEvent is invoked", ->
        specify "Then sendMidi is invoked", ->
          Help.validateCallOrder(new TargetEvent, ["onTargetEvent", "sendMidi"])

    describe "Given event:NoteOn", ->
      specify "Then onNoteOn is invoked", ->
      describe "When onNoteOn is invoked", ->
        specify "Then onNote is invoked", ->
        describe "When onNote is invoked", ->
          specify "Then sendMidi is invoked", ->
            Help.validateCallOrder(new NoteOn, ["onNoteOn", "onNote", "sendMidi"])

    describe "Given event:NoteOff", ->
      specify "Then onNoteOff is invoked", ->
      describe "When onNoteOff is invoked", ->
        specify "Then onNote is invoked", ->
        describe "When onNote is invoked", ->
          specify "Then sendMidi is invoked", ->
            Help.validateCallOrder(new NoteOff, ["onNoteOff", "onNote", "sendMidi"])

    describe "Given event:ControlChange", ->
      specify "Then onControlChange is invoked", ->
      describe "When onControlChange is invoked", ->
        specify "Then sendMidi is invoked", ->
          Help.validateCallOrder(new ControlChange, ["onControlChange", "sendMidi"])

    describe "Given event:ProgramChange", ->
      specify "Then onProgramChange is invoked", ->
      describe "When onProgramChange is invoked", ->
        specify "Then sendMidi is invoked", ->
          Help.validateCallOrder(new ProgramChange, ["onProgramChange", "sendMidi"])

    describe "Given event:ChannelPressure", ->
      specify "Then onChannelPressure is invoked", ->
      describe "When onChannelPressure is invoked", ->
        specify "Then sendMidi is invoked", ->
          Help.validateCallOrder(new ChannelPressure, ["onChannelPressure", "sendMidi"])

    describe "Given event:PolyPressure", ->
      specify "Then onPolyPressure is invoked", ->
      describe "When onPolyPressure is invoked", ->
        specify "Then sendMidi is invoked", ->
          Help.validateCallOrder(new PolyPressure, ["onPolyPressure", "sendMidi"])

    describe "Given event:PitchBend", ->
      specify "Then onPitchBend is invoked", ->
      describe "When onPitchBend is invoked", ->
        specify "Then sendMidi is invoked", ->
          Help.validateCallOrder(new PitchBend, ["onPitchBend", "sendMidi"])

  context "onParam(index:number, value:number):void", ->

    describe "Given param at index has an ID", ->
      specify "Then plugin[ID] is assigned that value", ->

        fixture = new DefaultPlugin
        fixture.params = Help.newMockParamsWithIDs()

        for param, index in fixture.params
          mockData = uuid()
          expect(fixture).not.property(param.ID)
          fixture.onParam(index, mockData)
          expect(fixture).property(param.ID, mockData)

        return

    describe "Given param at index has no ID", ->
      MOCK_PARAMS = [
        { ID: null, name: uuid(), type: "momentary" }
        { ID: undefined, name: uuid(), type: "momentary" }
        { ID: "", name: uuid(), type: "momentary" }
        { ID: 0, name: uuid(), type: "momentary" }
        { name: uuid(), type: "momentary" }
      ]

      specify "Then no assignment occurs", ->
        fixture = new DefaultPlugin()
        fixture.params = MOCK_PARAMS

        beforeKeys = Object.keys(fixture)
        for param, index in MOCK_PARAMS
          fixture.onParam(index, Date.now())

        afterKeys = Object.keys(fixture)
        expect(afterKeys).eql(beforeKeys)

        return

  context "sendMidi(event:Event):number", ->

    describe "Given event.beatPos is empty", ->
      specify "Then event.send() is invoked", ->
        empties = [ null, undefined, 0, '' ]
        fixture = new DefaultPlugin()

        event = new Event()
        expect(event).not.property("beatPos")
        expect(event.send).not.called

        beatPos = fixture.sendMidi(event)

        expect(beatPos).eql(0)
        expect(event.send).calledOnce
        expect(event.sendAtBeat).not.called
        expect(event.sendAfterBeats).not.called
        expect(event.sendAfterMilliseconds).not.called
        return

    describe "Given event.beatPos is a negative number", ->
      specify "Then beatPos is cast to positive number", ->
      specify "Then event.sendAfterBeats is invoked", ->

        event = new Event()
        event.beatPos = -1

        fixture = new DefaultPlugin()
        beatPos = fixture.sendMidi(event)

        expect(beatPos).eql(1)
        expect(event.sendAfterBeats).calledOnce
        expect(event.sendAfterBeats).calledWith(beatPos)
        expect(event.sendAfterMilliseconds).not.called
        expect(event.sendAtBeat).not.called
        expect(event.send).not.called

        return

    describe "Given event.beatPos is a positive number", ->
      specify "Then event.sendAtBeat is invoked", ->
        mockBeatPos = 1

        event = new Event
        event.beatPos = mockBeatPos

        fixture = new DefaultPlugin
        beatPos = fixture.sendMidi(event)

        expect(beatPos).eql(1)
        expect(event.sendAtBeat).calledOnce
        expect(event.sendAtBeat).calledWith(beatPos)
        expect(event.send).not.called
        expect(event.sendAfterMilliseconds).not.called
        expect(event.sendAfterBeats).not.called

        return

    describe "Given event.beatPos is a string or non-number", ->
      specify "Then beatPos is cast to positive number", ->
      specify "Then event.sendAfterMilliseconds(beatPos) is invoked", ->

        event = new Event()
        event.beatPos = "-1000"
        expect(event.beatPos).to.be.a("string")
        fixture = new DefaultPlugin
        beatPos = fixture.sendMidi(event)
        expect(beatPos).to.be.a("number")
        expect(beatPos).eql(1000)
        expect(event.sendAfterMilliseconds).calledOnce
        expect(event.sendAfterMilliseconds).calledWith(1000)
        expect(event.sendAfterBeats).not.called
        expect(event.sendAtBeat).not.called
        expect(event.send).not.called

        return

    describe "Given beatPos is a string or a number", ->
      specify "Then discernment OK between sendAfterBeats and sendAfterMilliseconds", ->
        numVal = -200
        strVal = "#{numVal}"
        expVal = 200

        plugin = new DefaultPlugin
        event = new Event()

        event.beatPos = numVal
        beatPos = plugin.sendMidi(event)
        expect(beatPos).eql(expVal)
        expect(event.sendAfterBeats).calledOnce
        expect(event.sendAfterMilliseconds).not.called

        Event::sendAfterBeats.resetHistory()
        Event::sendAfterMilliseconds.resetHistory()

        event.beatPos = strVal
        beatPos = plugin.sendMidi(event)
        expect(beatPos).eql(expVal)
        expect(event.sendAfterBeats).not.called
        expect(event.sendAfterMilliseconds).calledOnce

        return

      return

    return

  context "getEventName(event:Event):string", ->

    describe "Given object without status code", ->
      specify "Then \"EventNameNotFound\" is thrown", ->
        expect( -> new DefaultPlugin().getEventName(new Object)).throws("EventNameNotFound")

    describe "Given object with unsupported status code", ->
      specify "The \"EventNameNotFound\" is thrown", ->
        badEvent = { status: Number.MAX_INTEGER }
        expect( -> new DefaultPlugin().getEventName(badEvent)).throws("EventNameNotFound")

    describe "Given non-object", ->
      specify "Then \"TypeError\" is thrown", ->
        expect(-> new DefaultPlugin().getEventName(null)).throws(TypeError)

    describe "Given event:Event", ->
      specify "Then \"Event\" is returned", ->
        Help.validateGetEventName(new Event(), "Event")

    describe "Given event:TargetEvent", ->
      specify "Then \"TargetEvent\" is returned", ->
        Help.validateGetEventName(new TargetEvent(), "TargetEvent")

    describe "Given event:NoteOn", ->
      specify "Then \"NoteOn\" is returned", ->
        Help.validateGetEventName(new NoteOn(), "NoteOn")

    describe "Given event:NoteOff", ->
      specify "Then \"NoteOff\" is returned", ->
        Help.validateGetEventName(new NoteOff(), "NoteOff")

    describe "Given event:ChannelPressure", ->
      specify "Then \"ChannelPressure\" is returned", ->
        Help.validateGetEventName(new ChannelPressure(), "ChannelPressure")

    describe "Given event:PolyPressure", ->
      specify "Then \"PolyPressure\" is returned", ->
        Help.validateGetEventName(new PolyPressure(), "PolyPressure")

    describe "Given event:ControlChange", ->
      specify "Then \"ControlChange\" is returned", ->
        Help.validateGetEventName(new ControlChange(), "ControlChange")

    describe "Given event:ProgramChange", ->
      specify "Then \"ProgramChange\" is returned", ->
        Help.validateGetEventName(new ProgramChange(), "ProgramChange")

    describe "Given event:PitchBend", ->
      specify "Then \"PitchBend\" is returned", ->
        Help.validateGetEventName(new PitchBend(), "PitchBend")
