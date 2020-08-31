{
  Event
} = require(SCRIPTEX_TEST)

describe "Event", ->

  context "new Event(otherEvent)", ->

    context "When one event is passed to the constructor of another", ->
      specify "Then the new event is clone of the other", ->
        event1 = new Event()
        expect(event1).not.property("MOCK_PROP")
        event1.MOCK_PROP = uuid()
        event2 = new Event(event1)
        expect(event2).property("MOCK_PROP", event1.MOCK_PROP)
        return

      return

    return

  return
