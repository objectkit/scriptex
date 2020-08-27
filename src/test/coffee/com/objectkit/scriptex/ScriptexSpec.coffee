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

      context "When Scriptex#configurable is set to false [default]", ->
        specify "Then #engine properties are final", ->
          Help.testNonConfigurableDeployment()

      context "When Scriptex#configurable is set to true", ->
        specify "Then #engine properties can be deleted", ->
          Help.testConfigurableDeployment()

      context "When plugin#needsTiming is a field", ->
        specify "Then #engine.NeedsTimingInfo becomes its field delegate", ->
          Help.testDeployedField("NeedsTimingInfo", "needsTiming")

      context "When plugin#needsDefaults is a field", ->
        specify "Then #engine.ResetParameterDefaults becomes its field delegate", ->
          Help.testDeployedField("ResetParameterDefaults", "needsDefaults")

      context "When plugin#params is a field", ->
        specify "Then #engine.PluginParameters becomes its field delegate", ->
          Help.testDeployedField("PluginParameters", "params")

      context "When plugin#onMidi is a method", ->
        specify "Then #engine.HandleMIDI becomes its method delegate", ->
          Help.testDeployedMethod("HandleMIDI", "onMidi")

      context "When plugin#onProcess is a method", ->
        specify "Then #engine.ProcessMIDI becomes its method delegate", ->
          Help.testDeployedMethod("ProcessMIDI", "onProcess")

      context "When plugin#onParam is a method", ->
        specify "Then #engine.ParameterChanged becomes its method delegate", ->
          Help.testDeployedMethod("ParameterChanged", "onParam")

      context "When plugin#onIdle is a method", ->
        specify "Then #engine.Idle becomes its method delegate", ->
          Help.testDeployedMethod("Idle", "onIdle")

      context "When plugin#onReset is a method", ->
        specify "Then #engine.Reset becomes its method delegate", ->
          Help.testDeployedMethod("Reset", "onReset")

      specify "Then plugin#engine is set to Scriptex#engine", ->
        Help.testDeployedEngine({})

      specify "Then Scriptex returns a list of binding Scripter keys", ->
        Help.testDeployedAPI()
