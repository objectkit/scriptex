{
  Scriptex
  Scripter
  Plugin
} = require(SCRIPTEX_TEST)

describe "Scriptex", ->

  Help =
    checkEngine: ->
      mockEngine = {}
      mockPlugin = {}
      # does not have #engine
      new Scriptex(mockEngine).deploy(mockPlugin)
      expect(mockPlugin).property("engine").eql(mockEngine)

    runDeployMethod: (engineKey, pluginKey) ->
      mockEngine = {}
      mockPlugin = {[pluginKey]: ->}
      scriptex = new Scriptex(mockEngine)
      returned = scriptex.deploy(mockPlugin)
      expect(returned).to.be.instanceof(Array).with.lengthOf(1)
      expect(returned[0]).to.eql(engineKey)
      # TODO method invoke
      return

    runDeployField: (engineKey, pluginKey) ->
      mockValue = uuid()
      mockPlugin = { [pluginKey]: mockValue }
      mockEngine = { }
      fixture = new Scriptex(mockEngine)
      returned = fixture.deploy(mockPlugin)
      expect(returned).to.be.instanceof(Array).with.lengthOf(1)
      expect(returned[0]).to.eql(engineKey)
      # TODO field access
      return

    runDeploy: (engine, plugin) ->
      new Scriptex(engine).deploy(plugin)

  describe "#engine", ->
    context "Given a new Scriptex instance has been constructed", ->
      context "And no engine parameter was provided", ->
        specify "Then #engine is set to Scripter", ->
          mockEngine = undefined
          expect(new Scriptex(mockEngine)).property("engine").eql(Scripter)
          return
        return
      context "And an engine parameter was specified", ->
        specify "Then #engine is set to the engine parameter", ->
          mockEngine = {}
          expect(new Scriptex(mockEngine)).property("engine").eql(mockEngine)
          return
        return
      return
    return
  describe "#deploy(plugin, customisable=false)", ->
    context "Given Scriptex has deployed Plugin to #engine", ->
      specify "Then Plugin#engine is set to Scriptex#engine", ->
        Help.checkEngine()
        return
      context "When Plugin#needsTiming is a field", ->
        specify "Then #engine.NeedsTimingInfo is that fields delegate", ->
          Help.runDeployField("NeedsTimingInfo", "needsTiming")
          return
        return
      context "When Plugin#resetParameters is a field", ->
        specify "Then #engine.ResetParameterDefaults is that fields delegate", ->
          Help.runDeployField("ResetParameterDefaults", "resetParameters")
          return
        return
      context "When Plugin#parameters is a field", ->
        specify "Then #engine.PluginParameters is that fields delegate", ->
          Help.runDeployField("PluginParameters", "parameters")
          return
        return
      context "When Plugin#handleMIDI is a method", ->
        specify "Then #engine.HandleMIDI is that methods delegate", ->
          Help.runDeployMethod("HandleMIDI", "handleMIDI")
          return
        return
      context "When Plugin#handleProcess is a method", ->
        specify "Then #engine.ProcessMIDI is that methods delegate", ->
          Help.runDeployMethod("ProcessMIDI", "handleProcess")
          return
        return
      context "When Plugin#handleParameter is a method", ->
        specify "Then #engine.ParameterChanged is that methods delegate", ->
          Help.runDeployMethod("ParameterChanged", "handleParameter")
          return
        return
      context "When Plugin#handleIdle is a method", ->
        specify "Then #engine.Idle is that methods delegate", ->
          Help.runDeployMethod("Idle", "handleIdle")
          return
        return
      context "When Plugin#handleReset is a method", ->
        specify "Then #engine.Reset is that methods delegate", ->
          Help.runDeployMethod("Reset", "handleReset")
          return
        return
      return
    return
  return
