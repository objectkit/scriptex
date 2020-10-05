import Scripter from "com/objectkit/scriptex/system/Scripter"

/**
 * @classDesc
 * Scriptex is a metaplugin loader for the Scripter MIDI-FX runtime.
 *
 * @see [Plugin]{@link Plugin}
 * @see [DefaultPlugin]{@link DefaultPlugin}
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
    /** @todo (0, eval)(`this`) */
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
  static get API () {
    return [
      [ `NeedsTimingInfo`, `needsTiming`]
    , [ `ResetParameterDefaults`, `needsDefaults`]
    , [ `PluginParameters`, `params`]
    , [ `HandleMIDI`, `onMidi`]
    , [ `ProcessMIDI`, `onProcess`]
    , [ `ParameterChanged`, `onParam`]
    , [ `Reset`, `onReset`]
    , [ `Idle`, `onIdle`]
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
  constructor (system= new.target.SYSTEM, api= new.target.API, configurable=false) {
    this._system= system
    this._api= new Map([...api])
    this._configurable= configurable
  }

  /**
   * Deploy a plugin to the Scripter runtime by integrating appropriate properties with
   * the Scripter API.
   *
   * @param  {Object} plugin The plugin instance to deploy.
   * @return {Array<string>} An enumeration of the Scripter integration properties.
   * @see [API]{@link Scriptex.API}
   */
  deploy (plugin) {
    /* a property stash */
    let mem= null
    /* all Scripter property keys that have been integrated with the plugin */
    let api= []
    /* a reference to the system that the plugin as been deployed to */
    let sys= (plugin.system = this._system)
    /* define a propetyu on an object */
    let def= (target, key, val, atr=`value`, configurable=this._configurable) =>
      Reflect.defineProperty(target, key, { [atr]: val, configurable} )
    /* define a plugin accessor delegate on Scripter */
    let get= (systemKey, pluginKey) =>
      def(plugin, pluginKey, mem, `value`, true)
        && def(sys, systemKey, () => plugin[pluginKey], `get`)
    /* define a plugin method delegate on Scripter */
    let fun = (systemKey, pluginKey) =>
      (typeof(mem) === `function`)
        && def(sys, systemKey, (...args) => plugin[pluginKey](...args))
    /* integrate the plugin with Scripter */
    let put= (pluginKey, systemKey) =>
      (mem = plugin[pluginKey], pluginKey in plugin)
        && (fun(systemKey, pluginKey) || get(systemKey, pluginKey))
          && api.push(systemKey)
    /* start integrating */
    this._api.forEach(put)
    /* return the manifest */
    return api
  }
}

export default Scriptex
