import Plugin from "com/objectkit/scriptex/plugin/Plugin"

class GenericPlugin extends Plugin {

  onParam (key, val) {
    (key = this.params[key].ID) && (this[key] = val)
  }

  onMidi (midi) {
    // return this["on" + this.getEventName(midi)](midi)
    let eventName = this.getEventName(midi)
    let methodKey = "on" + eventName
    return this[methodKey](midi)
  }

  onNoteOn (event) {
    return this.onNote(event)
  }

  onNoteOff (event) {
    return this.onNote(event)
  }

  onNote (event) {
    return this.sendMidi(event)
  }

  onControlChange (event) {
    return this.sendMidi(event)
  }

  onProgramChange (event) {
    return this.sendMidi(event)
  }

  onPolyPressure (event) {
    return this.sendMidi(event)
  }

  onChannelPressure (event) {
    return this.sendMidi(event)
  }

  onTargetEvent (event) {
    return this.sendMidi(event)
  }

  onPitchBend (event) {
    return this.sendMidi(event)
  }

  onEvent (event) {
    return this.sendMidi(event)
  }

  sendMidi (event) {
    let beatPos = event.beatPos || 0

    /* @todo sendAtBeat should be priority */
    0 > beatPos
      ? event.sendAfterBeats(beatPos *= -1)
      : !Number.isFinite(beatPos)
        ? event.sendAfterMilliseconds(beatPos = +Math.abs(beatPos))
        : event.sendAtBeat(beatPos)

    return beatPos
  }

  getEventName (event) {
    let status = event.status
    switch(status) {
      case   0: return "Event"
      case  80: return "TargetEvent"
      case 128: return "NoteOff"
      case 144: return "NoteOn"
      case 160: return "PolyPressure"
      case 176: return "ControlChange"
      case 192: return "ProgramChange"
      case 208: return "ChannelPressure"
      case 224: return "PitchBend"
      default: {
        throw new ReferenceError(`EventNameNotFound: ${status}`)
      }
    }
  }
}

export default GenericPlugin
