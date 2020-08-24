export default class APIKeyMap extends Map {
  constructor () {
    super(
      [
        ["HandleMIDI",
          "onMIDI"],
        ["Idle",
          "onIdle"],
        ["NeedsTimingInfo",
          "needsTiming"],
        ["ParameterChanged",
          "onParameter"],
        ["PluginParameters",
          "parameters"],
        ["ProcessMIDI",
          "onProcess"],
        ["Reset",
          "onReset"],
        ["ResetParameterDefaults",
          "needsResets"]
        // ["HandleMIDI",
        //   "handleMIDI"],
        // ["Idle",
        //   "handleIdle"],
        // ["NeedsTimingInfo",
        //   "needsTiming"],
        // ["ParameterChanged",
        //   "handleParameter"],
        // ["PluginParameters",
        //   "parameters"],
        // ["ProcessMIDI",
        //   "handleProcess"],
        // ["Reset",
        //   "handleReset"],
        // ["ResetParameterDefaults",
        //   "resetParameters"]
      ]
    )
  }

  getScripterKeys () {
    return Array.from(this.keys())
  }

  getScriptexKeys () {
    return Array.from(this.values())
  }
}
