Help = require("./ScriptexSpecHelp")

describe "Scriptex", ->

  describe "Object #system", ->

    context "Given Scriptex has been instantiated with an system for testing", ->
      specify "Then Scriptex#system is set to that system", ->
        Help.testScriptexEngine()

    context "Given Scriptex has been instantiated *without* an system for deployment", ->
      specify "Then Scriptex#system is set to Scripter", ->
        Help.testDefaultScriptexEngine()

  describe "#deploy(plugin):Array<string>", ->

    context "Given Scriptex has deployed a plugin to #system", ->

      context "When Scriptex#configurable is set to false [default]", ->
        specify "Then #system properties are final", ->
          Help.testNonConfigurableDeployment()

      context "When Scriptex#configurable is set to true", ->
        specify "Then #system properties can be deleted", ->
          Help.testConfigurableDeployment()

      context "When plugin#needsTiming is a field", ->
        specify "Then #system.NeedsTimingInfo becomes its field delegate", ->
          Help.testDeployedField("NeedsTimingInfo", "needsTiming")

      context "When plugin#needsDefaults is a field", ->
        specify "Then #system.ResetParameterDefaults becomes its field delegate", ->
          Help.testDeployedField("ResetParameterDefaults", "needsDefaults")

      context "When plugin#params is a field", ->
        specify "Then #system.PluginParameters becomes its field delegate", ->
          Help.testDeployedField("PluginParameters", "params")

      context "When plugin#onMidi is a method", ->
        specify "Then #system.HandleMIDI becomes its method delegate", ->
          Help.testDeployedMethod("HandleMIDI", "onMidi")

      context "When plugin#onProcess is a method", ->
        specify "Then #system.ProcessMIDI becomes its method delegate", ->
          Help.testDeployedMethod("ProcessMIDI", "onProcess")

      context "When plugin#onParam is a method", ->
        specify "Then #system.ParameterChanged becomes its method delegate", ->
          Help.testDeployedMethod("ParameterChanged", "onParam")

      context "When plugin#onIdle is a method", ->
        specify "Then #system.Idle becomes its method delegate", ->
          Help.testDeployedMethod("Idle", "onIdle")

      context "When plugin#onReset is a method", ->
        specify "Then #system.Reset becomes its method delegate", ->
          Help.testDeployedMethod("Reset", "onReset")

      specify "Then plugin#system is set to Scriptex#system", ->
        Help.testDeployedEngine({})

      specify "Then Scriptex returns a list of binding Scripter keys", ->
        Help.testDeployedAPI()
