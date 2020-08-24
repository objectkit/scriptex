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
