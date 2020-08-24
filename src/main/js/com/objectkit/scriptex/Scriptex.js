import Scripter from "com/objectkit/scriptex/engine/Scripter"

class Scriptex {

  /**
   * [engine description]
   * @type {Object}
   */
  static get ENGINE() {
    return Scripter
  }

  /**
   * [API description]
   * @type {Map<string, string>}
   */
  static get API() {
   return [
      [ `NeedsTimingInfo`, `needsTiming` ]
    , [ `ResetParameterDefaults`, `needsResets` ]
    , [ `PluginParameters`, `parameters` ]
    , [ `ParameterChanged`, `onParameter` ]
    , [ `ProcessMIDI`, `onProcess` ]
    , [ `HandleMIDI`, `onMIDI` ]
    , [ `Reset`, `onReset` ]
    , [ `Idle`, `onIdle` ]
    ]
  }

  /**
   * [constructor description]
   * @param {Object}  [engine=Scripter]    [description]
   * @param {Map}  [api=new.target.API] [description]
   * @param {Boolean} [configurable=false] [description]
   */
  constructor (engine= new.target.ENGINE, api = new.target.API, configurable = false) {
    this._configurable = configurable
    this._api = new Map([...api])
    this._engine = engine
  }

  /**
   * [deploy description]
   * @param  {Object} plugin [description]
   * @return {Array<string>}        [description]
   */
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
