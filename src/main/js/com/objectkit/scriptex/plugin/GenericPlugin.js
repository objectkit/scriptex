import Plugin from "com/objectkit/scriptex/plugin/Plugin"

/**
 * @classdesc
 * The GenericPlugin class is a minimal implementation useful for quick debelopment and testing.
 * The implementation of onParam essentialy treats the Plugin as a "ParamModelView", while
 * the implementation of onMidi delegates midi events to dedicated handlers.
 *
 * @extends Plugin
 */
class GenericPlugin extends Plugin {

  /**
   * Manage calls to Scripter.ParameterChanged
   *
   * @param  {number} key The index of a param
   * @param  {number} val The new value of the param
   * @return {void}
   */
  onParam (key, val) {
    (key = this.params[key].ID) && (this[key] = val)
  }

  /**
   * Manage calls to Scripter.HandleMIDI
   *
   * @param  {Event} midi A Scripter MIDI event
   * @return {number}     The beatPos that the midi event was sent at
   * @see [onNoteOn]{@link GenericPlugin#onNoteOn}
   * @see [onNoteOff]{@link GenericPlugin#onNoteOn}
   * @see [onControlChange]{@link GenericPlugin#onControlChange}
   * @see [onProgramChange]{@link GenericPlugin#onProgramChange}
   * @see [onTargetEvent]{@link GenericPlugin#onTargetEvent}
   * @see [onPitchBend]{@link GenericPlugin#onPitchBend}
   * @see [onEvent]{@link GenericPlugin#onEvent}
   */
  onMidi (midi) {
    return this[("on"+this.getEventName(midi))](midi)
  }

  /**
   * Manage a NoteOn event.
   *
   * @param  {NoteOn} event A NoteOn event
   * @return {number}       The beatPos that the event was sent at
   * @see [onMidi]{@link GenericPlugin#onMidi}
   * @see [onNote]{@link GenericPlugin#onNote}
   */
  onNoteOn (event) {
    return this.onNote(event)
  }


  /**
   * Manage a NoteOff event.
   *
   * @param  {NoteOff} event A NoteOff event
   * @return {number}       The beatPos that the event was sent at
   * @see [onMidi]{@link GenericPlugin#onMidi}
   * @see [onNote]{@link GenericPlugin#onNote}
   */
  onNoteOff (event) {
    return this.onNote(event)
  }

  /**
   * Manage a NoteOn or NoteOff event.
   *
   * @param  {NoteOff|NoteOn} event A NoteOff or NoteOn event
   * @return {number}       The beatPos that the event was sent at
   * @see [onNoteOn]{@link GenericPlugin#onNote}
   * @see [onNoteOff]{@link GenericPlugin#onNote}
   * @see [sendMidi]{@link GenericPlugin#sendMidi}
   */
  onNote (event) {
    return this.sendMidi(event)
  }

  /**
   * Manage a ControlChange event.
   *
   * @param  {ControlChange} event A ControlChange event
   * @return {number}       The beatPos that the event was sent at
   * @see [onMidi]{@link GenericPlugin#onMidi}
   * @see [sendMidi]{@link GenericPlugin#sendMidi}
   */
  onControlChange (event) {
    return this.sendMidi(event)
  }

  /**
   * Manage a ProgramChange event.
   *
   * @param  {ProgramChange} event  A ProgramChange event
   * @return {number}               The beatPos that the event was sent at
   * @see [onMidi]{@link GenericPlugin#onMidi}
   * @see [sendMidi]{@link GenericPlugin#sendMidi}
   */
  onProgramChange (event) {
    return this.sendMidi(event)
  }

  /**
   * Manage a PolyPressure event.
   *
   * @param  {PolyPressure} event   A PolyPressure event
   * @return {number}              The beatPos that the event was sent at
   * @see [onMidi]{@link GenericPlugin#onMidi}
   * @see [sendMidi]{@link GenericPlugin#sendMidi}
   */
  onPolyPressure (event) {
    return this.sendMidi(event)
  }

  /**
   * Manage a ChannelPressure event.
   *
   * @param  {ChannelPressure} event   A ChannelPressure event
   * @return {number}              The beatPos that the event was sent at
   * @see [onMidi]{@link GenericPlugin#onMidi}
   * @see [sendMidi]{@link GenericPlugin#sendMidi}
   */
  onChannelPressure (event) {
    return this.sendMidi(event)
  }

  /**
   * Manage a TargetEvent event.
   *
   * @param  {TargetEvent} event   A TargetEvent event
   * @return {number}              The beatPos that the event was sent at
   * @see [onMidi]{@link GenericPlugin#onMidi}
   * @see [sendMidi]{@link GenericPlugin#sendMidi}
   */
  onTargetEvent (event) {
    return this.sendMidi(event)
  }

  /**
   * Manage a PitchBend event.
   *
   * @param  {PitchBend} event    A TargetEvent event
   * @return {number}             The beatPos that the event was sent at
   * @see [onMidi]{@link GenericPlugin#onMidi}
   * @see [sendMidi]{@link GenericPlugin#sendMidi}
   */
  onPitchBend (event) {
    return this.sendMidi(event)
  }

  /**
   * Manage a generic Event instance.
   *
   * @param  {PitchBend} event    A generic Event instance
   * @return {number}             The beatPos that the event was sent at
   * @see [onMidi]{@link GenericPlugin#onMidi}
   * @see [sendMidi]{@link GenericPlugin#sendMidi}
   */
  onEvent (event) {
    return this.sendMidi(event)
  }

  /**
   * Determine the name of a Scripter MIDI event.
   *
   * NOTE: in earlier editions of Logic Pro X, determining the name of an
   * event was as simple as checking the event constructors name
   * ``Trace(event.constructor.name) // e.g. "NoteOn"``
   * This method compares the midi status code to a known list of event name correlates
   * to accomodate.
   *
   * @param  {Event} event Any Scripter MIDI event
   * @return {string}      The name of the MIDI event
   */
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

  /**
   * Send a Scripter MIDI event using any one of the four avalable midi dispatch methods
   *
   * When beatPos is missing
   *  Then event.send is used
   * When beatPos is a postive nunber
   *  Then event.sendAtBeat is used
   * When beatPos is a negative number
   *  Then event.sendAfterBeats is used with beatPos flipped to positive number
   * When beatPos is a string (postive or negative)
   *  Then event.sendAfterMilliseconds is used with beatPos cast to positive number
   *
   * @param  {Event} event Any supported Scripter MIDI Event instance.
   * @return {number}      The beatPos at which the event was sent.
   */
  sendMidi (event) {
    let beatPos = event.beatPos || 0

    /** @todo send needs support for cases when NeedsTimingInfo is false */
    /** @todo sendAtBeat should be priority */
    0 > beatPos
      ? event.sendAfterBeats(beatPos *= -1)
      : !Number.isFinite(beatPos)
        ? event.sendAfterMilliseconds(beatPos = +Math.abs(beatPos))
        : event.sendAtBeat(beatPos)

    return beatPos
  }
}

export default GenericPlugin
