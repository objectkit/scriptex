# Scriptex
> A micro library for Scripter MIDI-FX plugins.

###### Source
```js
/* @file path/to/ScripterFacade.js */
import { Plugin } from "com.objectkit.scriptex"

class ScripterFacade extends Plugin {

  /* @alias Scripter.ResetParameterDefaults */
  get needsDefaults () { }

  /* @alias Scripter.NeedsTimingInfo */
  get needsTiming () { }  

  /* @alias Scripter.PluginParameters */
  get params () { }

  /* @alias Scripter.HandleMIDI */
  onMidi (midi) { }

  /* @alias Scripter.Idle */
  onIdle () { }  

  /* @alias Scripter.ParameterChanged */
  onParam (key, val) { }

  /* @alias Scripter.ProcessMIDI */
  onProcess () { }

  /* @alias Scripter.Reset */
  onReset () { }
}

export default Facade
```

```js
/* @file main.js */
import ScripterFacade from "path/to/ScripterFacade"
import { Scripter } from "com.objectkit.scriptex"

/* launch the plugin */
ScripterFacade.deploy()
  /* and trace the returned list of Scripter deployment keys */
  .forEach(Scripter.Trace)
```
<!-- @TODO insert generated output rather than (close) simulation of a build file -->
###### Build
```js
/* @file out/scripterfacade.min.js */
const e=(0,eval)("this");class Scriptex{static get ENGINE(){return e}static get API(){return[["NeedsTimingInfo","needsTiming"],["ResetParameterDefaults","needsDefaults"],["PluginParameters","parameters"],["ParameterChanged","onParameter"],["ProcessMIDI","onProcess"],["HandleMIDI","onMIDI"],["Reset","onReset"],["Idle","onIdle"]]}constructor(e=new.target.ENGINE,t=new.target.API,s=!1){this.t=s,this.s=new Map([...t]),this.i=e}deploy(e){let t=[],s=e.engine=this.i,n=(e,t,s,n,r=this.t)=>Reflect.defineProperty(e,t,{configurable:r,[n]:s}),r=(t,r)=>"function"==typeof e[t]&&n(s,r,(...s)=>e[t](...s),"value"),a=(t,r)=>t in e&&n(e,t,e[t],"value",!0)&&n(s,r,()=>e[t],"get");for(let[i,c]of this.s)(r(c,i)||a(c,i))&&t.push(i);return t}}class Plugin{static get API(){return Scriptex.API}static deploy(e=Scriptex.ENGINE,t=!1,...s){let n=new this(...s);return new Scriptex(e,this.API,t).deploy(n)}}class ScripterFacade extends Plugin{get needsDefaults(){}get needsTiming(){}get params(){}onMIDI(e){}onIdle(){}onParam(e,t){}onProcess(){}onReset(){}};ScripterFacade.deploy().forEach(e.Trace)
```

###### Script Editor Output
```
***Creating a new MIDI engine with script***

Evaluating MIDI-processing script...
Script evaluated successfully!

NeedsTimingInfo
ResetParameterDefaults
PluginParameters
ProcessMIDI
HandleMIDI
ParameterChanged
Reset
Idle
>
```
