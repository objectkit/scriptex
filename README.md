# Scriptex
> A micro library for Scripter MIDI-FX plugins.

###### Example
```js
/* location: Scripter Code Editor */
/* minified scriptex library >here<... */

class PitchModifier extends PluginTemplate {

  /* Scripter.NeedsTimingInfo */
  get needsTiming () {
    return true
  }

  /* Scripter.PluginParameters */
  get params () {
    return [
      {
        ID: `semitones`
      , type: `lin`
      , name: `Semitones`
      , minValue: -12
      , maxValue: 12
      , defaultValue: 0
      , numberOfSteps: 24
      }
    ]
  }

  /* intercept changes to the "Semitones" parameter */
  set semitones (semitones) {
    if (semitones !== this._semitones) {
      this.midi.allNotesOff()
      this._semitones = semitones
    }
  }

  /* exclusively manage NoteOn and NoteOff events */
  /** @override */
  onNote (noteOnOrOff) {
    noteOnOrOff.pitch += this._semitones
    return super.onNote(noteOnOrOff)
  }
}

/* Deploy the plugin and trace details of the linked configuration to console */
PitchModifier.deploy()
  .forEach(Trace)

```
###### Output
```bash
***Creating a new MIDI engine with script***

Evaluating MIDI-processing script...
Script evaluated successfully!

NeedsTimingInfo
PluginParameters
ParameterChanged
HandleMIDI
```

### Compatability
Logic Pro X 10.4.5 (TBC)

### How to use

#### Code Editor
- Add a Scripter MIDI-FX plugin to an instrument strip
- Press `Open Script in Editor` to open `Code Editor`
- Paste the contents of "com.objectkit.scriptex-global.js" into `Code Editor`
- Save the empty preset as "Scriptex 1.0.0"

#### IDE
- Download the package
  `npm i -d com.objectkit.scriptex`
- Incorporate module into your projects build tool to build and test scripts.
