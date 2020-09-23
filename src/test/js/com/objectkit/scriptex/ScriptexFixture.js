import ScripterFixture from "com/objectkit/scriptex/system/ScripterFixture"
import Scriptex from "com/objectkit/scriptex/Scriptex"

export default class ScriptexFixture extends Scriptex {
  constructor (configurable, api) {
    super(configurable, api, new ScripterFixture())
  }
}