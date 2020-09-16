import Scriptex from "com/objectkit/scriptex/Scriptex"

/** @class */
class Plugin {

  /**
   * The Scripter/Scriptex interface that the Plugin will conform to.
   * The default interface is Scriptex.INTERFACE.
   * Subclasses can return a list of their own bindings for custom integrations
   * @example
   *  class CustomPlugin extends Plugin {
   *    // @override
   *    static get INTERFACE () {
   *      return [
   *        ...super.INTERFACE
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
   *    // as defined in Scriptex.INTERFACE, available via super.INTERFACE in example
   *    onMidi (midi) {
   *      midi.send()
   *    }
   *  }
   *
   *  Trace(CustomPlugin.deploy()) // [ParameterChanged, ResetParameterDefaults, PluginParameters]
   *
   * @type {Map<string, string>}
   * @see [Scriptex.INTERFACE]{@link Scriptex.INTERFACE}
   */
  static get INTERFACE () {
    return Scriptex.INTERFACE
  }

  /**
   * Instantiate and integrate a new plugin with the Scripter environment.
   *
   * @param  {Object}  [engine=Scripter]
   * @param  {Boolean} [configurable=false]
   * @param  {...*}  [ctorArgs=[]]
   *  Any arguments to pass to Plugin subclass constructors.
   * @return {Array<string>}
   *  An enumeration of the Scripter integrations
   * @see [Scriptex]{@link Scriptex#deploy}
   */
  static deploy (engine=Scriptex.ENGINE, configurable=false, ...ctorArgs) {
    let deployee = new this(...ctorArgs)
    let deployer = new Scriptex(engine, this.INTERFACE, configurable)
    return deployer.deploy(deployee)
  }

}

export default Plugin
