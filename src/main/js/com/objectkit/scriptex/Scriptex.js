import Scripter from "com/objectkit/scriptex/engine/Scripter"

class Scriptex {

  static get ENGINE() {
    return Scripter
  }

  static get API() {
    return new Map(
      [
        [
          "HandleMIDI",
          "handleMIDI"
        ],
        [
          "ProcessMIDI",
          "handleProcess"
        ],
        [
          "ParameterChanged",
          "handleParameter"
        ],
        [
          "Idle",
          "handleIdle"
        ],
        [
          "Reset",
          "handleReset"
        ],
        [
          "NeedsTimingInfo",
          "needsTiming"
        ],
        [
          "ResetParameterDefaults",
          "resetParameters"
        ],
        [
          "PluginParameters",
          "parameters"
        ]
      ]
    )
  }

  static deploy(plugin, ...ctorArgs) {
    let deployee = plugin instanceof Function ? new plugin : plugin
    let deployer = new this(...ctorArgs)
    return deployer.deploy(deployee)
  }

  constructor(engine = new.target.ENGINE, configurable = false, api = new.target.API) {
    this._engine = engine
    this._configurable = configurable
    this._api = api
  }

  deploy(plugin) {
    let ngn = plugin.engine = this._engine

    let api = []

    let def = (obj, key, val, tag, configurable = this._configurable) =>
      Reflect.defineProperty(obj, key, {configurable, [tag]: val })

    let fun = (pluginKey, engineKey) =>
      typeof(plugin[pluginKey]) === `function` &&
      def(ngn, engineKey, (...args) => plugin[pluginKey](...args), `value`)

    let get = (pluginKey, engineKey) =>
      pluginKey in plugin &&
      def(plugin, pluginKey, plugin[pluginKey], `value`, true) &&
      def(ngn, engineKey, () => plugin[pluginKey], `get`)

    for (let [engineKey, pluginKey] of this._api) {
      (fun(pluginKey, engineKey) || get(pluginKey, engineKey)) && api.push(engineKey)
    }

    return api
  }
}

export default Scriptex


// class Plugin {
//
//   static get API () {
//     return Scriptex.API
//   }
//
//   static deploy (engine, configurable) {
//     return new Scriptex(engine, configurable, this.API).deploy(new this())
//   }
//
// }
//
// class DefaultPlugin extends Plugin {
//
//   get needsTiming () {
//     return true
//   }
//
//   get parameters () {
//     return
//   }
//
//   handleMIDI (midi) {
//     switch(midi.status) {
//       /* @todo */
//     }
//   }
//
//   handleParameter (index, value) {
//     this[this.parameters[index].ID] = value
//   }
//
//   dispatchMIDI (midi) {
//     let beatPos = midi.beatPos || 0
//     if (0 > beatPos) {
//       this.system.SendMIDIEventAfterBeats(midi, beatPos *= -1)
//     }
//     else {
//       midi.system.SendMIDIEventNow(midi)
//     }
//     return beatPos
//   }
//
// }
