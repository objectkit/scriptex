import Scripter from "com/objectkit/scriptex/engine/Scripter"

export default class Scriptex {

  /* @protected Map<String,String>*/
  static getDeploymentMethodMap_ () {
    return {
      "HandleMIDI": "handleMIDI"
    , "ProcessMIDI": "handleProcess"
    , "ParameterChanged": "handleParameter"
    , "Idle": "handleIdle"
    , "Reset": "handleReset"
    }
  }

  /* @protected Map<String,String>*/
  static getDeploymentFieldMap_ () {
    return {
      "NeedsTimingInfo": "needsTiming"
    , "ResetParameterDefaults": "resetParameters"
    , "PluginParameters": "parameters"
    }
  }

  /*
   * [constructor description]
   * @param {Object} [engine=Scripter] [description]
   * @param {Object} [fieldMap=Map<String,String>] [description]
   * @param {Object} [methodMap=Map<String,String>] [description]
   * @constructor
   */
  constructor(engine=Scripter, fieldMap=new.target.getDeploymentFieldMap_(), methodMap=new.target.getDeploymentMethodMap_()) {
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
    /*
      Provide the opportunity for the Plugin to provide its own engine context
      Bootstrap the plugin by setting its engine for all other cases
      @example
         // setting up a test
         let testEngine = new ScripterFixture()
         Reflect.defineProperty(ProductionPlugin.prototype, "engine", () => testEngine)
         plugin = ProductionPlugin.deploy()
         engine = plugin.engine
         expect(engine).eql(testEngine)

      @type {Object}
     */
    let ngn = ( plugin.engine = this.engine_ )
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
      // when the plugin has the property
      pluginKey in plugin
        // ensure the property is defined as a data property
        && def(plugin, pluginKey, plugin[pluginKey], `value`, true)
          // define the delegate accessor for the plugin property
          && def(ngn, engineKey, () => plugin[pluginKey], `get`)
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
        && def(ngn, engineKey, (...args) => plugin[pluginKey](...args), `value`)
          && api.push(engineKey)

    /* define field delegates */
    for (let [engineKey, pluginKey] of this.fieldMap_)
      get(engineKey, pluginKey)

    /* define method delegates */
    for (let [engineKey,pluginKey] of this.methodMap_)
      fun(engineKey, pluginKey)

    /* return the added engine property keys */
    return api
  }
}
