import Scripter from "com/objectkit/scriptex/engine/Scripter"

export default class Scriptex {

  /* @protected */
  static getEngine_ () {
    return Scripter
  }

  /* @protected */
  static getFieldMap_ () {
    return new Map(
      [
        ["NeedsTimingInfo", "needsTiming"]
      , ["ResetParameterDefaults", "resetParameters"]
      , ["PluginParameters", "parameters"]
      ]
    )
  }

  /* @protected */
  static getMethodMap_ () {
    return new Map(
      [
        ["HandleMIDI", "handleMIDI"]
      , ["ProcessMIDI", "handleProcess"]
      , ["ParameterChanged", "handleParameter"]
      , ["Idle", "handleIdle"]
      , ["Reset", "handleReset"]
      ]
    )
  }

  /*
   * [constructor description]
   * @param {Object} [engine=Scripter] [description]
   * @param {Object} [fieldMap=Map<String,String>] [description]
   * @param {Object} [methodMap=Map<String,String>] [description]
   * @constructor
   */
  constructor(
    engine = new.target.getEngine_(),
    fieldMap = new.target.getFieldMap_(),
    methodMap = new.target.getMethodMap_()
  )
  {
    /* @protected @type {Object} */
    this.engine_ = engine
    /* @protected @type Map<String,String> */
    this.fieldMap_ = fieldMap
    /* @protected @type Map<String,String> */
    this.methodMap_ = methodMap
  }

  /*
   * [deploy description]
   * @param  {Object} plugin [description]
   * @param  {boolean} [customisable=false] [description]
   * @return {Array<string>} [description]
   */
  deploy (plugin, customisable=false) {
    /* @type Array<string> */
    let api = []
    /* @type Object */
    let ngn = ( plugin.engine = this.engine_ )
    /* define a property on an object */
    let def = (target, key, val, attribute, configurable=customisable) =>
      Reflect.defineProperty(target, key, { configurable, [ attribute ] : val } )

    /* define field delegates */
    for (let [engineKey, pluginKey] of this.fieldMap_)
      pluginKey in plugin
        && def(plugin, pluginKey, plugin[pluginKey], `value`, true)
          && def(ngn, engineKey, () => plugin[pluginKey], `get`)
            && api.push(engineKey)

    /* define method delegates */
    for (let [engineKey,pluginKey] of this.methodMap_)
      typeof(plugin[pluginKey]) === `function`
        && def(ngn, engineKey, (...args) => plugin[pluginKey](...args), `value`)
          && api.push(engineKey)

    /* return the added engine property keys */
    return api
  }
}
