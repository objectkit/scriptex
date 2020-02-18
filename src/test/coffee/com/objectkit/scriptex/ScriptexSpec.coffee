{
  Scriptex
  Scripter
  Plugin
} = require(SCRIPTEX_TEST)

describe "Scriptex", ->

  describe "#deploy(plugin, customisable=false)", ->

    checkEngine = ->
      mockEngine = {}
      mockPlugin = {}
      # does not have #engine
      new Scriptex(mockEngine).deploy(mockPlugin)
      expect(mockPlugin).property("engine").eql(mockEngine)

    runDeploy = (systemKey, pluginKey) ->
      mockEngine = {}
      mockPlugin = {[pluginKey]: ->}
      scriptex = new Scriptex(mockEngine)
      returned = scriptex.deploy(mockPlugin)
      expect(returned).to.be.instanceof(Array).with.lengthOf(1)
      expect(returned[0]).to.eql(systemKey)
      return

    context "Given Scriptex has deployed Plugin to #engine", ->

      specify "Then Plugin#engine is set to Scriptex#engine", ->
        checkEngine()

      context "When Plugin#handleMIDI is a method", ->
        specify "Then #engine.HandleMIDI is that methods delegate", ->
          runDeploy("HandleMIDI", "handleMIDI")

      context "When Plugin#handleProcess is a method", ->
        specify "Then #engine.ProcessMIDI is that methods delegate", ->
          runDeploy("ProcessMIDI", "handleProcess")

      context "When Plugin#handleParameter is a method", ->
        specify "Then #engine.ParameterChanged is that methods delegate", ->
          runDeploy("ParameterChanged", "handleParameter")

      context "When Plugin#handleIdle is a method", ->
        specify "Then #engine.Idle is that methods delegate", ->
          runDeploy("Idle", "handleIdle")

      context "When Plugin#handleReset is a method", ->
        specify "Then #engine.Reset is that methods delegate", ->
          runDeploy("Reset", "handleReset")
