# Scriptex
**1.0.0-rc.6**
> A metaplugin and microlib for the Scripter MIDI-FX Plugin.

## Quick Start
```js
/* Quickly prototype bespoke MIDI processors */
class Microtone extends DefaultPlugin {

  /** @lends Scripter.NeedsTimingInfo */
  get needsTiming () {
    return false
  }

  /** @lends Scripter.ResetParameterDefaults */
  get needsDefaults () {
    return true
  }

  /** @lends Scripter.PluginParameters */
  get params () {
    return [
      {
        name: `< M i c r o t o n e >`
      , type: `text`
      }
    , {
        ID: `microtone`
      , name: ` `
      , type: `lin`
      , minValue: -8192
      , maxValue: 8191
      , defaultValue: 0
      , numberOfSteps: 16383
      }
    ]
  }

  /* intercept changes to the "microtone" parameter */
  set microtone (val) {
    this.applyMicrotone(val)
  }

  /* send a pitch bend each time the slider moves */
  applyMicrotone (val) {
    const pitchBend = new PitchBend()
    pitchBend.value = val
    this.sendMidi(pitchBend)  
  }
}

/* Deploy the plugin and trace its linked Scripter integration keys to console */
Microtone.deploy().forEach(Trace)
```

###### Scripter plugin view.
<img width="50%" src="https://user-images.githubusercontent.com/1374645/94087846-afbed700-fe06-11ea-9153-4d7b558f404f.png" >

###### Code Editor view
<img width="50%" src="https://user-images.githubusercontent.com/1374645/94087540-eea05d00-fe05-11ea-8efa-4897c23d8a41.png">

[Visit the docs](https://objectkit.github.io/scriptex)

## Requirements
- Familiarity with [ECMAScript 6](https://exploringjs.com/es6/)
- Familiarity with the **Scripter MIDI-FX Plugin** ([Logic Pro X](https://support.apple.com/en-gb/guide/logicpro/lgce728c68f6/mac) | [Mainstage ](https://help.apple.com/mainstage/mac/3.4/#/lgce728c68f6))
- Logic Pro X 10.5.0+ _or_ Mainstage 3.4+
- macOS 10.14+ Mojave or higher

## Getting Started

### Code Editor Workflow
- Download the [latest scriptex preset](https://unpkg.com/@objectkit/scriptex)
- Create a new Logic Pro X or Mainstage project
- Add Scripter as a MIDI plugin a new instrument strip
- Press `Open Script in Editor`
- Add the compressed content of the Scriptex library (2kb) to `Code Editor`
- Save the preset as "Scriptex-1.0.0-rc.6"
- Use this preset as a template for making bespoke MIDI processors

### IDE Workflow
- Obtain an [IDE](https://atom.io) of your choice
- Create a new [NodeJS project](https://developer.mozilla.org/en-US/docs/Learn/Server-side/Express_Nodejs/development_environment)
- Add the [Scriptex package](https://www.npmjs.com/package/@objectkit/scriptex) as an [NPM package dependency](https://www.npmjs.com/search?q=scriptex)
  ```bash
  npm i -D @objectkit/scriptex
  ```
- Import classes as needed
  ```js
  import { Plugin } from "@objeckit/scriptex"
  class MidiTrace extends Plugin {
    onMidi (event) {
      event.trace()
    }
  }
  ```

[standalone project template will coincide with 1.0.0 release]

## License
[Apache-2.0](https://opensource.org/licenses/Apache-2.0) © ObjectKit 2020
