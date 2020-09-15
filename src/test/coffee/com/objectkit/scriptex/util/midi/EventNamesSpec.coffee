{
  EventNames
} = require(SCRIPTEX_TEST)

describe "EventNames", ->

  Help =

    ###
    For reference, the reference map used in this test was produced by
    running the following code in the Scripter runtime:

      ```js
      const { get, construct } = Reflect
      const Scripter = (this)
      const eventKeys = [
        "Event"
      , "TargetEvent"
      , "Note"
      , "NoteOff"
      , "NoteOn"
      , "PolyPressure"
      , "ControlChange"
      , "ProgramChange"
      , "ChannelPressure"
      , "PitchBend"
      ]

      Trace("[")
      for (let eventKey of eventKeys) {
        let ctor = get(Scripter, eventKey)
        let event = construct(ctor, [])
        Trace(`, [ ${event.status}, "${eventKey}" ]`)
      }
      Trace("]")
      ```js

    Which traced the following to the Code Editor console:

      Evaluating MIDI-processing script...
      Script evaluated successfully!
      [
      , [ 0, "Event" ]
      , [ 80, "TargetEvent" ]
      , [ 144, "Note" ]
      , [ 128, "NoteOff" ]
      , [ 144, "NoteOn" ]
      , [ 160, "PolyPressure" ]
      , [ 176, "ControlChange" ]
      , [ 192, "ProgramChange" ]
      , [ 208, "ChannelPressure" ]
      , [ 224, "PitchBend" ]
      ]

    Correspondingly, the following integration test was run in Scripter to confirm
    the viablity of the approach that the EventNames collection takes

    ###
    EVENT_STATUS_EVENT_NAME_MAP: [
      [   0, "Event" ]
    , [  80, "TargetEvent" ]
    , [ 144, "Note" ]
    , [ 128, "NoteOff" ]
    , [ 144, "NoteOn" ]
    , [ 160, "PolyPressure" ]
    , [ 176, "ControlChange" ]
    , [ 192, "ProgramChange" ]
    , [ 208, "ChannelPressure" ]
    , [ 224, "PitchBend" ]
    ]

  # negative case
  describe "When status code is unsupported", ->
    specify "Then EventNameNotFound is thrown", ->
      map = new EventNames()
      key = uuid()
      expect(map.has(key)).to.be.false
      expect(->map.get(key)).throws("EventNameNotFound")


  # dynamic generation of remaining tests
  new Map(Help.EVENT_STATUS_EVENT_NAME_MAP).forEach (eventKey, statusCode) ->

    describe "When status code is #{statusCode}", ->

      fixture = new EventNames()

      specify "Then event name is #{eventKey}", ->
        expect(fixture.has(statusCode)).true
        expect(fixture.get(statusCode)).eql(eventKey)
        return

      return
