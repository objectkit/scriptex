const e=(0,eval)("this");class Scriptex{static get ENGINE(){return e}static get API(){return new Map([["HandleMIDI","handleMIDI"],["ProcessMIDI","handleProcess"],["ParameterChanged","handleParameter"],["Idle","handleIdle"],["Reset","handleReset"],["NeedsTimingInfo","needsTiming"],["ResetParameterDefaults","resetParameters"],["PluginParameters","parameters"]])}static deploy(e,...t){let n=e instanceof Function?new e:e;return new this(...t).deploy(n)}constructor(e=!1,t=new.target.API,n=new.target.ENGINE){this.t=e,this.s=t,this.i=n}deploy(e){let t=[],n=e.engine=this.i,r=(e,t,n,r,a=this.t)=>Reflect.defineProperty(e,t,{configurable:a,[r]:n}),a=(t,a)=>"function"==typeof e[t]&&r(n,a,(...n)=>e[t](...n),"value"),s=(t,a)=>t in e&&r(e,t,e[t],"value",!0)&&r(n,a,()=>e[t],"get");for(let[i,l]of this.s)(a(l,i)||s(l,i))&&t.push(i);return t}}class Plugin{static deploy(...e){return new Scriptex(...e).deploy(new this)}}


/* utils */
const int = (val) => ~~(+val)
const fix = (val) => (+val).toFixed(2)

class RT60Plugin extends Plugin {

  /* @deprecated */
  constructor (padding=32) {
    super()
    this.padding=padding
    new.target.INSTANCE = this
  }

  /* @alias NeedsTimingInfo */
  get needsTiming () {
    return true
  }

  /* @alias ResetParameterDefaults */
  get resetParameters () {
    /* DEBUG MODE */
    return true
  }

  /* @alias PluginParameters */
  get parameters () {
    return [
      {
        name: "RT60"
      , type: "text"
      }
    , {
        ID: `doCalculateDelays`
      , name: "Delays"
      , type: "checkbox"
      , defaultValue: 0
      }
    , {
        ID: `doCalculateDecays`
      , name: "Decays"
      , type: "checkbox"
      , defaultValue: 0
      }
    , {
        ID: `doUpdateCalculations`
      , name: "Calculate"
      , type: "momentary"
      }
    ]
  }

  /* @alias ParameterChanged */
  handleParameter (index, value) {
    this[this.parameters[index].ID] = value
  }

  /* @alias ProcessMIDI */
  handleProcess () {
    if (this.doUpdateCalculations) {
      this.doUpdateCalculations = false
      this.updateCalculations()
    }
  }

  updateCalculations () {
    let { tempo, meterNumerator } = /*this.engine.*/GetTimingInfo()

    if (this.doCalculateDelays) {
      this.traceCalculations(this.calculateDelays(tempo, meterNumerator))
    }

    if (this.doCalculateDecays) {
      this.traceCalculations(this.calculateDecays(tempo /*, meterNumerator*/))
    }
  }

  calculateDecays (bpm, notesPerBar) {
    let noteDecays = []
    let barDuration = notesPerBar * 60000/bpm
    let createDecay = (description, totalDelay, preDelay=totalDelay/64) => (
      {
        "REVERB SIZE": description
      , "PRE-DELAY": fix(preDelay)
      , "DECAY TIME": fix(totalDelay - preDelay)
      , "TOTAL TIME": fix(totalDelay)
      }
    )
    let storeDecay = (...rest) => noteDecays.push(createDecay(...rest))

    /* calculate reverb predelays, decays */

    storeDecay("Hall (2 Bars)", barDuration *= 2)
    storeDecay("Large Room (1 Bar)", barDuration /= 2)
    storeDecay("Small Room (1/2)", barDuration /= 2)
    storeDecay("Tight Ambience (1/4)", barDuration /= 2)

    return noteDecays
  }

  /* FIX: crashes logic instantly */
  /* NOTE numbers in table are all NaN so it is variable lrealted */
  calculateDelays (bpm) {
    let noteDelays = []
    let noteDuration = 60000/bpm
    let $createDelay = (description, noteMs, oscHz=1000/noteMs) => (
      {
        "NOTE VALUE": description
      , "NOTES": `${int(noteMs)} ms / ${fix(oscHz)} Hz`
      , "DOTTED": `${int(noteMs * 1.5)} ms / ${fix(oscHz * 1.5)} Hz`
      , "TRIPLET": `${int(noteMs * 0.667)} ms / ${fix(oscHz * 0.667)} Hz`
      }
    )
    let storeDelay = (...rest) => noteDelays.push(createDelay(...rest))

    storeDelay(`1 (ONE BAR)`, noteDuration *= 4)
    storeDelay(`1/2`, noteDuration /= 2)
    storeDelay(`1/4 (ONE BEAT)`, noteDuration /= 2)
    storeDelay(`1/8`, noteDuration /= 2)
    storeDelay(`1/16`, noteDuration /= 2)
    storeDelay(`1/32`, noteDuration /= 2)
    storeDelay(`1/64`, noteDuration /= 2)
    storeDelay(`1/128`, noteDuration /= 2)
    storeDelay(`1/256`, noteDuration /= 2)
    storeDelay(`1/512`, noteDuration /= 2)

    return noteDelays
  }

  traceCalculations (calculationsTable) {
    let padding = this.padding
    let cellTrace= `\n`
    let traceCell= (cell) => cellTrace += `| ${cell}`.padEnd(padding, ` `)

    /* derive and render the table headers from the first row */
    Reflect.ownKeys(calculationsTable[0]).forEach(traceCell)

    /* render the table by row */
    for (let calculationRow of calculationsTable) {
      cellTrace += `\n`
      /* render the table by cell */
      for (let cellHeading in calculationRow) {
        traceCell(calculationRow[cellHeading])
      }
    }

    /* print the table to console */
    this.engine.Trace(cellTrace)
    return cellTrace
  }
}

let integration = RT60Plugin.deploy()
Trace(integration)
