import { Scriptex } from "com/objectkit/scriptex/Scriptex"

/** @class */
class Plugin {

  /**
   * Plugins may add an optional static CONFIGURABLE property to influence
   * the configurablility of system properties created by Scriptex during
   * the deployment process. Its primary benefit is for debugging the
   * Scripter environment itself rather than the plugin instance.
   *
   * @example
   *  class SystemDebugPlugin extends Plugin {
   *    //... Scriptex api hooks here
   *  }
   *
   *  // instruct Scriptex to make Scripter properties configurable
   *  SystemDebugPlugin.CONFIGURABLE= true
   *  SystemDebugPlugin.deploy()
   *  // debug Scripter here
   *  // e.g Reflect.deleteProperty(Scripter, `PluginParameters`)
   *
   * As this is to handle transient edge cases, this capacity is not
   * formally implemented here.
   * @static
   * @abstract
   * @see [Plugin.deploy]{@link Plugin.deploy}
   */


  /**
   * The Scripter/Scriptex interface that the Plugin will conform to.
   * The default interface is Scriptex.API.
   * Subclasses can return a list of their own bindings for custom integrations
   * @example
   *  class CustomPlugin extends Plugin {
   *    // @override
   *    static get API () {
   *      return [
   *        ...super.API
   *      , [ `ParameterChanged`, `updateModel` ]
   *      , [ `PluginParameters`, `views`]
   *      , [ `ResetParameterDefaults`, `needsViewResets`]
   *      ]
   *    }
   *
   *    // @lends Scripter.PluginParameters
   *    get views () {
   *      return [
   *        // parameter definintions
   *      ]
   *    }
   *
   *    // @lends Scripter.ResetParameterDefaults
   *    get needsViewResets () {
   *      return true
   *    }
   *
   *    // @alias Scripter.ParameterChanged
   *    updateModel (key, val) {
   *      key = this.views[key].ID && this[key] = val
   *    }
   *
   *    // @alias Scripter.HandleMIDI
   *    // as defined in Scriptex.API, available via super.API in example
   *    onMidi (midi) {
   *      midi.send()
   *    }
   *  }
   *
   *  Trace(CustomPlugin.deploy()) // [ParameterChanged, ResetParameterDefaults, PluginParameters]
   *
   * @type {Map<string, string>}
   * @see [Scriptex.API]{@link Scriptex.API}
   */
  static get API () {
    return Scriptex.API
  }

  /**
   * Instantiate and integrate a new plugin with the Scripter environment.
   *
   * @param  {...*}  [ctorArgs=[]]
   *  Any arguments to pass to Plugin subclass constructors.
   * @return {Array<string>}
   *  An enumeration of the Scripter integrations
   * @see [Scriptex]{@link Scriptex#deploy}
   */
  static deploy (...ctorArgs) {
    const deployee = new this(...ctorArgs)
    const deployer = new Scriptex(Scriptex.SYSTEM, this.API, this.CONFIGURABLE)
    return deployer.deploy(deployee)
  }

  /**
   * Set the plugins system context. This is undertaken by Scriptex during the
   * course of deployment, but can also be of use when unit testing bespoke
   * midi processors.
   *
   * Note that accessing #system before it is set will result in a
   * "SystemAccessFault" being thrown.
   *
   * @type {Scripter|Object}
   * @see {@link #init()}
   * @see {@link Plugin.deploy()}
   */
  set system (system) {
    /* @final property */
    Reflect.defineProperty(this, `system`, { value: system })
    this.init()
  }

  get system () {
    throw new ReferenceError(`SystemAccessFault`)
  }

  /**
   * An initialistion method invoked after #system has been
   * set by Scriptex. Subclasses can override this and define
   * the plugins configuration after construction but before
   * deployment.
   * @abstract
   * @return {void}
   * @see {@link #system}
   */
  init () {}
}

export { Plugin }
