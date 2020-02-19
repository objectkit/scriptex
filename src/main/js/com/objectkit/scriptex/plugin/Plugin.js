import Scriptex from "com/objectkit/scriptex/Scriptex"

export default class Plugin {

  static deploy (system=undefined, customisable=undefined) {
    return new Scriptex(system).deploy(new this(), customisable)
  }

  /*

  Opt-in Fields
  -------------

  get needsTiming () { ; }

  get resetParameters () { ; }

  get parameters () {;}

   */



  /*

  Opt-in Methods
  --------------
  
  handleMIDI (midi) { ; }

  handleProcess () { ; }

  handleParameter (index, data) { ; }

  handleReset () { ; }

  handleIdle () { ; }

   */
}
