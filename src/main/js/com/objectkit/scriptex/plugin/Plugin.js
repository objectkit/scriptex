import { Scriptex } from "com/objectkit/scriptex/Scriptex"

/** @class */
class Plugin {

  /**
   * Instantiate and integrate a new plugin with the Scripter environment.
   *
   * There are three opt-in static Plugin properties to be aware of.
   *
   * - Plugin.API
   * - Plugin.SYSTEM
   * - Plugin.CONFIGURABLE
   *
   * ###### Plugin.API (default: Scriptex.API)
   * Subclasses can add a static API field to return a list of their own
   * bindings for custom integrations.
   *
   * ###### Plugin.SYSTEM (default: Scriptex.SYSTEM i.e. global scope)
   * Primarily for use in test cases, adding a SYSTEM property will influence which
   * object is targeted during deployment.
   *
   * ###### Plugin.CONFIGURABLE (default: false)
   * Subclasses or test classes can add a static CONFIGURABLE field that will
   * define the configurable state of all Scripter/Scriptex integration properties.
   * Though possibly redundant, this is intended be of assistence when debugging complex
   * applications, most likely in the Scripter Code Editor scope rather than test scope.
   *
   * @example <caption>Plugin.API</caption>
   * class CustomPlugin extends Plugin {
   *    // define an alternative to Scriptex.API
   *   static get API () {
   *     return [
   *       // keep most of the original bindings...
   *       ...super.API
   *       // ...and redefine these bindings
   *     , [ `ParameterChanged`, `updateModel` ]
   *     , [ `PluginParameters`, `views`]
   *     , [ `ResetParameterDefaults`, `needsViewResets`]
   *     ]
   *   }
   * }
   *
   * @example <caption>Plugin.CONFIGURABLE</caption>
   * class DebuggablePlugin extends Plugin {
   *   // define an alternative to false
   *   static get CONFIGURABLE () {
   *     return true
   *   }
   * }
   *
   * @example <caption>Plugin.SYSTEM</caption>
   * class Fixture extends Plugin {
   *   // define an alternative to Scriptex.SYSTEM
   *   static get SYSTEM () {
   *     return new VirtualScripter()
   *   }
   * }
   *
   * @final
   * @param  {...*}  [ctorArgs=[]]
   *  Any arguments to pass to Plugin subclass constructors.
   * @return {Array<string>}
   *  An enumeration of the Scripter integrations
   * @see [Scriptex]{@link Scriptex#deploy}
   * @see [Scriptex.API]{@link Scriptex.API}
   * @see [Scriptex.SYSTEM]{@link Scriptex.SYSTEM}
   */
  static deploy (...ctorArgs) {
    return new Scriptex(this.SYSTEM, this.API, this.CONFIGURABLE)
      .deploy(new this(...ctorArgs))
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
    /* for merit during deployment to Scripter - explicit error */
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
