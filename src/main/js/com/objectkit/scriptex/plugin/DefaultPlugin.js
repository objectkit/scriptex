import { Plugin } from "com/objectkit/scriptex/plugin/Plugin"

/**
 * @classdesc
 * The DefaultPlugin class is a lightweight implementation designed for quick experimentation and
 * protoyping of bespoke processors.
 *
 * It has been designed to solve common view and midi management problems with the native Scripter
 * API while keepin file size low and performance relatively high. .
 *
 * The needsTiming, needsResets and params properties have been intentionally left out of the
 * base implementation and you are encouraged to add them to subclasses only as needed.
 *
 * @example
 * class BespokePlugin extends DefaultPlugin {
 *
 *   // @lends Scripter.NeedsTimingInfo
 *   get needsTiming () {
 *     return true
 *   }
 *
 *   // @lends Scripter.ResetParameterDefaults
 *   get needsDefaults () {
 *     return false
 *   }
 *
 *   // @lends Scripter.PluginParameters
 *   get params () {
 *     return [{ type: "text", name: this.constructor.name }]
 *   }
 *
 *   // intercept midi events and scripter events as needed...
 * }
 *
 * // Instantiate and deploy the plugin, printing the integration keys to console
 * BespokePlugin.deploy()
 *  .forEach(Trace)
 *
 * @extends Plugin
 * @see [onParam]{@link DefaultPlugin#onParam}
 * @see [onMidi]{@link DefaultPlugin#onMidi}
 * @see [Plugin.deploy]{@link Plugin.deploy}
 */
class DefaultPlugin extends Plugin {

  /**
   * Manage calls to Scripter.ParameterChanged.
   *
   * This implementation essentially treats the plugin itself as a "ParamViewModel".
   *
   * Given onParam is called with a parameter index and data value
   *   When the param as a property named ID
   *     Then ID is treated as a property key of the plugin
   *     And the data value is assigned to the plugin.
   *
   * This enables the use of properties to store parameter state and also provides the convenience
   * of property interceptors for advanced use cases
   *
   * @example
   * class MidiStop extends DefaultPlugin {
   *   get params () {
   *     return [
   *       {
   *         ID: "midiStop"
   *       , type: "momentary"
   *       , name: "MIDI Stop"
   *       }
   *     ]
   *   }
   *
   *   set midiStop (any) {
   *     this.engine.MIDI.allNotesStop()
   *   }
   * }
   *
   * @param  {number} key The index of a param
   * @param  {number} val The new value of the param
   * @return {void}
   */
  onParam (key, val) {
    /** @todo support MENU key to return selected items as opposed to selected index */
    (key = this.params[key].ID) && (this[key] = val)
  }

  /**
   * Manage calls to Scripter.HandleMIDI.
   *
   * This implementation filters out midi events to appropriate hanlders to facilitate
   * quick interception of key events.
   *
   * @example
   * class Transposer {
   *   get params () {
   *     return [
   *       {
   *         ID: "semitones"
   *       , name: "Semitones"
   *       , type: "lin"
   *       , defaultValue: 0
   *       , minValue: -12
   *       , maxValue: 12
   *       }
   *     ]
   *   }
   *
   *   onNote (noteOnOrOff) {
   *     noteOnOrOff.pitch += this.semitones
   *     return super.onNote(noteOnOrOff)
   *   }
   * }
   *
   * @param  {Event} midi A Scripter MIDI event
   * @return {number}     The beatPos that the midi event was sent at
   * @see [onNoteOn]{@link DefaultPlugin#onNoteOn}
   * @see [onNoteOff]{@link DefaultPlugin#onNoteOn}
   * @see [onControlChange]{@link DefaultPlugin#onControlChange}
   * @see [onProgramChange]{@link DefaultPlugin#onProgramChange}
   * @see [onTargetEvent]{@link DefaultPlugin#onTargetEvent}
   * @see [onPitchBend]{@link DefaultPlugin#onPitchBend}
   * @see [onEvent]{@link DefaultPlugin#onEvent}
   */
  onMidi (midi) {
    return this[("on"+this.getEventName(midi))](midi)
  }

  /**
   * Manage a NoteOn event.
   *
   * @param  {NoteOn} event A NoteOn event
   * @return {number}       The beatPos that the event was sent at
   * @see [onMidi]{@link DefaultPlugin#onMidi}
   * @see [onNote]{@link DefaultPlugin#onNote}
   */
  onNoteOn (event) {
    return this.onNote(event)
  }


