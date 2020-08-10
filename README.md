- test scripts should be against the compiled library
- uniform named modules style (named)
- convert to module
```
{
  "name": "com.objectkit.scriptex",
  "version": "1.0.0-b1",
  "description": "A micro library and standalone build tool for the Apple Scripter MIDI-FX plugin",
  "main": "index.js",
  "exports": "dist/com.objectkit.scriptex/1.0.0-b1/com.objectkit.scriptex.js"
  "type": "module",
  "engines": {
    "node": ">= 13.0.0"
  },
  "config": {

  },
}
```

## Scenarios

### Test Scenarios

#### TimingInfo
GOAL:
Technician wants to test calculations using TimingInfo

PROBLEM:
Variation to the TimingInfo object state.
