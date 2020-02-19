{ Scriptex, ScripterFixture } = require(SCRIPTEX_TEST)

`
class ScriptexFixture extends Scriptex {
  constructor () {
    super(new ScripterFixture())
  }
}
`

module.export = ScriptexFixture
