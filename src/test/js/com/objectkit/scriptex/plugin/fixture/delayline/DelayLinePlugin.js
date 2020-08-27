import Plugin from "com/objectkit/scriptex/plugin/Plugin"
import DelayLineCalculator
  from "com/objectkit/scriptex/plugin/fixture/delayline/DelayLineCalculator"
import DelayLineRenderer
  from "com/objectkit/scriptex/plugin/fixture/delayline/DelayLineRenderer"

class DelayLinePlugin extends Plugin {

  /* @alas Scripter.NeedsTimingInfo */
  get needsTiming () {
    return true
  }

  /* @alias Scripter.PluginParameters */
  get params () {
    return [
      {
        ID: ``
      , name: `D E L A Y L I N E`
      , type: `text`
      }
    , {
        ID: `doAutomaticUpdates`
      , name: `Automatic Mode`
      , type: `checkbox`
      , defaultValue: 1
      }
    , {
        ID: `doUpdateDelayLines`
      , name: `Update`
      , type: `momentary`
      }
    ]
  }

  set engine (engine) {
    this.renderer = new DelayLineRenderer(engine)
    this.calculator = new DelayLineCalculator()
    Reflect.defineProperty(this, "engine", {value: engine})
  }

  /* @alias Scripter.ParameterChanged */
  onParam (key, val) {
    this[this.params[key].ID] = val
  }

  /* @alias Scripter.Reset */
  onReset () {
    if (this.doAutomaticUpdates) {
      this.doUpdateDelayLines = true
    }
  }

  /* @alias Scripter.ProcessMIDI */
  onProcess () {
    this.processDelayLines()
  }

  processDelayLines () {
    let updated = this.doUpdateDelayLines
    if (updated) {
      let { tempo, meterNumerator, meterDenominator } = this.engine.GetTimingInfo()
      let delayLines = this.calculator.calculateDelayLines(tempo, meterNumerator, meterDenominator);
      this.renderer.renderDelayLines(delayLines);
      this.doUpdateDelayLines = false
    }
    return updated
  }
}

export default DelayLinePlugin
