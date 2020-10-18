import chai from "chai"
import sinon from "sinon"
import { Scriptex , Plugin, DefaultPlugin } from "@objectkit/scriptex"
import {
  ChannelPressure
, ControlChange
, Event
, Note
, NoteOn
, NoteOff
, PitchBend
, PolyPressure
, ProgramChange
, TargetEvent
, Scripter
} from "@objectkit/scriptex-mox"

describe(`DefaultPlugin`, () => {

  const sandbox= sinon.createSandbox()
  const { assert }= chai

  afterEach(()=>{
    sandbox.restore()
  })

  describe(`#onParam(key:number, val:number):void`, () => {
    /*
      When no #params property exists
        Then "TypeError: Cannot read property '0' of undefined"

      It does an unsafe lookup to improve performance
      The rule is limited to unit testing and accidental use.
     */
    context(`Given #params does not exist`, () => {
      context(`When #onParam is invoked`, () => {
        specify(`Then #onParam thows TypeError`, () => {
          const fn= () => new DefaultPlugin().onParam(0, 0)
          assert.throws(fn, TypeError, "Cannot read property '0' of undefined")
        })
      })
    })
    context(`Given #params exists`, () => {
      context(`When #params[key] refers to an existing param`, () => {
        context(`When param.ID exists`, () => {
          specify(`Then plugin[param.ID] is assigned val`, ()=> {
            const defaultPlugin= new DefaultPlugin
            defaultPlugin.params= [
              {
                ID: "davidHume"
              , name: "Connexions"
              , type: "menu"
              , valueStrings: [
                  "Resemblance", "Contiguity", "Causality"
                ]
              , defaultValue: 0
              }
            ]
            const ID= defaultPlugin.params[0].ID
            assert.strictEqual("davidHume", ID)
            assert.notProperty(defaultPlugin, ID)
            defaultPlugin.onParam(0, 2)
            assert.propertyVal(defaultPlugin, ID, 2)
            defaultPlugin.onParam(0, 1)
            assert.propertyVal(defaultPlugin, ID, 1)
            defaultPlugin.onParam(0, 0)
            assert.propertyVal(defaultPlugin, ID, 0)
          })
        })

        context(`When param.ID does not exist`, () => {
          specify(`Then plugin is not assigned val`, () => {
            const defaultPlugin= new DefaultPlugin()
            defaultPlugin.params= []
            defaultPlugin.onParam(0, 2)
            defaultPlugin.onParam(0, 1)
            defaultPlugin.onParam(0, 0)
            assert.deepEqual([`params`], Reflect.ownKeys(defaultPlugin))
          })
        })
      })
    })
  })

  describe(`#onMidi(midi:Event):number`, () => {

    context(`Given a midi event passed to the #onMidi method`, () => {

      context(`When ChannelPressure is the midi event type`, () => {
        specify(`Then the event is delegated from #onMidi to #onChannelPressure, #sendMidi`, () => {
          const event= sandbox.spy(new ChannelPressure())
          const plugin= sandbox.spy(new DefaultPlugin())
          const { onMidi, onChannelPressure, sendMidi } = plugin
          {
            plugin.onMidi(event)
          }
          sandbox.assert.callOrder(onMidi, onChannelPressure, sendMidi)
          sandbox.assert.calledOnce(event.send)
          assert.isNumber(onMidi.lastCall.returnValue)
        })
      })

      context(`When ControlChange is the midi event type`, () => {
        specify(`Then the event is delegated from #onMidi to #onChannelPressure, #sendMidi`, () => {
          const event= sandbox.spy(new ControlChange())
          const plugin= sandbox.spy(new DefaultPlugin())
          const { onMidi, onControlChange, sendMidi } = plugin
          {
            plugin.onMidi(event)
          }
          sandbox.assert.callOrder(onMidi, onControlChange, sendMidi)
          sandbox.assert.calledOnce(event.send)
          assert.isNumber(onMidi.lastCall.returnValue)
        })
      })

      context(`When Event is the midi event type`, () => {
        specify(`Then the event is delegated from #onMidi to #onEvent, #sendMidi`, () => {
          const event= sandbox.spy(new Event())
          const plugin= sandbox.spy(new DefaultPlugin())
          const { onMidi, onEvent, sendMidi } = plugin
          {
            plugin.onMidi(event)
          }
          sandbox.assert.callOrder(onMidi, onEvent, sendMidi)
          sandbox.assert.calledOnce(event.send)
          assert.isNumber(onMidi.lastCall.returnValue)
        })
      })

      context(`When Note is the midi event type`, () => {
        specify(`Then the event is delegated from #onMidi to #onNote, #sendMidi`, () => {
          const event= sandbox.spy(new Note())
          const plugin= sandbox.spy(new DefaultPlugin())
          const { onMidi, onNoteOff, onNote, sendMidi } = plugin
          {
            plugin.onMidi(event)
          }
          sandbox.assert.callOrder(onMidi, onNote, sendMidi)
          sandbox.assert.calledOnce(event.send)
          assert.isNumber(onMidi.lastCall.returnValue)
        })
      })

      context(`When NoteOff is the midi event type`, () => {
        specify(`Then the event is delegated from #onMidi to #onNoteOff, #onNote, #sendMidi`, () => {
          const event= sandbox.spy(new NoteOff())
          const plugin= sandbox.spy(new DefaultPlugin())
          const { onMidi, onNoteOff, onNote, sendMidi } = plugin
          {
            plugin.onMidi(event)
          }
          sandbox.assert.callOrder(onMidi, onNoteOff, onNote, sendMidi)
          sandbox.assert.calledOnce(event.send)
          assert.isNumber(onMidi.lastCall.returnValue)
        })
      })

      context(`When NoteOn is the midi event type`, () => {
        specify(`Then the event is delegated from #onMidi to #onNoteOn, #onNote, #sendMidi`, () => {
          const event= sandbox.spy(new NoteOn())
          const plugin= sandbox.spy(new DefaultPlugin())
          const { onMidi, onNoteOn, onNote, sendMidi } = plugin
          {
            plugin.onMidi(event)
          }
          sandbox.assert.callOrder(onMidi, onNoteOn, onNote, sendMidi)
          sandbox.assert.calledOnce(event.send)
          assert.isNumber(onMidi.lastCall.returnValue)
        })
      })

      context(`When PitchBend is the midi event type`, () => {
        specify(`Then the event is delegated from #onMidi to #onPitchBend, #sendMidi`, () => {
          const event= sandbox.spy(new PitchBend())
          const plugin= sandbox.spy(new DefaultPlugin())
          const { onMidi, onPitchBend, sendMidi } = plugin
          {
            plugin.onMidi(event)
          }
          sandbox.assert.callOrder(onMidi, onPitchBend, sendMidi)
          sandbox.assert.calledOnce(event.send)
          assert.isNumber(onMidi.lastCall.returnValue)
        })
      })

      context(`When PolyPressure is the midi event type`, () => {
        specify(`Then the event is delegated from #onMidi to #onPolyPressure, #sendMidi`, () => {
          const event= sandbox.spy(new PolyPressure())
          const plugin= sandbox.spy(new DefaultPlugin())
          const { onMidi, onPolyPressure, sendMidi } = plugin
          {
            plugin.onMidi(event)
          }
          sandbox.assert.callOrder(onMidi, onPolyPressure, sendMidi)
          sandbox.assert.calledOnce(event.send)
          assert.isNumber(onMidi.lastCall.returnValue)
        })
      })

      context(`When ProgramChange is the midi event type`, () => {
        specify(`Then the event is delegated from #onMidi to #onProgramChange, #sendMidi`, () => {
          const event= sandbox.spy(new ProgramChange())
          const plugin= sandbox.spy(new DefaultPlugin())
          const { onMidi, onProgramChange, sendMidi } = plugin
          {
            plugin.onMidi(event)
          }
          sandbox.assert.callOrder(onMidi, onProgramChange, sendMidi)
          sandbox.assert.calledOnce(event.send)
          assert.isNumber(onMidi.lastCall.returnValue)
        })
      })

      context(`When TargetEvent is the midi event type`, () => {
        specify(`Then the event is delegated from #onMidi to #onTargetEvent, #sendMidi`, () => {
          const event= sandbox.spy(new TargetEvent())
          const plugin= sandbox.spy(new DefaultPlugin())
          const { onMidi, onTargetEvent, sendMidi } = plugin
          {
            plugin.onMidi(event)
          }
          sandbox.assert.callOrder(onMidi, onTargetEvent, sendMidi)
          sandbox.assert.calledOnce(event.send)
          assert.isNumber(onMidi.lastCall.returnValue)
        })
      })
    })
  })

  describe(`#sendMIDI(midi:Event):number|string`, () => {
    context(`Given a midi event of type Event`, () => {
      context(`When midi.beatPos is empty but not 0`, () => {
        specify(`Then midi.send() is called and 0 is returned`, () => {
          const plugin= sandbox.spy(new DefaultPlugin())
          const event = sandbox.spy(new Event())
          event.beatPos= undefined
          const whenPos= plugin.sendMidi(event)
          assert.strictEqual(0, whenPos)
          sandbox.assert.calledOnce(event.send)
          sandbox.assert.notCalled(event.sendAtBeat)
          sandbox.assert.notCalled(event.sendAfterBeats)
          sandbox.assert.notCalled(event.sendAfterMilliseconds)
          event.beatPos= null
          assert.strictEqual(0, plugin.sendMidi(event))
          sandbox.assert.calledTwice(event.send)
          event.beatPos= ``
          assert.strictEqual(0, plugin.sendMidi(event))
          sandbox.assert.calledThrice(event.send)
        })
      })
      context(`When midi.beatPos === 0`, () => {
        specify(`Then midi.send() is called and 0 is returned`, () => {
          const plugin= sandbox.spy(new DefaultPlugin())
          const event = sandbox.spy(new Event())
          event.beatPos= 0
          const whenPos= plugin.sendMidi(event)
          assert.strictEqual(0, whenPos)
          sandbox.assert.calledOnce(event.send)
          sandbox.assert.notCalled(event.sendAtBeat)
          sandbox.assert.notCalled(event.sendAfterBeats)
          sandbox.assert.notCalled(event.sendAfterMilliseconds)
        })
      })
      context(`When midi.beatPos > 0`, () => {
        specify(`Then midi.sendAtBeat() is called and midi.beatPos returned`, () => {
          const plugin= sandbox.spy(new DefaultPlugin())
          const event = sandbox.spy(new Event())
          event.beatPos= 1
          const whenPos= plugin.sendMidi(event)
          assert.strictEqual(1, whenPos)
          sandbox.assert.notCalled(event.send)
          sandbox.assert.calledOnce(event.sendAtBeat)
          sandbox.assert.notCalled(event.sendAfterBeats)
          sandbox.assert.notCalled(event.sendAfterMilliseconds)
        })
      })
      context(`When midi.beatPos < 0 and is type number`, () => {
        specify(`Then midi.sendAfterBeats() is called and midi.beatPos returned`, () => {
          const plugin= sandbox.spy(new DefaultPlugin())
          const event = sandbox.spy(new Event())
          event.beatPos= -1
          const whenPos= plugin.sendMidi(event)
          assert.strictEqual(-1, whenPos)
          sandbox.assert.notCalled(event.send)
          sandbox.assert.notCalled(event.sendAtBeat)
          sandbox.assert.calledOnce(event.sendAfterBeats)
          sandbox.assert.notCalled(event.sendAfterMilliseconds)
        })
      })
      context(`When midi.beatPos < 0 and is type string`, () => {
        specify(`Then midi.sendAfterMilliseconds() is called and midi.beatPos returned`, () => {
          const plugin= sandbox.spy(new DefaultPlugin())
          const event = sandbox.spy(new Event())
          event.beatPos= "-1"
          const whenPos= plugin.sendMidi(event)
          assert.strictEqual("-1", whenPos)
          sandbox.assert.notCalled(event.send)
          sandbox.assert.notCalled(event.sendAtBeat)
          sandbox.assert.notCalled(event.sendAfterBeats)
          sandbox.assert.calledOnce(event.sendAfterMilliseconds)
        })
      })
    })
  })

  describe(`#getEventName(event:Event):string`, () => {
    context(`Given event.status is not a Scripter midi status code`, () => {
      specify(`Then "EventNameNotFound" is thrown`, () => {
        const statuses= [
          Event.STATUS
        , TargetEvent.STATUS
        , NoteOff.STATUS
        , NoteOn.STATUS
        , PolyPressure.STATUS
        , ControlChange.STATUS
        , ProgramChange.STATUS
        , ChannelPressure.STATUS
        , PitchBend.STATUS
        ]
        const plugin= new DefaultPlugin()
        for (const status of statuses) {
          const ok= () => plugin.getEventName( { status } )
          const notOk= () => plugin.getEventName( { status: status - 1 })
          assert.doesNotThrow(ok)
          assert.throws(notOk, ReferenceError, "EventNameNotFound")
        }
      })
    })
    context(`Given event.status is a Scripter midi status code`, () => {
      context(`When event.status is 0`, () => {
        specify(`Then "Event" is returned`, () => {
          const status= 0
          assert.strictEqual(Event.STATUS, status )
          assert.strictEqual(
            Event.name
          , new DefaultPlugin().getEventName( { status } )
          )
        })
      })
      context(`When event.status is 80`, () => {
        specify(`Then "TargetEvent" is returned`, () => {
          const status= 80
          assert.strictEqual(TargetEvent.STATUS, status )
          assert.strictEqual(
            TargetEvent.name
          , new DefaultPlugin().getEventName( { status } )
          )
        })
      })
      context(`When event.status is 128`, () => {
        specify(`Then "NoteOff" is returned`, () => {
          const status= 128
          assert.strictEqual(NoteOff.STATUS, status )
          assert.strictEqual(
            NoteOff.name
          , new DefaultPlugin().getEventName( { status } )
          )
        })
      })
      context(`When event.status is 144`, () => {
        specify(`Then "NoteOn" is returned: never "Note"`, () => {
          const status= 144
          assert.strictEqual(Note.STATUS, status )
          assert.strictEqual(NoteOn.STATUS, status )
          assert.notStrictEqual(NoteOn.name, Note.name)
          assert.strictEqual(
            NoteOn.name
          , new DefaultPlugin().getEventName( { status } )
          )
        })
      })
      context(`When event.status is 160`, () => {
        specify(`Then "PolyPressure" is returned`, () => {
          const status= 160
          assert.strictEqual(PolyPressure.STATUS, status )
          assert.strictEqual(
            PolyPressure.name
          , new DefaultPlugin().getEventName( { status } )
          )
        })
      })
      context(`When event.status is 176`, () => {
        specify(`Then "ControlChange" is returned`, () => {
          const status= 176
          assert.strictEqual(ControlChange.STATUS, status )
          assert.strictEqual(
            ControlChange.name
          , new DefaultPlugin().getEventName( { status } )
          )
        })
      })
      context(`When event.status is 192`, () => {
        specify(`Then "ProgramChange" is returned`, () => {
          const status= 192
          assert.strictEqual(ProgramChange.STATUS, status )
          assert.strictEqual(
            ProgramChange.name
          , new DefaultPlugin().getEventName( { status } )
          )
        })
      })
      context(`When event.status is 208`, () => {
        specify(`Then "ChannelPressure" is returned`, () => {
          const status= 208
          assert.strictEqual(ChannelPressure.STATUS, status )
          assert.strictEqual(
            ChannelPressure.name
          , new DefaultPlugin().getEventName( { status } )
          )
        })
      })
      context(`When event.status is 224`, () => {
        specify(`Then "PitchBend" is returned`, () => {
          const status= 224
          assert.strictEqual(PitchBend.STATUS, status )
          assert.strictEqual(
            PitchBend.name
          , new DefaultPlugin().getEventName( { status } )
          )
        })
      })
    })
  })
})
