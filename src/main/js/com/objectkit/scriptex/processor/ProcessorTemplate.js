import Processor from "com/objectkit/scriptex/processor/Processor"

const finalise = (target, key, val) =>
  Reflect.defineProperty(target, key, { value: val, configurable: false, enumerable: true })

/**
 * @hideconstructor
 * @class
 * @classdesc
 *
 * ProcessorTemplate is an strongly general purpose implementation suitable for
 * prototyping lightweight MIDI applications.
 *
 * @example
 *   class Demonstrator extends ProcessorTemplate {
 *     // define Scipter.NeedsTimingInfo
 *     get needsTiming () {
 *        return true
 *     }
 *
 *     // define Scripter.ResetParameterDefaults
 *     get needsDefaults () {
 *        return true
 *     }
 *
 *     // define Scripter.PluginParameters
 *     get params () {
 *       return [
 *         {
 *           ID: "noteOffset"
 *         , type: "menu"
 *         , name: "Note Offset"
 *         , defaultValue: 0
 *         , valueStrings: [
 *              "1/4", "1/8", "1/16", "1/32"
 *           ]
 *         }
 *       ]
 *     }
 *
 *     // exploit "ModelView" functionality by intercepting property changes
 *     set noteOffset (noteOffset) {
 *       this.beatsDelay = 1 / (noteOffset.splice("/").pop())
 *       // exploit the Scripter.MIDI object
 *       this.midi.allNotesOff()
 *     }
 *
 *     // exploit MIDI event filtering
 *     onNote (noteOnOrOff) {
 *       // easily modify events with parameter values
 *       noteOnOrOff.beatPos = this.beatsDelay
 *       // exploit the functionality of #sendMidi
 *       return this.sendMidi(noteOnOrOff)
 *     }
 *   }
 *
 *   // Easily deploy the plugin in the Scripter environment
 *   Demonstrator.deploy()
 *     .forEach(Trace) // [ HandleMIDI, PluginParameters, NeedsTimingInfo, ResetParameterDefaults ]
 *
 * @see [Processor]{@link Processor}
 * @see [Scriptex]{@link Scriptex}
 * @see [Scripter]{@link Scripter}
 * @see [onMIdi]{@link ProcessorTemplate#onMidi}
 * @see [onParam]{@link ProcessorTemplate#onParam}
 * @see [midi]{@link ProcessorTemplate#midi}
 * @see [deploy]{@link Processor.deploy}
 */
class ProcessorTemplate extends Processor {

  /**
   * A plugin reference to the Scripter object as set during {@link Scriptex#deploy}.
   *
   * @type {Object}
   * @see [onInit]{@link ProcessorTemplate#onInit}
   * @see [Scripter]{@link Scripter}
   * @see [Processor.deploy]{@link Processor.deploy}
   * @throws {"EngineAccessFault"}
   */
  set engine (engine) {
    finalise(this, `engine`, engine)
    this.onInit()
  }

  get engine () {
    throw new ReferenceError(`EngineAccessFault`)
  }

  /**
   * A plugin reference to the Scripter.MIDI object.
   *
   * @example
   *  // within method scope:
   *  this.midi.noteName(midiEvent.pitch)
   *
   * @NOTE Accessing before init throws "EngineAccessFault"
   *
   * @see [Scripter.MIDI]{@link Scripter}
   * @type {Object}
   */
  get midi () {
    finalise(this, `midi`, this.engine.MIDI)
    return this.midi
  }

  /**
   * A JIT convenience method to initialise the plugin prior to Scripter integration.
   *
   * @example
   *  class InitiPlugin extends ProcessorTemplate {
   *    onInit() {
   *      this.needsTiming = true
   *      this.needsDefaults = false
   *      this.params = [
   *        { type: "text", name: this.constructor.name }
   *      ]
   *    }
   *  }
   *
   * @abstract
   * @return {void}
   * @see [engine]{@link ProcessorTemplate#engine}
   */
  onInit () {}

