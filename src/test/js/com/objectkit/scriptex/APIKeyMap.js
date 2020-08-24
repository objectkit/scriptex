import Scriptex from "com/objectkit/scriptex/Scriptex"

class APIKeyMap extends Map {
  constructor () {
    super(Scriptex.API)
  }

  getScripterKeys () {
    return Array.from(this.keys())
  }

  getScriptexKeys () {
    return Array.from(this.values())
  }
}

export default APIKeyMap
