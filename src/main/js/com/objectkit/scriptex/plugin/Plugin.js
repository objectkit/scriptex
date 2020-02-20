import Scriptex from "com/objectkit/scriptex/Scriptex"

export default class Plugin {
  static deploy (engine=undefined, customisable=undefined) {
    return new Scriptex(engine).deploy(new this(), customisable)
  }
}
