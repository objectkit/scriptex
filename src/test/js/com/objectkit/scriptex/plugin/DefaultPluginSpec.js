import { Scriptex, Plugin, DefaultPlugin } from "@objectkit/scriptex"

const sandbox = sinon.createSandbox()
describe(`DefaultPlugin`, () => {

  beforeEach(()=>{})

  afterEach(()=>{})

  describe(`#onParam(key:number, val:number):void`, () => { })

  describe(`#onMidi(midi:Event):number`, () => { })

  describe(`#onChannelPressure(event:ChannelPressure):number`, ()=> { })

  describe(`#onControlChange(event:ControlChange):number`, () => { })

  describe(`#onEvent(event:Event):number`, () => {})

  describe(`#onNote(event:Note|NoteOn|NoteOff):void`, () => {} )

  describe(`#onNoteOn(event:NoteOn):number`, () => { })

  describe(`#onNoteOff(event:NoteOff):number`, () => { })

  describe(`#onPitchBend(event:PitchBend):number`, () => { })

  describe(`#onProgramChange(event:ProgramChange):number`, () => { })

  describe(`#onTargetEvent(event:TargetEvent):number`, () => { })

  describe(`getEventName(event:Event):string`, () => { })

  describe(`#sendMIDI(midi:Event):number`, () => { })
})
