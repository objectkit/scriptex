import Scriptex from "com/objectkit/scriptex/Scriptex"
import Scripter from "com/objectkit/scriptex/engine/Scripter"

class Plugin {
  static get API () {
    return Scriptex.API
  }

  /* NOTE purposeful arrangement of parameters - configurable option is runtime option */
  static deploy (configurable, api=this.API, engine) {
    return new Scriptex(configurable, api, engine).deploy(new this())
  }

}

export default Plugin
