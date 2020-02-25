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
      let parameter = this[FIND](key)
      if (parameter) {
        this[DATA].set(parameter.name, +val)
      }
    }

    UpdatePluginParameters () {}

    GetTimingInfo () {
      return new TimingInfoFixture()
    }

    Trace (any) {}

    SendMIDIEventAtBeat (midi, beat) {}

    SendMIDIEventAfterBeats (midi, beats) {}

    SendMIDIEventAfterMilliseconds (midi, ms) {}

    SendMIDIEventNow (midi) {}

    /* private utilities */
    [FIND] (key) {
      let parameters = this.PluginParameters
      if (Array.isArray(parameters)) {
        if (Number.isFinite(key)) {
          return parameters[key]
        }
        else {
          return parameters.find( p => key === p.name )
        }
      }
    }

}
