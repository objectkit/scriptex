Help = require("./ScriptexSpecHelp")

describe "Scriptex", ->

  describe "Object #engine", ->

    context "Given Scriptex has been instantiated with an engine for testing", ->
      specify "Then Scriptex#engine is set to that engine", ->
        Help.testScriptexEngine()

    context "Given Scriptex has been instantiated *without* an engine for deployment", ->
      specify "Then Scriptex#engine is set to Scripter", ->
        Help.testDefaultScriptexEngine()

  describe "#deploy(plugin):Array<string>", ->

    context "Given Scriptex has deployed a plugin to #engine", ->

      context "When customisable is set to false [default]", ->
        specify "Then #engine properties cannot be deleted", ->
          Help.testNonConfigurableDeployment()

      context "When customisable is set to true", ->
        specify "Then #engine properties can be deleted", ->
          Help.testConfigurableDeployment()

      context "When plugin#needsTiming is a field", ->
        specify "Then #engine.NeedsTimingInfo is that fields delegate", ->
          Help.testDeployedField("NeedsTimingInfo", "needsTiming")

      context "When plugin#resetParameters is a field", ->
        specify "Then #engine.ResetParameterDefaults is that fields delegate", ->
          Help.testDeployedField("ResetParameterDefaults", "resetParameters")

      context "When plugin#parameters is a field", ->
        specify "Then #engine.PluginParameters is that fields delegate", ->
          Help.testDeployedField("PluginParameters", "parameters")

      context "When plugin#handleMIDI is a method", ->
        specify "Then #engine.HandleMIDI is that methods delegate", ->
          Help.testDeployedMethod("HandleMIDI", "handleMIDI")

      context "When plugin#handleProcess is a method", ->
        specify "Then #engine.ProcessMIDI is that methods delegate", ->
          Help.testDeployedMethod("ProcessMIDI", "handleProcess")

      context "When plugin#handleParameter is a method", ->
        specify "Then #engine.ParameterChanged is that methods delegate", ->
          Help.testDeployedMethod("ParameterChanged", "handleParameter")

      context "When plugin#handleIdle is a method", ->
        specify "Then #engine.Idle is that methods delegate", ->
          Help.testDeployedMethod("Idle", "handleIdle")

      context "When plugin#handleReset is a method", ->
        specify "Then #engine.Reset is that methods delegate", ->
          Help.testDeployedMethod("Reset", "handleReset")

      specify "Then plugin#engine is set to Scriptex#engine", ->
        Help.testDeployedEngine({})

      specify "Then Scriptex returns a list of binding Scripter keys", ->
        Help.testDeployedAPI()
