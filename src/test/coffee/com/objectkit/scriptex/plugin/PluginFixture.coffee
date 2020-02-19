###
NOTE: This fixture has been implemented inline to facilitate affect of
property accessors during deployment. See PluginSpec for spies and tests.
###
{ Plugin } = require(SCRIPTEX_TEST)

`
class PluginFixture extends Plugin {

  get needsTiming () { }

  get resetParameters () { }

  get parameters () { }

  handleMIDI (midi) {}

  handleProcess () {}

  handleParameter (index, data) {}

  handleReset () {}

  handleIdle () {}

}
`
module.exports = PluginFixture
