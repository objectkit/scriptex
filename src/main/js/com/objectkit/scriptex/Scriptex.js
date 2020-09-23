import Scripter from "com/objectkit/scriptex/system/Scripter"

/**
 * @classDesc
 * Scriptex is a metaplugin loader for the Scripter MIDI-FX runtime.
 *
 * @see [Plugin]{@link Plugin}
 * @see [GenericPlugin]{@link GenericPlugin}
 */
class Scriptex {

  /**
   * A reference to Scripter.
   *
   * NOTE: Spying/stubbing this property is useful for BDD/TDD tests.
   *
   * @type {Object}
   * @see [Scripter]{@link Scripter}
   */
  static get SYSTEM() {
    return Scripter
  }

  /**
   * The default Scripter/Scriptex integration fields and methods
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
   * @param {Map}  [iface=new.target.API] The plugin integration API to use.
   * @param {Boolean} [configurable=false] Define integration properties as configurable or not.
   * @see [Scriptex.API]{@link Scriptex.API}
   * @see [Scriptex.SYSTEM]{@link Scriptex.SYSTEM}
   * @see [Object.defineProperty]{@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/defineProperty#Description}
   */
  constructor (system= new.target.SYSTEM, iface = new.target.API, configurable = false) {
    this._system = system
    this._interface = new Map([...iface])
    this._configurable = configurable
  }

  /**
   * Deploy a plugin to the Scripter runtime, comparing its methods and proeprties to those of the
   * Scriptex.API and binding them to the Scripter API as appropriate.
   *
   * @param  {Object} plugin The plugin instance to deploy.
   * @return {Array<string>} An enumeration of the Scripter integration properties.
   * @see [API]{@link Scriptex.API}
   */
  deploy(plugin) {
    /* the integration manifest that list all Scripter keys involved */
    let api = []
    /* a reference to the system that the plugin as been deployed to */
    let ngn = plugin.system = this._system
    /* define an object property */
    let def = (obj, key, val, tag, configurable = this._configurable) =>
      Reflect.defineProperty(obj, key, {configurable, [tag]: val })
    /* define a method on Scripter */
    let fun = (pluginKey, systemKey) =>
      typeof(plugin[pluginKey]) === `function`
        && def(ngn, systemKey, (...args) => plugin[pluginKey](...args), `value`)
    /* define an accessor on Scripter */
    let get = (pluginKey, systemKey) =>
      pluginKey in plugin
        && def(plugin, pluginKey, plugin[pluginKey], `value`, true)
          && def(ngn, systemKey, () => plugin[pluginKey], `get`)
    /* integrate the plugin with Scripter */
    for (let [systemKey, pluginKey] of this._interface)
      (fun(pluginKey, systemKey) || get(pluginKey, systemKey))
        && api.push(systemKey)
    /* return the manifest */
    return api
  }
}

export default Scriptex
