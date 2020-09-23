import Scriptex from "com/objectkit/scriptex/Scriptex"

/** @class */
class Plugin {

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
   * @param  {Object}  [engine=Scripter]
   * @param  {Boolean} [configurable=false]
   * @param  {...*}  [ctorArgs=[]]
   *  Any arguments to pass to Plugin subclass constructors.
   * @return {Array<string>}
   *  An enumeration of the Scripter integrations
   * @see [Scriptex]{@link Scriptex#deploy}
   */
  static deploy (engine=Scriptex.SYSTEM, configurable=false, ...ctorArgs) {
    let deployee = new this(...ctorArgs)
    let deployer = new Scriptex(engine, this.API, configurable)
    return deployer.deploy(deployee)
  }

}

export default Plugin
