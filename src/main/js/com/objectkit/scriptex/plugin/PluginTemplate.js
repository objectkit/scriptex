/* @todo use of @lends is blocking jsdoc render documentation */
import Plugin from "com/objectkit/scriptex/plugin/Plugin"

const finalise = (target, key, val) =>
  Reflect.defineProperty(target, key, { value: val })

/*
  0     Event
  80    TargetEvent
  128   NoteOff
  144   Note
  144   NoteOn
  160   PolyPressure
  176   ControlChange
  192   ProgramChange
  208   ChannelPressure
  224   PitchBend
*/
/** @deprecated */
const MIDI_STATUS_TYPE = new Map
(
  [
    [ 0, `Event` ]
  , [ 80, `TargetEvent` ]
  , [ 128, `NoteOff` ]
  , [ 144, `NoteOn` ]
  , [ 144, `Note` ]
  , [ 160, `PolyPressure` ]
  , [ 176, `ControlChange` ]
  , [ 192, `ProgramChange` ]
  , [ 208, `ChannelPressure` ]
  , [ 224, `PitchBend` ]
  ]
)

/**
 * @class PluginTemplate
 *
 * This is a general purpose implementation suitable for
 * prototyping and lightweight MIDI applications.
 *
 * config properties must be implemented by subclasses,
 * either by defining getters or by setting standard
 * properties by override onInit
 *
 *  @exammple
 *  get needsTiming () {
 *    return true
 *  }
 *
 *  get needsDefaults () {
 *    return false
 *  }
 *
 *  get params () {
 *    return [ { type: text, name: this.constructor.name }]
 *  }
 *
 */
class PluginTemplate extends Plugin {

  /**
   * The plugin has been given access to the engine that will meld into it as reciprocated
   * part whole of the Scripter system, giving the perfect moment for the plugin to embody
   * its final configuration ny initialising itself for the last time should it wish to.
   *
   * @type {Object}
   * @see {@link PluginTemplate#onInit}
   * @see {@link Scripter}
   */
  set engine (engine) {
    finalise(this, `engine`, engine)
    this.onInit()
  }

  /**
   * [engine description]
   * @type {Object}
   * @throws "EngineMissing" when accessed without being set
   */
  get engine () {
    // @todo rename `EngineAccessFault`
    throw new ReferenceError(`EngineMissing`)
  }

  /**
   * A local reference to the Scripter.MIDI object.
   * Once accessed, this extended API is available
   *
   * @example
   *  // e.g. URL POINTING TO SCRIPTER EQUIVALENT STANDARD
   *  this.midi.noteNumber(pitchName)
   * @example
   *  // e.g. URL POINTING TO SCRIPTER EQUIVALENT STANDARD
   *  this.midi.noteName(pitchNumber)
   * @example
   *  // e.g. URL POINTING TO SCRIPTER EQUIVALENT STANDARD
   *  this.midi.ccName(controllerNumber)
   * @example
   *  // e.g.Ensure that all present midi events immediately cease
   *  this.midi.allNotesOff()
   * @example
   *  // “Normalizes a value to the safe range of MIDI status bytes (128–239"
   *  this.midi.normalizeStatus(midiStatusBytes)
   * @example
   *  // “Normalizes a value to the safe range of MIDI channels (1–16).”
   *  this.midi.normalizeChannel(limitedValue)
   * @exammple
   *  // “Normalizes a value to the safe range of MIDI data bytes (0–127)”
   *  this.midi.normalizeData(val)
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
   * A convenience method to initialise plugin variables.
   * Define setters for Scripter properties if no method scoped instantiateion logic is required.
   *
   * @abstract
   * @return {void}
   */
  onInit () {}

  /**
   * Manage Scripter.ParameterChanged events.
   *
   * @param  {number} key
   * @param  {number} val
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
   * @see [delegateMidi]{@link PluginTemplate#delegateMidi}
   */
  onMidi (midi) {
    return this.delegateMidi(midi)
  }

