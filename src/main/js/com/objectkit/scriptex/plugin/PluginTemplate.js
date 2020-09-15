import Plugin from "com/objectkit/scriptex/plugin/Plugin"
import EventNames from "com/objectkit/scriptex/util/midi/EventNames"

const finalise = (target, key, val) =>
  Reflect.defineProperty(target, key, { value: val, configurable: false, enumerable: true })

/**
 * @hideconstructor
 * @class
 * @classdesc
 *
 * PluginTemplate is a strongly general purpose implementation suitable for
 * prototyping lightweight MIDI applications.
 *
 * @example
 *   class Demonstrator extends PluginTemplate {
 *     // define Scripter.NeedsTimingInfo
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
 * @see [Plugin]{@link Plugin}
 * @see [Scriptex]{@link Scriptex}
 * @see [Scripter]{@link Scripter}
 * @see [onMidi]{@link PluginTemplate#onMidi}
 * @see [onParam]{@link PluginTemplate#onParam}
 * @see [midi]{@link PluginTemplate#midi}
 * @see [deploy]{@link Plugin.deploy}
 */
class PluginTemplate extends Plugin {

  /**
   * A plugin reference to the Scripter object as set during {@link Scriptex#deploy}.
   *
   * @type {Object}
   * @see [initPlugin]{@link PluginTemplate#initPlugin}
   * @see [Scripter]{@link Scripter}
   * @see [Plugin.deploy]{@link Plugin.deploy}
   * @throws {"EngineAccessFault"}
   */
  set engine (engine) {
    finalise(this, `engine`, engine)
    this.initPlugin()
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
   * A data map that allows you to use a midi status number as a key
   * to lookup the corresponding midi events name.
   *
   * @see [EventNames]{@link EventNames}
   * @type {EventNames}
   */
  get eventNames () {
    finalise(this, `eventNames`, new EventNames)
    return this.eventNames
  }

  /**
   * The viewModel object on which to store parameter value changes.
   * The default implementation uses the plugin instance itself
   * as the view model. This in turn provides the advantage of
   * using property interceptors to trigger actions
   *
   * Subclasses can override this to put custom viewModel objects in place.
   * @example
   * class MidiStop extends PluginTemplate {
   *   get params () {
   *     return [
   *       {
   *         ID: "stopMidi"
   *       , type: "momentary"
   *       , name: "Stop MIDI"
   *       }
   *     ]
   *   }
   *
   *   // when the _Stop MIDI_ button is pressed
   *   // onParam updates the viewModel
   *   // as the viewModel is the plugin
   *   // then implementing a setter with the same ID
   *   // suffices as the implementation of a
   *   // property interceptor
   *   set stopMidi (val) {
   *     this.midi.allNotesOff()
   *   }
   * }
   *
   * @type {Object}
   * @see [updateViewModel]{@link PluginTemplate#updateViewModel}
   */
  get viewModel () {
    return this
  }

  /**
   * A JIT convenience method to initialise the plugin prior to deployment.
   *
   * @example
   *  class BespokePlugin extends PluginTemplate {
   *    initPlugin() {
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
   * @see [engine]{@link PluginTemplate#engine}
   * @see [Plugin.deploy]{@link Plugin.deploy}
   */
  initPlugin () {}

  /**
   * Manage Scripter.ParameterChanged events by updating the plugins viewModel
   *
   * Given that ui parameter data has changed
   *   When the ui parameter has an ID
   *     Then plugin[ID] is assigned that ui parameter data
   *
   * @param  {number} key The index of a parameter
   * @param  {number} val The reported data of a parameter
   * @return {void}
   * @see [ParameterChanged]{@link Scripter}
   * @see [updateViewModel]{@link PluginTemplate#updateViewModel}
   */
  onParam (key, val) {
    this.updateViewModel(this.params[key].ID, val)
  }

  /**
   * Manage Scripter.HandleMIDI events by delegating events to dedicated
   * midi handling methods.
   *
   * @param  {Event} midi
   * @return {number}
   * @see [delegateMidi]{@link PluginTemplate#delegateMidi}
   */
  onMidi (midi) {
    return this.delegateMidi(midi)
  }

  /**
   * Delegate a midi event to its dedicated method handler.
   *
   * @param  {Event} midi Any supported Scripter midi event.
   * @return {number} The beatPos returned by {@link PluginTemplate#sendMidi}
   * @see [onNoteOn]{@link PluginTemplate#onNoteOn}
   * @see [onNoteOff]{@link PluginTemplate#onNoteOff}
   * @see [onChannelPressure]{@link PluginTemplate#onChannelPressure}
   * @see [onPolyPressure]{@link PluginTemplate#onPolyPressure}
   * @see [onProgramChange]{@link PluginTemplate#onProgramChange}
   * @see [onControlChange]{@link PluginTemplate#onControlChange}
   * @see [onPitchBend]{@link PluginTemplate#onPitchBend}
   * @see [onTargetEvent]{@link PluginTemplate#onTargetEvent}
   * @see [getEventName]{@link PluginTemplate#getEventName}
   */
   delegateMidi (midi) {
     let delegateKey = "on" + this.getEventName(midi)
     return this[delegateKey](midi)
   }

   /**
    * Get a midi events name.
    * @param  {Event} event A Scripter MIDI event.
    * @return {string}      The events name
    * @throws "EventNameNotFound"
    * @see [eventNames]{@link PluginTemplate#eventNames}
    */
   getEventName (event) {
     return this.eventNames.get(event.status)
   }

   /**
    * Update the PluginTemplates viewModel
    * @param  {string} key A parameter ID
    * @param  {number} val Parameter data
    * @return {boolean}    An indication of whether the nodel was updated or not
    * @see [viewModel]{@link PluginTemplate#viewModel}
    */
   updateViewModel (key, val) {
     let didUpdate = (null != key)
     if (didUpdate) {
       this.viewModel[key] = val
     }
     return didUpdate
   }

  /**
   * Manage decorated Events objects.
   *
   * @param  {Event} midi
   * @return {number}
   * @see [sendMidi]{@link PluginTemplate#sendMidi}
   */
  onEvent (midi) {
    return this.sendMidi(midi)
  }

  /**
   * Manage NoteOn events.
   *
   * @param  {NoteOn} noteOn
   * @return {number}
   * @see [sendMidi]{@link PluginTemplate#sendMidi}
   */
  onNoteOn (noteOn) {
    return this.onNote(noteOn)
  }

  /**
   * Manage NoteOff events.
   *
   * @param  {NoteOff} noteOff
   * @return {number}
   * @see [sendMidi]{@link PluginTemplate#sendMidi}
   */
  onNoteOff (noteOff) {
    return this.onNote(noteOff)
  }

  /**
   * [onNote description]
   *
   * @param  {Note} noteOnOrOFf
   * @return {number}
   * @see [sendMidi]{@link PluginTemplate#sendMidi}
   */
  onNote (noteOnOrOff) {
    return this.sendMidi(noteOnOrOff)
  }

  /**
   * Manage ProgramChange events.
   *
   * @param  {ProgramChange} midi
   * @return {number}
   * @see [sendMidi]{@link PluginTemplate#sendMidi}
   */
  onProgramChange (midi) {
    return this.sendMidi(midi)
  }

  /**
   * Manage ControlChange events.
   *
   * @param  {ControlChange} midi
   * @return {number}
   * @see [sendMidi]{@link PluginTemplate#sendMidi}
   */
  onControlChange (midi) {
    return this.sendMidi(midi)
  }

  /**
   * Manage PolyPressure events.
   *
   * @param  {PolyPressure} midi
   * @return {number}
   * @see [sendMidi]{@link PluginTemplate#sendMidi}
   */
  onPolyPressure (midi) {
    return this.sendMidi(midi)
  }

  /**
   * Manage ChannelPressure events.
   *
   * @param  {ChannelPressure} midi
   * @return {number}
   * @see [sendMidi]{@link PluginTemplate#sendMidi}
   */
  onChannelPressure (midi) {
    return this.sendMidi(midi)
  }

  /**
   * Manage Pitchbend events.
   *
   * @param  {Pitchbend} midi
   * @return {number}
   * @see [sendMidi]{@link PluginTemplate#sendMidi}
   */
  onPitchBend (midi) {
    return this.sendMidi(midi)
  }

  /**
   * Manage TargetEvent events.
   *
   * @param  {TargetEvent} midi
   * @return {number}
   * @see [sendMidi]{@link PluginTemplate#sendMidi}
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
       midi.sendAfterMilliseconds(beatPos = Math.abs(beatPos))
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

export default PluginTemplate
