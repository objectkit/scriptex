import Scriptex from "com/objectkit/scriptex/Scriptex"

/** @class */
class Plugin {

  /**
   * The API that the Plugin will conform to.
   * The default API is Scriptex.API.
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
   *    onMIDI (midi) {
   *      midi.send()
   *    }
   *  }
   *
   *  Trace(CustomPlugin.deploy()) // [ParameterChanged, ResetParameterDefaults, PluginParameters]
   * @type {Map<string, string>}
   * @see Scriptex.API
   */
  static get API () {
    return Scriptex.API
  }

  /**
   * [deploy description]
   * Instantiate and integrate a plugin with Scripter in one go.
   * @param  {Object}  [engine=Scripter] [description]
   * @param  {Boolean} [configurable=false]     [description]
   * @param  {...*}  ctorArgs
   *  Any arguments to pass to Plugin subclass constructors.
   * @return {Array<string>}
   *  An enumeration of the Scripter integrations
   * @see Scriptex#deploy
   */
  static deploy (engine=Scriptex.ENGINE, configurable=false, ...ctorArgs) {
    let deployee = new this(...ctorArgs)
    let deployer = new Scriptex(engine, this.API, configurable)
    return deployer.deploy(deployee)
  }
}

export default Plugin
