import `com/objectkit/scriptex/system/Scripter`

export default class Scriptex {
  constructor (system=Scripter) {
    this.system = system
  }
  deploy (plugin) {
    throw new Error(`NotImplemented`)
  }
}
