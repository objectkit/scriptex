# A Scripter to Scriptex API key map
# e.g. expect(new APIKeys().get("ParameterChanged")).eql("handleParameter") 
class APIKeys extends Map
  constructor: ->
    super [
      ["HandleMIDI"
        "handleMIDI"]
      ["Idle"
        "handleIdle"]
      ["NeedsTimingInfo"
        "needsTiming"]
      ["ParameterChanged"
        "handleParameter"]
      ["PluginParameters"
        "parameters"]
      ["ProcessMIDI"
        "handleProcess"]
      ["Reset"
        "handleReset"]
      ["ResetParameterDefaults"
        "resetParameters"]
    ]

  getScripterKeys: ->
    Array.from(@keys())

  getScriptexKeys: ->
    Array.from(@values())


module.exports = APIKeys