  /**
   * Manage a NoteOff event.
   *
   * @param  {NoteOff} event A NoteOff event
   * @return {number}       The beatPos that the event was sent at
   * @see [onMidi]{@link DefaultPlugin#onMidi}
   * @see [onNote]{@link DefaultPlugin#onNote}
   */
  onNoteOff (event) {
    return this.onNote(event)
  }

  /**
   * Manage a NoteOn or NoteOff event.
   *
   * @param  {NoteOff|NoteOn} event A NoteOff or NoteOn event
   * @return {number}       The beatPos that the event was sent at
   * @see [onNoteOn]{@link DefaultPlugin#onNote}
   * @see [onNoteOff]{@link DefaultPlugin#onNote}
   * @see [sendMidi]{@link DefaultPlugin#sendMidi}
   */
  onNote (event) {
    return this.sendMidi(event)
  }

  /**
   * Manage a ControlChange event.
   *
   * @param  {ControlChange} event A ControlChange event
   * @return {number}       The beatPos that the event was sent at
   * @see [onMidi]{@link DefaultPlugin#onMidi}
   * @see [sendMidi]{@link DefaultPlugin#sendMidi}
   */
  onControlChange (event) {
    return this.sendMidi(event)
  }

  /**
   * Manage a ProgramChange event.
   *
   * @param  {ProgramChange} event  A ProgramChange event
   * @return {number}               The beatPos that the event was sent at
   * @see [onMidi]{@link DefaultPlugin#onMidi}
   * @see [sendMidi]{@link DefaultPlugin#sendMidi}
   */
  onProgramChange (event) {
    return this.sendMidi(event)
  }

  /**
   * Manage a PolyPressure event.
   *
   * @param  {PolyPressure} event   A PolyPressure event
   * @return {number}              The beatPos that the event was sent at
   * @see [onMidi]{@link DefaultPlugin#onMidi}
   * @see [sendMidi]{@link DefaultPlugin#sendMidi}
   */
  onPolyPressure (event) {
    return this.sendMidi(event)
  }

  /**
   * Manage a ChannelPressure event.
   *
   * @param  {ChannelPressure} event   A ChannelPressure event
   * @return {number}              The beatPos that the event was sent at
   * @see [onMidi]{@link DefaultPlugin#onMidi}
   * @see [sendMidi]{@link DefaultPlugin#sendMidi}
   */
  onChannelPressure (event) {
    return this.sendMidi(event)
  }

  /**
   * Manage a TargetEvent event.
   *
   * @param  {TargetEvent} event   A TargetEvent event
   * @return {number}              The beatPos that the event was sent at
   * @see [onMidi]{@link DefaultPlugin#onMidi}
   * @see [sendMidi]{@link DefaultPlugin#sendMidi}
   */
  onTargetEvent (event) {
    return this.sendMidi(event)
  }

  /**
   * Manage a PitchBend event.
   *
   * @param  {PitchBend} event    A TargetEvent event
   * @return {number}             The beatPos that the event was sent at
   * @see [onMidi]{@link DefaultPlugin#onMidi}
   * @see [sendMidi]{@link DefaultPlugin#sendMidi}
   */
  onPitchBend (event) {
    return this.sendMidi(event)
  }

  /**
   * Manage a generic Event instance.
   *
   * @param  {PitchBend} event    A generic Event instance
   * @return {number}             The beatPos that the event was sent at
   * @see [onMidi]{@link DefaultPlugin#onMidi}
   * @see [sendMidi]{@link DefaultPlugin#sendMidi}
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
    /* Given beatPos is empty */
    if (0 === beatPos) {
      /* Then invoke send() and store beatPos as 0 for return value */
      event.send()
    }
    /* Given beatPos is less than zero */
    else if (0 > beatPos) {
      /* When beatPos is of type number */
      beatPos === +beatPos
        /* Then invoke sendAfterBeats */
        ? event.sendAfterBeats(beatPos *= -1)
        /* When beatPos is of assumed type string, then invoke sendAfterMilliseconds */
        : event.sendAfterMilliseconds(beatPos = +Math.abs(beatPos))
    }
    /* Given beatPos is a positive number */
    else {
      /* Then invoke sendAtBeat */
      event.sendAtBeat(beatPos)
    }
    return beatPos
  }
}

export { DefaultPlugin }
