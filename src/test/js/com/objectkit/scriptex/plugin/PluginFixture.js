import Plugin from "com/objectkit/scriptex/plugin/Plugin"
import ScripterFixture from "com/objectkit/scriptex/engine/ScripterFixture"

export default class PluginFixture extends Plugin {

  constructor () {
    super()
    /* defining engine here for testing */
    this.engine = new ScripterFixture()
  }

  get needsTiming () { }

  get resetParameters () { }

  get parameters () { }

  handleMIDI (midi) {}

  handleProcess () {}

  handleParameter (index, data) {}

  handleReset () {}

  handleIdle () {}

}
