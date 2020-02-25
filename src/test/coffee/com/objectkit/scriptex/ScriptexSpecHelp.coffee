{ Scriptex, Scripter } = require(SCRIPTEX_TEST)


ScriptexSpecHelp =

  MEMBERS: new Map(
    [
      ["NeedsTimingInfo", "needsTiming"]
      ["ResetParameterDefaults", "resetParameters"]
      ["PluginParameters", "parameters"]
      ["HandleMIDI", "handleMIDI"]
      ["ProcessMIDI", "handleProcess"]
      ["ParameterChanged", "handleParameter"]
      ["Reset", "handleReset"]
      ["Idle", "handleIdle"]
    ]
  )

  newMockEngine: ->
    Object.create(null)

  newEmptyPlugin: ->
    Object.create(null)

  newCompletePlugin: ->
    parameters: []
    needsTiming: true
    resetParameters: true
    handleMIDI: ->
    handleProcess: ->
    handleParameter: ->
    handleReset: ->
    handleIdle: ->

  newDeployment: (plugin=@newEmptyPlugin(), engine=@newMockEngine(), customisable=undefined) ->
    deployer = new Scriptex(engine)
    deployed = deployer.deploy(plugin, customisable)
    return deployed

  testScriptexEngine: () ->
    plugin = {}
    engine = @newMockEngine()
    scriptex = new Scriptex(engine)
    scriptex.deploy(plugin)
    expect(plugin).property("engine").eql(engine)
    return

  testDefaultScriptexEngine: ->
    plugin = {}
    scriptex = new Scriptex()
    scriptex.deploy(plugin)
    expect(plugin).property("engine").eql(Scripter)
    return

  testDeployedEngine: (engine) ->
    plugin = new Object()
    scriptex = new Scriptex(engine)
    expect(plugin).not.to.have.property("engine")
    scriptex.deploy(plugin)
    expect(plugin).to.have.property("engine").eql(engine)
    return

  testDeployedMethod: (engineKey, pluginKey) ->
    mockArgs = [uuid(), uuid(), uuid()]
    mockMethod = sinon.spy(->)
    mockPlugin = { [pluginKey]: mockMethod }
    mockEngine = {}

    deployment = @newDeployment(mockPlugin, mockEngine)
    expect(deployment).to.be.instanceof(Array).with.lengthOf(1)
    expect(deployment[0]).to.equal(engineKey)

    # formally invoke
    Reflect.apply(Reflect.get(mockEngine, engineKey), mockEngine, mockArgs)
    expect(mockMethod).calledOnce
    expect(mockMethod).calledWith(...mockArgs)

    mockArgs.pop()
    # formally invoke
    Reflect.apply(Reflect.get(mockEngine, engineKey), mockEngine, mockArgs)
    expect(mockMethod).calledTwice

    mockArgs.pop()
    # formally invoke
    Reflect.apply(Reflect.get(mockEngine, engineKey), mockEngine, mockArgs)
    expect(mockMethod).calledThrice
    return

  testDeployedField: (engineKey, pluginKey) ->
    mockValue1 = uuid()
    mockValue2 = uuid()
    mockValue3 = uuid()
    mockEngine = {}
    mockPlugin = [pluginKey]: null

    deployment = @newDeployment(mockPlugin, mockEngine)
    expect(deployment).to.be.instanceof(Array).with.lengthOf(1)
    expect(deployment[0]).to.equal(engineKey)

    expect(mockEngine).property(engineKey).to.be.null

    Reflect.set(mockPlugin, pluginKey, mockValue1)
    expect(mockEngine).property(engineKey).to.eql(mockValue1)

    Reflect.set(mockPlugin, pluginKey, mockValue2)
    expect(mockEngine).property(engineKey).to.eql(mockValue2)

    # show that this is a readonly accessor
    Reflect.set(mockPlugin, engineKey, mockValue3)
    expect(mockEngine).property(engineKey).not.to.eql(mockValue3)
    expect(mockEngine).property(engineKey).to.eql(mockValue2)

    Reflect.set(mockPlugin, pluginKey, mockValue3)
    expect(mockEngine).property(engineKey).to.eql(mockValue3)
    return

  testDeployedAPI: () ->
    emptyPlugin = @newEmptyPlugin()
    emptyDeployment = @newDeployment(emptyPlugin)
    expect(emptyDeployment).to.be.empty.instanceof(Array)

    completePlugin = @newCompletePlugin()

    completeKeys = Array.from(@MEMBERS.keys())
    completeDeployment = @newDeployment(completePlugin)
    expect(completeDeployment).to.be.instanceof(Array).with.members(completeKeys)
    return

  testConfigurableDeployment: ->
    mockPlugin = @newCompletePlugin()
    mockEngine = @newMockEngine()
    engineKeys = @newDeployment(mockPlugin, mockEngine, CONFIGURABLE=true)

    # all properties added to engine
    expect(Reflect.ownKeys(mockEngine)).eql(engineKeys)

    for engineKey in engineKeys
      descriptor = Reflect.getOwnPropertyDescriptor(mockEngine, engineKey)
      expect(descriptor).property("configurable").eql(true)
      deleted = Reflect.deleteProperty(mockEngine, engineKey)
      expect(deleted).to.be.true

    # all properties deleted from engine
    expect(Reflect.ownKeys(mockEngine)).eql([])
    return

  testNonConfigurableDeployment: ->
    NOT_CONFIGURABLE = false
    mockPlugin = @newCompletePlugin()
    mockEngine = @newMockEngine()
    engineKeys = @newDeployment(mockPlugin, mockEngine, CONFIGURABLE=false)

    # all properties added to engine
    expect(Reflect.ownKeys(mockEngine)).eql(engineKeys)

    for engineKey in engineKeys
      descriptor = Reflect.getOwnPropertyDescriptor(mockEngine, engineKey)
      expect(descriptor).property("configurable").eql(false)
      deleted = Reflect.deleteProperty(mockEngine, engineKey)
      expect(deleted).to.be.false

    # all properties still accessible on engine
    expect(Reflect.ownKeys(mockEngine)).eql(engineKeys)
    return

module.exports = ScriptexSpecHelp
