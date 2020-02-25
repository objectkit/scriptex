import Plugin from "com/objectkit/scriptex/plugin/Plugin"

export default class PluginFixture extends Plugin {

  get needsTiming () {
    return true
  }

  get resetParameters () {
    return true
  }

  get parameters () {
    return [
      {
        ID: "muted"
      , type: "checkbox"
      },
      {
        ID: "note"
      , type: "menu"
      , valueStrings: [
          "C", "E", "G"
        ]
      , defaultValue: 0
      , readOnly: false
      , hidden: false
      },
      {
        ID: "midiPanic"
      , type: "momentary"
      }
    ]
  }

  /* @see handleParameter */
  set midiPanic (pressed) {
    this.engine.MIDI.allNotesOff()
  }

  handleMIDI (midi) {
    if (this.muted)
      return
    this.engine.SendMIDIEventNow(midi)
  }

  handleProcess () {
    this.hostInfo = this.engine.GetTimingInfo()
  }

  handleParameter (index, data) {
    let model = this
    let param = this.parameters[index]
    let key = param.ID
    model[key] = data
    return
  }

  handleReset () {
    this.engine.Trace(`Reset`)
  }

  handleIdle () {
    this.engine.UpdatePluginParameters()
  }
}
