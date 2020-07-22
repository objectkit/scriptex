import Plugin from "com/objectkit/scriptex/plugin/Plugin"
import RT60Calculator from "com/objectkit/scriptex/plugin/rt60/RT60Calculator"

class RT60Plugin extends Plugin {

  get needsTiming () {
    return true
  }

  get parameters () {
    return [
      /* banner */
      {
        name: `RT60 Delay and Reverb Time Calculator`
      , type: `text`
      }
      /* checkbox */
    , {
        ID: `doUpdateDecays`
      , name: `Decays`
      , type: `checkbox`
      , defaultValue: 1
      }
      /* checkbox */
    , {
        ID: `doUpdateDelays`
      , name: `Delays`
      , type: `checkbox`
      , defaultValue: 1
      }
      /* checkbox */
    , {
        ID: `doUpdateModulations`
      , name: `Modulations`
      , type: `checkbox`
      , defaultValue: 1
      }
      /* button */
    , {
        ID: `doUpdateCalculations`
      , name: `Calculate`
      , type: `momentary`
      }
    ]
  }

  get calculator () {
    return Reflect.defineProperty(this, `calculator`, {value:new RT60Calculator}), this.calculator
  }

  handleParameter (key, val) {
    this[this.parameters[key].ID] = val
  }

  /* conditional execution held in a high frequency execution context */
  handleProcess () {
    if (this.doUpdateCalculations) {
      if (delete this.doUpdateCalculations) {
        let { tempo, meterNumerator, meterDenominator } = this.engine.GetTimingInfo()
        this.renderCalculations(tempo, meterNumerator, meterDenominator)
      }
    }
    return
  }

  handleReset () {
    this.doUpdateCalculations= true
  }

  renderCalculations ( tempo, meterNumerator, meterDenominator ) {
    /* render view */
    /* render metadata */
    this.trace(`BPM ${tempo}`)
    this.trace(`METER ${meterNumerator}|${meterDenominator}`)
    if (this.doUpdateDecays) {
      this.trace(`Decays`)
      this.trace(this.calculator.calculateDecays(tempo, meterNumerator))
    }
    if (this.doUpdateDelays) {
      this.trace(`Delays`)
      this.trace(this.calculator.calculateDelays(tempo, meterNumerator))
    }
    if (this.doUpdateModulations) {
      this.trace(`Modulations`)
      this.trace(this.calculator.calculateModulations (tempo, meterNumerator))
    }
  }

  trace (any) {
    this.engine.Trace(`${any}`)
  }
}

export default RT60Plugin
