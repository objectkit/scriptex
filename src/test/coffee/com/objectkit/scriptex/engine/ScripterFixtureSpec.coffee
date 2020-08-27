{
  ScripterFixture
  TimingInfoFixture
  MIDIFixture
} = require(SCRIPTEX_TEST)

describe "ScripterFixture", ->

  describe "GetParameter", ->
    context "Given PluginParameters is not set", ->
      specify "Then GetParameter returns undefined", ->
        scripter = new ScripterFixture
        expect(scripter).not.to.have.property("PluginParameters")
        expect(scripter.GetParameter(0)).eql(undefined)

    context "Given PluginParameters is an array of parameter objects", ->
      context "When GetParameter is passed a legitimate parameter name", ->
        specify "Then the params view data is returned", ->
          scripter = new ScripterFixture()
          scripter.PluginParameters = [
            { name: "A" }
          ]
          scripter.SetParameter("A", 100)
          expect(scripter.GetParameter("A")).eql(100)
          return

      context "When GetParameter is passed a legitimate parameter index", ->
        specify "Then the params view data is returned", ->
          scripter = new ScripterFixture()
          scripter.PluginParameters = [
            { name: "B" }
          ]
          scripter.SetParameter(0, 100)
          expect(scripter.GetParameter(0)).eql(100)
          return

      context "When GetParameter is passed an unknown parameter name or index", ->
        specify "Then undefined returned", ->
          scripter = new ScripterFixture()
          scripter.PluginParameters = [
            { name: "C" }
          ]
          scripter.SetParameter(0, 0)
          expect(scripter.GetParameter(0)).eql(0)
          expect(scripter.GetParameter("C")).eql(0)
          scripter.PluginParameters.pop()
          expect(scripter.GetParameter(0)).eql(undefined)
          expect(scripter.GetParameter("C")).eql(undefined)
          return

  describe "SetParameter", ->
    context "Given PluginParameters is an array of parameter objects", ->
      context "When SetParameter is called with a legitimate parameter name or index and a value", ->
        specify "Then GetParameter will return the value", ->
          scripter = new ScripterFixture()
          scripter.PluginParameters = [
            { name: "D" }
          ]
          expect(scripter.GetParameter("D")).eql(undefined)
          scripter.SetParameter("D", 1)
          expect(scripter.GetParameter("D")).eql(1)
          return

  describe "GetTimingInfo", ->
    context "Given NeedsTimingInfo is true", ->
      context "When GetTimingInfo is invoked", ->
        specify "Then a TimingInfoFixture is returned", ->
          fixture = new ScripterFixture()
          fixture.NeedsTimingInfo = true
          expect(fixture.GetTimingInfo()).instanceof(TimingInfoFixture)
    context "Given NeedsTimingInfo is false", ->
      context "When GetTimingInfo is invoked", ->
        specify "Then undefined is returned", ->
          fixture = new ScripterFixture()
          expect(fixture.GetTimingInfo()).undefined
          # fixture.NeedsTimingInfo = false
          expect(fixture.GetTimingInfo()).undefined

  describe "MIDI", ->
    context "When ScripterFixture#MIDI is accessed", ->
      specify "Then a MIDIFixture instance is returned", ->
        expect(new ScripterFixture()).property("MIDI").instanceof(MIDIFixture)
