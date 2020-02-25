import Scriptex from "com/objectkit/scriptex/Scriptex"
import Scripter from "com/objectkit/scriptex/engine/Scripter"

export default class Plugin {
  static deploy (engine=Scripter, customisable=false) {
    return new Scriptex(engine).deploy(new this(), customisable)
  }
}
