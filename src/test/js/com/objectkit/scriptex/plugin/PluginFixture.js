import Plugin from "com/objectkit/scriptex/plugin/Plugin"

export default class PluginFixture extends Plugin {

  get needsTiming () {
    return true
  }

  get needsDefaults () {
    return true
  }

  get params () {
    let minVelocity = {
      ID: "minVelocity"
    , name: "Minimum Velocity"
    , type: "lin"
    , minValue: 0
    , maxValue: 127
    , defaultValue: 0
    , numberOfSteps: 127
    }

    let maxVelocity = {
      ID: "maxVelocity"
    , name: "Maximum Velocity"
    , type: "lin"
    , minValue: 0
    , maxValue: 127
    , defaultValue: 127
    , numberOfSteps: 127
    }

    let midiPanic = {
      ID: "midiPanic"
    , name: "PANIC"
    , type: "momentary"
    }

    let loggingEnabled = {
      ID: "loggingEnabled"
    , name: "Log MIDI"
    , type: "checkbox"
    , defaultValue: 0
    }

    let processEnabled = {
      ID: "processing"
    , name: "Processing"
    , type: "checkbox"
    , defaultValue: 1
    }

    return [
      processEnabled
    , midiPanic
    , loggingEnabled
    , minVelocity
    , maxVelocity
    ]
  }

  set midiPanic (pressed) {
    this.system.MIDI.allNotesOff()
  }

  set minVelocity (val) {
    if (val > this._maxVelocity) {
      this.system.SetParameter("Minimum Velocity", this._maxVelocity - 1)
    }
    else {
      this._minVelocity = val
    }
  }

  set maxVelocity (val) {
    if (val < this._minVelocity) {
      this.system.SetParameter("Maximum Velocity", this._minVelocity + 1)
    }
    else {
      this._maxVelocity = val
    }
  }

  onMidi (midi) {
    if (!(this.processing)) {
      return
    }

    if (midi.hasOwnProperty("velocity")) {
      let velocity = midi.velocity
      if (velocity > this._maxVelocity)
        velocity = this._maxVelocity
      if (velocity < this._minVelocity)
        velocity = this._minVelocity
      midi.velocity = velocity
    }

    this.system.SendMIDIEventNow(midi)

    if (this.loggingEnabled) {
      this.system.Trace(midi)
    }
  }

  onParam (index, data) {
  	this[this.params[index].ID] = data
  }

  onReset () {
    this.system.Trace("RESET")
  }

  /*
    NOTE
    When ResetParameterDefaults is true and UpdatePluginParameters is called,
    Then all params are reset to their default values.
   */
  onIdle () {
    if (!(this.needsDefaults)){
      this.system.UpdatePluginParameters()
    }
  }

  onProcess () {
    if (this.needsTiming){
      this.hostState = this.system.GetTimingInfo()
    }
  }
}
