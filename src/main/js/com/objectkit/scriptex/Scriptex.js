import Scripter from "com/objectkit/scriptex/system/Scripter"

class Scriptex {

  /**
   * A reference to Scripter.
   *
   * NOTE: Spying/stubbing this property is useful for IDE centered plugin test cycles.
   *
   * @type {Object}
   * @see [Scripter]{@link Scripter}
   */
  static get SYSTEM() {
    return Scripter
  }

  /**
   * The default Scripter/Scriptex integration API.
   *
   * | Scripter               | Scriptex      |
   * |------------------------|---------------|
   * | PluginParameters       | params        |
   * | NeedsTimingInfo        | needsTiming   |
   * | ResetParameterDefaults | needsDefaults |
   * | ParameterChanged       | onParam       |
   * | ProcessMIDI            | onProcess     |
   * | HandleMIDI             | onMidi        |
   * | Reset                  | onReset       |
   * | Idle                   | onIdle        |
   *
   * @type {Map<string, string>}
   */
  static get API() {
   return [
      [ `NeedsTimingInfo`, `needsTiming` ]
    , [ `ResetParameterDefaults`, `needsDefaults` ]
    , [ `PluginParameters`, `params` ]
    , [ `ParameterChanged`, `onParam` ]
    , [ `ProcessMIDI`, `onProcess` ]
    , [ `HandleMIDI`, `onMidi` ]
    , [ `Reset`, `onReset` ]
    , [ `Idle`, `onIdle` ]
    ]
  }

  /**
   * Create a new Scripter instance.
   *
   * @param {Object}  [system=Scripter] The integration environment to use.
   * @param {Map}  [api=new.target.API] The plugin integration API to use.
   * @param {Boolean} [configurable=false] Define integration properties as configurable or not.
   * @see [Scriptex.API]{@link Scriptex.API}
   * @see [Scriptex.SYSTEM]{@link Scriptex.SYSTEM}
   * @see [Object.defineProperty]{@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/defineProperty#Description}
   */
  constructor (system= new.target.SYSTEM, api = new.target.API, configurable = false) {
    this._configurable = configurable
    this._api = new Map([...api])
    this._engine = system
  }

  /**
   * [deploy description]
   * @param  {Object} plugin The plugin instance to deploy.
   * @return {Array<string>} An enumeration of the Scripter integration properties.
   */
  deploy(plugin) {

    let api = []

    let ngn = plugin.system = this._engine

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
