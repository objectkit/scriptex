import `com/objectkit/scriptex/Scriptex`

export default class Plugin {
  static deploy (system=void(0)) {
    let deployee = Reflect.construct(this, [])
    let deployer = new Scriptex(system)
    let deployed = deployer.deploy(deployee)
    return deployer.deploy(deployee)
  }
}
