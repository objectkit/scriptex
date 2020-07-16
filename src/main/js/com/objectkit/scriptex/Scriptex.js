import Scripter from "com/objectkit/scriptex/engine/Scripter"

class Scriptex {

  static get ENGINE() {
    return Scripter
  }

  static get API() {
    let api = [
      [ "HandleMIDI", "handleMIDI" ],
      [ "ProcessMIDI", "handleProcess" ],
      [ "ParameterChanged",   "handleParameter" ],
      [ "Idle", "handleIdle" ],
      [ "Reset", "handleReset" ],
      [ "NeedsTimingInfo", "needsTiming" ],
      [ "ResetParameterDefaults", "resetParameters"  ],
      [ "PluginParameters", "parameters"   ]
    ]
    return new Map(api)
  }

  static deploy(plugin, ...ctorArgs) {
    let deployee = plugin instanceof Function ? new plugin : plugin
    let deployer = new this(...ctorArgs)
    return deployer.deploy(deployee)
  }

  constructor(configurable = false, api = new.target.API, engine = new.target.ENGINE) {
    this._configurable = configurable
    this._api = api
    this._engine = engine
  }

  deploy(plugin) {

    let api = []

    let ngn = plugin.engine = this._engine

    let def = (obj, key, val, tag, configurable = this._configurable) =>
      Reflect.defineProperty(obj, key, {configurable, [tag]: val })

    let fun = (pluginKey, engineKey) =>
      typeof(plugin[pluginKey]) === `function`
        && def(ngn, engineKey, (...args) => plugin[pluginKey](...args), `value`)

    let get = (pluginKey, engineKey) =>
      pluginKey in plugin
        && def(plugin, pluginKey, plugin[pluginKey], `value`, true)
          && def(ngn, engineKey, () => plugin[pluginKey], `get`)

    for (let [engineKey, pluginKey] of this._api)
      (fun(pluginKey, engineKey) || get(pluginKey, engineKey))
        && api.push(engineKey)

    return api
  }
}

export default Scriptex
