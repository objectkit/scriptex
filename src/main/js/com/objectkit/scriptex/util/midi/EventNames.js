
/**
 * @classdesc
 * EventNames is a map that uses Scripter MIDI status codes as keys
 * and Scripter event names as values.
 *
 * | MIDI Status Code      | MIDI Event Name
 * |-----------------------|-----------------------
 * | 0                     | Event
 * | 80                    | TargetEvent
 * | 128                   | NoteOff
 * | 144                   | Note
 * | 144                   | NoteOn
 * | 160                   | PolyPressure
 * | 176                   | ControlChange
 * | 192                   | ProgramChange
 * | 208                   | ChannelPressure
 * | 224                   | PitchBend
 */
class EventNames extends Map {

  /** @hideconstructor */
  constructor () {
    super([
      [ 0, "Event" ]
    , [ 80, "TargetEvent" ]
    , [ 144, "Note" ]
    , [ 128, "NoteOff" ]
    , [ 144, "NoteOn" ]
    , [ 160, "PolyPressure" ]
    , [ 176, "ControlChange" ]
    , [ 192, "ProgramChange" ]
    , [ 208, "ChannelPressure" ]
    , [ 224, "PitchBend" ]
    ])
  }

  /**
   * Get a Scripter MIDI Event name by its corresponding MIDI status code
   * @param  {number} statusCode A Scripter supported MIDI status code
   * @return {string}            The corresponding Scripter MIDI event name
   * @throws "EventNameNotFound"
   */
  get (statusCode) {
    let name = super.get(statusCode)
    if (null == name)
      throw new ReferenceError(`EventNameNotFound: key=${statusCode}`)
    return name
  }
}

export default EventNames
