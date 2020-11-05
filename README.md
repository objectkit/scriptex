# Scriptex
**1.0.0-rc**
> A metaplugin and micro library for the Scripter MIDI-FX Plugin.

Scriptex is a thin [ES6](http://exploringjs.com/es6.html) [wrapper](https://en.wikipedia.org/wiki/Wrapper_library) that uses [dynamic binding](https://github.com/objectkit/scriptex/blob/master/src/main/js/com/objectkit/scriptex/Scriptex.js#L80) to link custom plugin keys to  the [official Scripter API](https://support.apple.com/en-gb/guide/logicpro/lgce728c68f6/mac).

## API
| [Scriptex](https://github.com/objectkit/scriptex/blob/master/src/main/js/com/objectkit/scriptex/Scriptex.js#L41)      | Scripter               |
|---------------|------------------------|
| parameters    | PluginParameters       |
| needsTiming   | NeedsTimingInfo        |
| needsDefaults | ResetParameterDefaults |
| onParameter   | ParameterChanged       |
| onProcess     | ProcessMIDI            |
| onMIDI        | HandleMIDI             |
| onReset       | Reset                  |
| onIdle        | Idle                   |

## Example
```js
import { Plugin } from "@objectkit/scriptex"

/* conversion metric between pitch bend units and cents */
const PITCH_BEND_UNITS_PER_CENT= 40.96

/* extend from minimal Plugin class to have access to the static deploy method */
class Microtuner extends Plugin {

  /** @lends Scripter.PluginParameters */
  get parameters () {
    return [{
      ID: `microtuning`
      , name: ` m i c r o t u n e r `
      , type: `lin`
      , unit: `\u00A2`
      , minValue: -100
      , maxValue: 100
      , numberOfSteps: 200
      , defaultValue: 0
    }]
  }

  /** @lends Scripter.ParameterChanged */
  onParameter (key, val) {
    /* treat the plugin instance as a model view */
    this[this.parameters[key].ID]= val
  }

  /** @lends Scripter.Reset */
  onReset () {
    /* access Scripter by global or by #system reference */
    this.system.UpdatePluginParameters()
    return
  }

  /* intercept changes to the "microtuning" parameter */
  set microtuning (cents) {
    const units= ( PITCH_BEND_UNITS_PER_CENT * cents )
    this.applyPitchbend(units)
    return
  }

  /* send a pitch bend each time the slider moves */
  applyPitchbend (units) {
    const bend= new PitchBend()
    bend.value= units
    bend.send()
    return
  }
}

export { Microtuner }
```
Checkout the [scriptex.plugin.microtuner](https://github.com/objectkit/scriptex.plugin.microtuner) project for a functional example that also uses the companion [@objectkit/scriptex.mock](https://github.com/objectkit/scriptex.mock) library to test the plugin in a virtual Scripter environment or [visit the docs](https://objectkit.github.io/scriptex).

###### Scripter plugin view.
<img src="https://user-images.githubusercontent.com/1374645/98279523-f40ace80-1f91-11eb-9ae6-60bf70352792.png" >

###### Code Editor view
<img src="https://user-images.githubusercontent.com/1374645/98279482-e9503980-1f91-11eb-8395-1246f62e8423.png">

## Requirements
- Familiarity with [ECMAScript 6](https://exploringjs.com/es6/)
- Familiarity with [NodeJS](https://nodejs.org/en/download/package-manager/#macos)
- Familiarity with the **Scripter MIDI-FX Plugin** ( [Logic Pro X](https://support.apple.com/en-gb/guide/logicpro/lgce728c68f6/mac) | [Mainstage ](https://help.apple.com/mainstage/mac/3.4/#/lgce728c68f6))
- Logic Pro X 10.5.0+ _or_ Mainstage 3.4+
- macOS 10.14+ Mojave or higher

## Getting Started
Scriptex has been designed to support two workflows.
### Code Editor Workflow
- Download the [latest scriptex preset](https://unpkg.com/@objectkit/scriptex)
- Create a new Logic Pro X or Mainstage project
- Add Scripter as a MIDI plugin a new instrument strip
- Press `Open Script in Editor`
- Add the compressed content of the Scriptex library (2kb) to `Code Editor`
- Save the preset as "Scriptex-1.0.0-rc.6"
- Use this preset as a template for making bespoke MIDI processors

### IDE Workflow

#### Follow your own path
- Obtain an [IDE](https://atom.io) of your choice
- Create a new [NodeJS project](https://developer.mozilla.org/en-US/docs/Learn/Server-side/Express_Nodejs/development_environment)
- Add the [Scriptex package](https://www.npmjs.com/package/@objectkit/scriptex) as an [NPM package dependency](https://www.npmjs.com/search?q=scriptex)
  ```bash
  npm i -D @objectkit/scriptex
  ```
- Do what you need to do to develop your own plugins.
  ```js
  import { Plugin } from "@objeckit/scriptex"
  class MIDITrace extends Plugin {
    onMIDI (event) {
      event.trace()
      event.send()
    }
  }
  export { MIDITrace }
  ```

#### Follow a designed path
Checkout the [standalone project template](https://github.com/objectkit/scriptex.plugin.project.template) and take advantage of the incorporated direct to pasteboard build tool helper and ready to use testing environment.

## License
[Apache-2.0](https://opensource.org/licenses/Apache-2.0) © ObjectKit 2020

## Donation
[![paypal](https://www.paypalobjects.com/en_US/i/btn/btn_donateCC_LG.gif)](https://www.paypal.com/paypalme/objectkit)