  /**
   * Manage Scripter.ParameterChanged events by treating the plugin instance as a
   * virtual "ViewModel".
   *
   * Given that ui parameter data has changed
   *   When the ui parameter has an ID
   *     Then plugin[ID] is assigned that ui parameter data
   *
   * This provides the interesting opportunity to intercept changes to UI by defining setters
   * @example
   *   class MidiStop extends ProcessorTemplate {
   *     get params () {
   *       return [
   *       , {
   *           ID: "doStopMidiNotes"
   *         , type: "momentary"
   *         , name: "MIDI Stop"
   *         }
   *       ]
   *     }
   *
   *     // intercept the button press
   *     set doStopMidiNotes (pressed) {
   *       this.midi.allNotesStop()
   *     }
   *   }
   *
   * @param  {number} key - a parameter index
   * @param  {number} val - a parameter value
   * @return {number}
   * @see [ParameterChanged]{@link Scripter}
   */
  onParam (key, val) {
    /**
     * @todo diff implementation
     * @example
     *   key = this.params[key].ID
     *    && this[key] !== val
     *      && this[key] = val
     */
    return this[this.params[key].ID] = val
  }

  /**
   * Manage Scripter.HandleMIDI events.
   *
   * @param  {Event} midi
   * @return {number}
   * @see [delegateMidi]{@link ProcessorTemplate#delegateMidi}
   */
  onMidi (midi) {
    return this.delegateMidi(midi)
  }

  /**
   * Delegate a midi event to its dedicated method handler.
   *
   *
   * @param  {Event} midi Any supported Scripter midi event.
   * @return {number} The beatPos returned by {@link ProcessorTemplate#sendMidi}
   * @see [onNoteOn]{@link ProcessorTemplate#onNoteOn}
   * @see [onNoteOff]{@link ProcessorTemplate#onNoteOff}
   * @see [onChannelPressure]{@link ProcessorTemplate#onChannelPressure}
   * @see [onPolyPressure]{@link ProcessorTemplate#onPolyPressure}
   * @see [onProgramChange]{@link ProcessorTemplate#onProgramChange}
   * @see [onControlChange]{@link ProcessorTemplate#onControlChange}
   * @see [onPitchBend]{@link ProcessorTemplate#onPitchBend}
   * @see [onTargetEvent]{@link ProcessorTemplate#onTargetEvent}
   */
   delegateMidi (midi) {
     switch (midi.status) {
       case  80: return this.onTargetEvent(midi)
       case 144: return this.onNoteOn(midi)
       case 128: return this.onNoteOff(midi)
       case 160: return this.onPolyPressure(midi)
       case 176: return this.onControlChange(midi)
       case 192: return this.onProgramChange(midi)
       case 208: return this.onChannelPressure(midi)
       case 224: return this.onPitchBend(midi)
       default: return this.onEvent(midi)
     }
   }

  /**
   * Manage decorated Events objects.
   *
   * @param  {Event} midi
   * @return {number}
   * @see [sendMidi]{@link ProcessorTemplate#sendMidi}
   */
  onEvent (midi) {
    return this.sendMidi(midi)
  }

  /**
   * Manage NoteOn events.
   *
   * @param  {NoteOn} noteOn
   * @return {number}
   * @see [sendMidi]{@link ProcessorTemplate#sendMidi}
   */
  onNoteOn (noteOn) {
    return this.onNote(noteOn)
  }

  /**
   * Manage NoteOff events.
   *
   * @param  {NoteOff} noteOff
   * @return {number}
   * @see [sendMidi]{@link ProcessorTemplate#sendMidi}
   */
  onNoteOff (noteOff) {
    return this.onNote(noteOff)
  }

  /**
   * [onNote description]
   *
   * @param  {Note} noteOnOrOFf
   * @return {number}
   * @see [sendMidi]{@link ProcessorTemplate#sendMidi}
   */
  onNote (noteOnOrOff) {
    return this.sendMidi(noteOnOrOff)
  }

