import Scriptex from "com/objectkit/scriptex/Scriptex"

/** @class */
class Processor {

  /**
   * The Scripter/Scriptex API that the Processor will conform to.
   * The default API is Scriptex.API.
   * Subclasses can return a list of their own bindings for custom integrations
   * @example
   *  class CustomPlugin extends Processor {
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
   *    // @alias Scripter.PluginParameters
   *    get views () {
   *      return [
   *        // parameter definintions
   *      ]
   *    }
   *
   *    // @alias Scripter.ResetParameterDefaults
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
   * @param  {Object}  [system=Scripter]
   * @param  {Boolean} [configurable=false]
   * @param  {...*}  [ctorArgs=[]]
   *  Any arguments to pass to Processor subclass constructors.
   * @return {Array<string>}
   *  An enumeration of the Scripter integrations
   * @see [Scriptex]{@link Scriptex#deploy}
   */
  static deploy (system=Scriptex.SYSTEM, configurable=false, ...ctorArgs) {
    let deployee = new this(...ctorArgs)
    let deployer = new Scriptex(system, this.API, configurable)
    return deployer.deploy(deployee)
  }
}

export default Processor
