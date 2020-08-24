import Scriptex from "com/objectkit/scriptex/Scriptex"

class Plugin {
  
  static get API () {
    return Scriptex.API
  }

  static deploy (engine, configurable, ...ctorArgs) {
    let deployee = Reflect.construct(this, ctorArgs)
    let deployer = new Scriptex(engine, this.API, configurable)
    return deployer.deploy(deployee)
  }
}

export default Plugin
