import Scriptex from "com/objectkit/scriptex/Scriptex"
import Scripter from "com/objectkit/scriptex/engine/Scripter"

class Plugin {

  /* NOTE purposeful arrangement of parameters - configurable option is runtime option */
  static deploy (configurable, engine, api) {
    return new Scriptex(engine, configurable, api).deploy(new this())
  }

}

export default Plugin
