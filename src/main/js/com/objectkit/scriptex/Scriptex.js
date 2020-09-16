import Scripter from "com/objectkit/scriptex/engine/Scripter"

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
  static get ENGINE() {
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
  static get INTERFACE() {
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
   * @param {Object}  [engine=Scripter] The integration environment to use.
   * @param {Map}  [iface=new.target.INTERFACE] The plugin integration INTERFACE to use.
   * @param {Boolean} [configurable=false] Define integration properties as configurable or not.
   * @see [Scriptex.INTERFACE]{@link Scriptex.INTERFACE}
   * @see [Scriptex.ENGINE]{@link Scriptex.ENGINE}
   * @see [Object.defineProperty]{@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/defineProperty#Description}
   */
  constructor (engine= new.target.ENGINE, iface = new.target.INTERFACE, configurable = false) {
    this._engine = engine
    this._interface = new Map([...iface])
    this._configurable = configurable
  }

  /**
   * Deploy a plugin to the Scripter runtime, comparing its methods and proeprties to those of the
   * Scriptex.INTERFACE and binding them to the Scripter API as appropriate.
   *
   * @param  {Object} plugin The plugin instance to deploy.
   * @return {Array<string>} An enumeration of the Scripter integration properties.
   * @see [INTERFACE]{@link Scriptex.INTERFACE}
   */
  deploy(plugin) {
    /* the integration manifest that list all Scripter keys involved */
    let api = []
    /* a refernce to the engine that the plugin as been deploed to */
    let ngn = plugin.engine = this._engine
    /* define an object property */
    let def = (obj, key, val, tag, configurable = this._configurable) =>
      Reflect.defineProperty(obj, key, {configurable, [tag]: val })
    /* define a method on Scripter */
    let fun = (pluginKey, engineKey) =>
      typeof(plugin[pluginKey]) === `function`
        && def(ngn, engineKey, (...args) => plugin[pluginKey](...args), `value`)
    /* define an accessor on Scripter */
    let get = (pluginKey, engineKey) =>
      pluginKey in plugin
        && def(plugin, pluginKey, plugin[pluginKey], `value`, true)
          && def(ngn, engineKey, () => plugin[pluginKey], `get`)
    /* integrate the plugin with Scripter */
    for (let [engineKey, pluginKey] of this._interface)
      (fun(pluginKey, engineKey) || get(pluginKey, engineKey))
        && api.push(engineKey)
    /* return the manifest */
    return api
  }
}

export default Scriptex
