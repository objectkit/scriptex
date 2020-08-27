/* @todo use of @lends is blocking jsdoc render documentation */
import Plugin from "com/objectkit/scriptex/plugin/Plugin"

const finalise = (target, key, val) =>
  Reflect.defineProperty(target, key, { value: val })

/** @class */
class PluginTemplate extends Plugin {

  /*
   * NOTICE
   * - needsTiming
   * - needsDefaults
   * - params
   *
   * must be implemented by subclasses either by
   * defining getters or by setting standard properties
   * by override onInit
   */

  set engine (engine) {
    finalise(this, `engine`, engine)
    this.onInit()
  }

  /**
   * [engine description]
   * @lends Scripter
   * @type {Object}
   */
  get engine () {
    throw new ReferenceError(`EngineMissing`)
  }

  /**
   * [midi description]
   * @lends Scripter.MIDI
   * @type {Object}
   */
  get midi () {
    finalise(this, `midi`, this.engine.MIDI)
    return this.midi
  }

  /**
   * [onInit description]
   * @protectd
   * @abstract
   * @return {void}
   */
  onInit () { ; }

  /**
   * [onParam description]
   * @lends Scripter.ParameterChanged
   * @param  {number} key
   * @param  {number} val
   * @return {number}
   */
  onParam (key, val) {
    return this[this.params[key].ID] = val
  }

  /**
   * [onMidi description]
   * @lends Scripter.HandleMIDI
   * @param  {Event} midi
   * @return {number}
   */
  onMidi (midi) {
    /* @todo filter by status code */
    return this[`on${midi.constructor.name}`](midi)
  }

  /**
   * [onNoteOn description]
   * @param  {NoteOn} noteOn
   * @return {number}
   */
  onNoteOn (noteOn) {
    return this.onNote(noteOn)
  }

  /**
   * [onNoteOff description]
   * @param  {NoteOff} noteOff
   * @return {number}
   */
  onNoteOff (noteOff) {
    return this.onNote(noteOff)
  }

  /**
   * [onNote description]
   * @param  {Note} noteOnOrOFf
   * @return {number}
   */
  onNote (noteOnOrOff) {
    return this.sendMidi(noteOnOrOff)
  }

  /**
   * [onProgramChange description]
   * @param  {ProgramChange} midi
   * @return {number}
   */
  onProgramChange (midi) {
    return this.sendMidi(midi)
  }

  /**
   * [onControlChange description]
   * @param  {ControlChang} midi
   * @return {number}
   */
  onControlChange (midi) {
    return this.sendMidi(midi)
  }

  /**
   * [onPolyPressure description]
   * @param  {PolyPressure} midi
   * @return {number}
   */
  onPolyPressure (midi) {
    return this.sendMidi(midi)
  }

  /**
   * [onChannelPressure description]
   * @param  {ChannelPressure} midi
   * @return {number}
   */
  onChannelPressure (midi) {
    return this.sendMidi(midi)
  }

  /**
   * [onPitchbend description]
   * @param  {Pitchbend} midi
   * @return {number}
   */
  onPitchbend (midi) {
    return this.sendMidi(midi)
  }

  /**
   * [onTargetEvent description]
   * @param  {TargetEvent} midi
   * @return {number}
   */
  onTargetEvent (midi) {
    return this.sendMidi(midi)
  }

  /**
   * [sendMIDI description]
   * @lends Scripter.SendMIDIEventNow
   * @lends Scripter.SendMIDIEventAtBeat
   * @lends Scripter.SendMIDIEventAfterBeats
   * @lends Scripter.SendMIDIEventAfterMilliseconds
   * @param {Event} midi
   * @return {number}
   */
  sendMidi (midi) {
    let beatPos = midi.beatPos
    switch(typeof(beatPos)) {
      case `number`: {
        0 > beatPos
          ? midi.sendAfterBeats(beatPos *= -1)
          : midi.sendAtBeat(beatPos)
        break
      }
      case `string`: {
        /* cast to number */
        beatPos = +beatPos
        if (Number.isFinite(beatPos)) {
          midi.sendAfterMilliseconds(beatPos)
        }
        else {

        }
        /* pass through */
      }
      default: {
        beatPos = 0
        midi.send()
      }
    }
    return beatPos
  }
}

export default PluginTemplate
