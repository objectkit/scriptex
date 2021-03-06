import { Plugin } from "com/objectkit/scriptex/plugin/Plugin"

/**
 * @classdesc
 * The DefaultPlugin class is a lightweight implementation designed for quick experimentation and
 * protoyping of bespoke processors.
 *
 * It has been designed to solve common view and midi management problems with the native Scripter
 * API while keepin file size low and performance relatively high. .
 *
 * The needsTiming, needsResets and parameters properties have been intentionally left out of the
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
 *   get parameters () {
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
 * @see [onParameter]{@link DefaultPlugin#onParameter}
 * @see [onMIDI]{@link DefaultPlugin#onMIDI}
 * @see [Plugin.deploy]{@link Plugin.deploy}
 */
class DefaultPlugin extends Plugin {

  /**
   * Manage calls to Scripter.ParameterChanged.
   *
   * This implementation essentially treats the plugin itself as a "ParamViewModel".
   *
   * Given onParameter is called with a parameter index and data value
   *   When the param as a property named ID
   *     Then ID is treated as a property key of the plugin
   *     And the data value is assigned to the plugin.
   *
   * This enables the use of properties to store parameter state and also provides the convenience
   * of property interceptors for advanced use cases
   *
   * @example
   * class MidiStop extends DefaultPlugin {
   *   get parameters () {
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
  onParameter (key, val) {
    /** @todo support MENU key to return selected items as opposed to selected index */
    (key= this.parameters[key])
      && (key= key.ID)
        && (this[key]= val)
  }

  /**
   * Manage calls to Scripter.HandleMIDI.
   *
   * This implementation filters out midi events to appropriate hanlders to facilitate
   * quick interception of key events.
   *
   * @example
   * class Transposer {
   *   get parameters () {
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
  onMIDI (midi) {
    return this[("on"+this.getMIDIName(midi))](midi)
  }

  /**
   * Manage a NoteOn event.
   *
   * @param  {NoteOn} event A NoteOn event
   * @return {number}       The beatPos that the event was sent at
   * @see [onMIDI]{@link DefaultPlugin#onMIDI}
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
   * @see [onMIDI]{@link DefaultPlugin#onMIDI}
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
   * @see [sendMIDI]{@link DefaultPlugin#sendMIDI}
   */
  onNote (event) {
    return this.sendMIDI(event)
  }

  /**
   * Manage a ControlChange event.
   *
   * @param  {ControlChange} event A ControlChange event
   * @return {number}       The beatPos that the event was sent at
   * @see [onMIDI]{@link DefaultPlugin#onMIDI}
   * @see [sendMIDI]{@link DefaultPlugin#sendMIDI}
   */
  onControlChange (event) {
    return this.sendMIDI(event)
  }

  /**
   * Manage a ProgramChange event.
   *
   * @param  {ProgramChange} event  A ProgramChange event
   * @return {number}               The beatPos that the event was sent at
   * @see [onMIDI]{@link DefaultPlugin#onMIDI}
   * @see [sendMIDI]{@link DefaultPlugin#sendMIDI}
   */
  onProgramChange (event) {
    return this.sendMIDI(event)
  }

  /**
   * Manage a PolyPressure event.
   *
   * @param  {PolyPressure} event   A PolyPressure event
   * @return {number}              The beatPos that the event was sent at
   * @see [onMIDI]{@link DefaultPlugin#onMIDI}
   * @see [sendMIDI]{@link DefaultPlugin#sendMIDI}
   */
  onPolyPressure (event) {
    return this.sendMIDI(event)
  }

  /**
   * Manage a ChannelPressure event.
   *
   * @param  {ChannelPressure} event   A ChannelPressure event
   * @return {number}              The beatPos that the event was sent at
   * @see [onMIDI]{@link DefaultPlugin#onMIDI}
   * @see [sendMIDI]{@link DefaultPlugin#sendMIDI}
   */
  onChannelPressure (event) {
    return this.sendMIDI(event)
  }

  /**
   * Manage a TargetEvent event.
   *
   * @param  {TargetEvent} event   A TargetEvent event
   * @return {number}              The beatPos that the event was sent at
   * @see [onMIDI]{@link DefaultPlugin#onMIDI}
   * @see [sendMIDI]{@link DefaultPlugin#sendMIDI}
   */
  onTargetEvent (event) {
    return this.sendMIDI(event)
  }

  /**
   * Manage a PitchBend event.
   *
   * @param  {PitchBend} event    A TargetEvent event
   * @return {number}             The beatPos that the event was sent at
   * @see [onMIDI]{@link DefaultPlugin#onMIDI}
   * @see [sendMIDI]{@link DefaultPlugin#sendMIDI}
   */
  onPitchBend (event) {
    return this.sendMIDI(event)
  }

  /**
   * Manage a generic Event instance.
   *
   * @param  {PitchBend} event    A generic Event instance
   * @return {number}             The beatPos that the event was sent at
   * @see [onMIDI]{@link DefaultPlugin#onMIDI}
   * @see [sendMIDI]{@link DefaultPlugin#sendMIDI}
   */
  onEvent (event) {
    return this.sendMIDI(event)
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
  getMIDIName (event) {
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
  sendMIDI (midi) {
    const beatPos = midi.beatPos || 0
    if (beatPos === 0) {
      midi.send()
    }
    else if (beatPos < 0) {
      if (+beatPos === beatPos) {
        midi.sendAfterBeats(beatPos * -1)
      }
      else {
        midi.sendAfterMilliseconds(beatPos * -1)
      }
    }
    else {
      midi.sendAtBeat(beatPos)
    }
    return beatPos
  }
}

export { DefaultPlugin }
