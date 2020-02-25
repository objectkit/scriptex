import Plugin from "com/objectkit/scriptex/plugin/Plugin"

export default class PluginFixture extends Plugin {

  get needsTiming () { }

  get resetParameters () { }

  get parameters () { }

  handleMIDI (midi) {}

  handleProcess () {}

  handleParameter (index, data) {}

  handleReset () {}

  handleIdle () {}

}