  /**
   * [delegateMidi description]
   *
   * @param  {Event} midi
   * @return {number}
   * @see [onNoteOn]{@link PluginTemplate#onNoteOn}
   * @see [onNoteOff]{@link PluginTemplate#onNoteOff}
   * @see [onChannelPressure]{@link PluginTemplate#onChannelPressure}
   * @see [onPolyPressure]{@link PluginTemplate#onPolyPressure}
   * @see [onProgramChange]{@link PluginTemplate#onProgramChange}
   * @see [onControlChange]{@link PluginTemplate#onControlChange}
   * @see [onPitchBend]{@link PluginTemplate#onPitchBend}
   * @see [onTargetEvent]{@link PluginTemplate#onTargetEvent}
   */
   /** @protected */
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
  // delegateMidi (midi) {
  //   // let midiType = MIDI_STATUS_MAP.get(midi.status)
  //   // let methodKey = `on${midiType}`
  //   // return this[methodKey](midi)
  //   let midiType = MIDI_STATUS_TYPE.get(midi.status)
  //   if (null == midiType)
  //     throw new ReferenceError(`MidiTypeNotFound: status=${midi.status}`)
  //   let delegateKey = "on" + midiType
  //   if (null == this[delegateKey])
  //     throw new ReferenceError(`MidiDelegateNotFound: ${delegateKey}`)
  //   return this["on" + midiType](midi)
  // }


  /**
   * Manage custom events or standard Event events.
   *
   * @param  {Event} midi
   * @return {numnber}
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
   * Send a MIDI event using any one of the four available MIDI send methodss.
   *
   * This general purpose solution imposes a small ruleset.
   * When beatPos is a string
   * - Then beatPos is cast to number and sendAfterMilliseconds is chosen
   * When beatPos is a negative number
   * - Then beatPos is inverted and SendMIDIEventAfterBeats
   * When if beatPos is a positive integer or null,
   * - Then SendMIDIeventNow
   *
   * @see [Scripter.SendMIDIEventNow]{@link Scripter}
   * @see [Scripter.SendMIDIEventAtBeat]{@link Scripter}
   * @see [Scripter.SendMIDIEventAfterBeats]{@link Scripter}
   * @see [Scripter.SendMIDIEventAfterMilliseconds]{@link Scripter}
   * @see [Event]{@link Scripter}
   * @param {Event} midi
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

   // v1. midi event is called directly
   // sendMidi (midi) {
   //   let beatPos = midi.beatPos || 0
   //   if (`string` === typeof beatPos) {
   //     // this.engine.SendMIDIEventAfterMilliseconds(midi, beatPos = +beatPos)
   //     midi.sendAfterMilliseconds(beatPos = +beatPos)
   //   }
   //   else if (0 > beatPos) {
   //     // this.engine.SendMIDIEventAfterBeats(midi, beatPos *= -1)
   //     midi.sendAfterBeats(beatPos *= -1)
   //   }
   //   else {
   //     // this.engine.SendMIDIEventAtBeat(midi, beatPos)
   //     midi.sendAtBeat(beatPos)
   //   }
   //   return beatPos
   // }

   /* @todo when beatPos is null, use SendMIDIEventNow for !needsTiming compatability */
   // v2. Scripter methodname is contextually looked up and executed
   // sendMidi (midi) {
   //   let methodKey
   //   let beatPos = midi.beatPos
   //   if (`string` === typeof beatPos) {
   //     beatPos = +beatPos
   //     methodKey = "SendMIDIEventAfterMilliseconds"
   //   }
   //   else if (0 > beatPos) {
   //     beatPos *= -1
   //     methodKey = "SendMIDIEventAfterBeats"
   //   }
   //   else if (!beatPos){
   //     Trace("NeedsTimignInfo = " + this.needsTiming)
   //     methodKey = "SendMIDIEventNow"
   //   }
   //   else {
   //     methodKey = "SendMIDIEventAtBeat"
   //   }
   //   this.engine[methodKey](midi, beatPos)
   //   return beatPos
   // }
}

export default PluginTemplate
