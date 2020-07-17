import Scriptex from "com/objectkit/scriptex/Scriptex"

class Plugin {
  static deploy (...rest) {
    return new Scriptex(...rest).deploy(new this())
  }
}

export default Plugin