  /**
   * Manage ProgramChange events.
   *
   * @param  {ProgramChange} midi
   * @return {number}
   * @see [sendMidi]{@link ProcessorTemplate#sendMidi}
   */
  onProgramChange (midi) {
    return this.sendMidi(midi)
  }

  /**
   * Manage ControlChange events.
   *
   * @param  {ControlChange} midi
   * @return {number}
   * @see [sendMidi]{@link ProcessorTemplate#sendMidi}
   */
  onControlChange (midi) {
    return this.sendMidi(midi)
  }

  /**
   * Manage PolyPressure events.
   *
   * @param  {PolyPressure} midi
   * @return {number}
   * @see [sendMidi]{@link ProcessorTemplate#sendMidi}
   */
  onPolyPressure (midi) {
    return this.sendMidi(midi)
  }

  /**
   * Manage ChannelPressure events.
   *
   * @param  {ChannelPressure} midi
   * @return {number}
   * @see [sendMidi]{@link ProcessorTemplate#sendMidi}
   */
  onChannelPressure (midi) {
    return this.sendMidi(midi)
  }

  /**
   * Manage Pitchbend events.
   *
   * @param  {Pitchbend} midi
   * @return {number}
   * @see [sendMidi]{@link ProcessorTemplate#sendMidi}
   */
  onPitchBend (midi) {
    return this.sendMidi(midi)
  }

  /**
   * Manage TargetEvent events.
   *
   * @param  {TargetEvent} midi
   * @return {number}
   * @see [sendMidi]{@link ProcessorTemplate#sendMidi}
   */
  onTargetEvent (midi) {
    return this.sendMidi(midi)
  }


  /**
   * Send a MIDI event using any one of the four available Scripter MIDI send methods.
   *
   * This general purpose solution imposes a small ruleset:
   *
   * <ul>
   *   <li>When beatPos is a string</li>
   *   <ul>
   *     <li>Then beatPos is cast to number and sendAfterMilliseconds is invoked</li>
   *   </ul>
   *   <li>When beatPos is a negative number</li>
   *   <ul>
   *     <li>Then beatPos is inverted and SendMIDIEventAfterBeats is invoked</li>
   *   </ul>
   *   <li>When beatPos is a positive integer</li>
   *   <ul>
   *     <li>Then SendMIDIEventAtBeat is invoked</li>
   *   </ul>
   *   <li>When neatPos is empty</li>
   *   <ul>
   *     <li>Then SendMIDIEventNow is invoked</li>
   *   </ul>
   * </ul>
   *
   * @see [Scripter.SendMIDIEventNow]{@link Scripter}
   * @see [Scripter.SendMIDIEventAtBeat]{@link Scripter}
   * @see [Scripter.SendMIDIEventAfterBeats]{@link Scripter}
   * @see [Scripter.SendMIDIEventAfterMilliseconds]{@link Scripter}
   * @param {Event} midi - A Scripter MIDI event.
   * @return {number}
   */
   sendMidi (midi) {
     let beatPos = midi.beatPos
     /* When beatPos is intentionally set to a string... */
     if (`string` === typeof beatPos) {
       /* Then cast to number and treat it as a millisecond delay */
       midi.sendAfterMilliseconds(beatPos = +beatPos)
     }
     /* When beatPos is intentionally set to a negative number */
     else if (0 > beatPos) {
       /* Then invert the number and treat it as a beat delay */
       midi.sendAfterBeats(beatPos *= -1)
     }
     /* When beatPos is empty, i.e. when NeedsTimingInfo is false */
     else if (!beatPos){
       /* Then send it plainly and immediately */
       midi.send(), beatPos = 0
     }
     /* When beatPos is a positive number */
     else {
       /* Then send the event precisely at that beat position */
       midi.sendAtBeat(beatPos)
     }
     return beatPos
   }
}

export default ProcessorTemplate
