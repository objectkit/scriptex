import Scripter from "com/objectkit/scriptex/engine/Scripter"

export default class Scriptex {

  constructor(engine=Scripter) {
    this.engine = engine
  }

  deploy (plugin, customisable=false) {
    let api = []
    let def = (target, key, val, attribute, configurable=customisable) =>
      Reflect.defineProperty(target, key, { configurable, [ attribute ] : val } )

    let get = (engineKey, pluginKey) =>
      pluginKey in plugin
        && def(plugin, pluginKey, plugin[pluginKey], `value`, true)
          && def(this.engine, engineKey, () => Reflect.get(plugin, pluginKey), `get`)
            && api.push(engineKey)

    let fun = (engineKey, pluginKey) =>
      typeof(plugin[pluginKey]) === `function`
        && def(this.engine, engineKey, (...args) => Reflect.apply(Reflect.get(plugin, pluginKey), plugin, args))
          && api.push(engineKey)

    plugin.engine = this.engine

    get(`NeedsTimingInfo`, `needsTiming`)
    get(`ResetParameterDefaults`, `resetParameters`)
    get(`PluginParameters`, `parameters`)

    fun(`HandleMIDI`, `handleMIDI`)
    fun(`ProcessMIDI`, `handleProcess`)
    fun(`ParameterChanged`, `handleParameter`)
    fun(`Idle`, `handleIdle`)
    fun(`Reset`, `handleReset`)

    return api
  }
}
