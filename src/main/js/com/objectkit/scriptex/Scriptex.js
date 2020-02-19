import Scripter from "com/objectkit/scriptex/engine/Scripter"

export default class Scriptex {

  /*
   * [constructor description]
   * @param {Object} [engine=Scripter] [description]
   * @constructor
   */
  constructor(engine=Scripter) {
    this.engine = engine
  }

  /*
   * [deploy description]
   * @param  {Object} plugin [description]
   * @param  {boolean} [customisable=false] [description]
   * @return {Array<string>} [description]
   */
  deploy (plugin, customisable=false) {
    /* @type {Object} */
    let engine = ( plugin.engine = this.engine )
    /* @type {Array<string>} */
    let api = []
    /*
      Define a property on an object
      @param {Object} target
      @param {string} key
      @param {*} val
      @param {string} attribute
      @param {boolean} configurable
      @return {boolean}
     */
    let def = (target, key, val, attribute, configurable=customisable) =>
      Reflect.defineProperty(target, key, { configurable, [ attribute ] : val } )
    /*
      Given plugin has a property for pluginKey
      And plugin[pluginKey] is redefined as data property
      And engine[engineKey] is defined as its field delegate
      Then key is added to the API

      @param {string} engineKey
      @param {string} pluginKey
      @return {number}
     */
    let get = (engineKey, pluginKey) =>
      pluginKey in plugin
        && def(plugin, pluginKey, plugin[pluginKey], `value`, true)
          && def(engine, engineKey, () => plugin[pluginKey], `get`)
            && api.push(engineKey)
    /*
      Given plugin[pluginKey] is a method
      When engine[engineKey] is defined as its method delegate
      Then key is added to the API

      @param {string} engineKey
      @param {string} pluginKey
      @return {number}
     */
    let fun = (engineKey, pluginKey) =>
      typeof(plugin[pluginKey]) === `function`
        && def(engine, engineKey, (...args) => plugin[pluginKey](...args), `value`)
          && api.push(engineKey)

    /* define field delegates */
    get(`NeedsTimingInfo`, `needsTiming`)
    get(`ResetParameterDefaults`, `resetParameters`)
    get(`PluginParameters`, `parameters`)

    /* define method delegates */
    fun(`HandleMIDI`, `handleMIDI`)
    fun(`ProcessMIDI`, `handleProcess`)
    fun(`ParameterChanged`, `handleParameter`)
    fun(`Idle`, `handleIdle`)
    fun(`Reset`, `handleReset`)

    /* return the added engine property keys */
    return api
  }
}
