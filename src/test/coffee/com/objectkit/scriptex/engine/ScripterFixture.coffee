class ScripterFixture

  ###

  PluginParameters

  NeedsTimingInfo

  ResetParameterDefaults

  HandleMIDI

  ProcessMIDI

  ParameterChanged

  Idle

  Reset

  ###

  GetParameter: (key) ->

  SetParameter: (key, val) ->

  UpdatePluginParameters: ->

  GetTimingInfo: ->

  Trace: (any) ->

  SendMIDIEventAtBeat: (midi, beat) ->

  SendMIDIEventAfterBeats: (midi, beats) ->

  SendMIDIEventAfterMilliseconds: (midi, ms) ->

  SendMIDIEventNow: (midi) ->

module.exports = ScripterFixture
