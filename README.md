# Scriptex
**PRE-RELEASE**
> A microlib and metaplugin for the Scripter MIDI-FX Plugin.

## Quick Start
```js
/* Quickly prototype MIDI processors with bespoke classes */
class Microtone extends GenericPlugin {

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
<img width="25%" src="https://user-images.githubusercontent.com/1374645/94087846-afbed700-fe06-11ea-9153-4d7b558f404f.png" >

###### Code Editor view
<img width="25%" src="https://user-images.githubusercontent.com/1374645/94087540-eea05d00-fe05-11ea-8efa-4897c23d8a41.png">

[Visit the docs](https://objectkit.github.io/scriptex)

## Requirements
- Logic Pro X 10.5.0+ _or_ Mainstage 3.4+
- macOS Catalina

## Getting Started

### Edit-In-Place Workflow
- Download the [latest release](https://github.com/objectkit/scriptex/releases/latest)
- Create a new Logic Pro X or Mainstage project
- Add Scripter as a MIDI plugin a new instrument strip
- Press `Open Script in Editor`
- Add the compressed content of the Scriptex library (2kb) to `Code Editor`
- Save that as a template preset named "Scriptex-1.0.0-rc4"

### IDE Workflow
[Available with 1.0.0 release]
```bash
npm i @objectkit/scriptex
```

## License
[Apache-2.0](https://opensource.org/licenses/Apache-2.0) © ObjectKit 2020
