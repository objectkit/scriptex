import MIDIFixture from "com/objectkit/scriptex/engine/MIDIFixture"
import TimingInfoFixture from "com/objectkit/scriptex/engine/TimingInfoFixture"

const FIND = Symbol.for(`ScripterFixture/FIND`)
const DATA = Symbol.for(`ScripterFixture/DATA`)

export default class ScripterFixture {

    /*
    PluginParameters

    NeedsTimingInfo

    ResetParameterDefaults

    HandleMIDI

    ProcessMIDI

    ParameterChanged

    Idle

    Reset
    */

   constructor () {
     this.MIDI = new MIDIFixture()
     this[DATA] = new Map()
   }

    GetParameter (key) {
      let parameter = this[FIND](key)
      if (parameter) {
        return this[DATA].get(parameter.name)
      }
    }

    SetParameter (key, val) {
      let params = this.PluginParameters
      if (Array.isArray(params)) {
        let parameter = this[FIND](key)
        if (parameter) {
          this[DATA].set(parameter.name, +val)
          /* invoke ParameterChanged if it is implemented */
          if (this.ParameterChanged) {
            let key = this.PluginParameters.indexOf(parameter)
            let val = this[DATA].get(parameter.name)
            this.ParameterChanged(key, val)
          }
        }
      }
    }

    UpdatePluginParameters () {
      if (this.ParameterChanged) {
        let params = this.PluginParameters
        if (Array.isArray(params)) {
          for (let [index, parameter] of params.entries()) {
            let key = parameter.name
            let val = this[DATA].get(key)
            if (null == val) {
              val = (parameter.defaultValue || 0)
              this[DATA].set(key, val)
            }
            this.ParameterChanged(index, val)
          }
        }
      }
    }

    GetTimingInfo () {
      if (this.NeedsTimingInfo) {
        return new TimingInfoFixture()
      }
    }

    Trace (any) { }

    SendMIDIEventAtBeat (midi, beat) {}

    SendMIDIEventAfterBeats (midi, beats) {}

    SendMIDIEventAfterMilliseconds (midi, ms) {}

    SendMIDIEventNow (midi) {}

    /* private utilities */

    [FIND] (key) {
      let params = this.PluginParameters
      if (Array.isArray(params)) {
        if (Number.isFinite(key)) {
          return params[key]
        }
        else {
          return params.find( p => key === p.name )
        }
      }
    }

}
