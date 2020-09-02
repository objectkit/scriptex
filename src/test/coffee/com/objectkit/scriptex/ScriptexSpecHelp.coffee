{ Scriptex, Scripter, APIKeyMap } = require(SCRIPTEX_TEST)

ScriptexSpecHelp =

  MEMBERS: new APIKeyMap()

  newMockEngine: ->
    Object.create(null)

  newEmptyPlugin: ->
    Object.create(null)

  newCompletePlugin: ->
    params: []
    needsTiming: true
    needsDefaults: true
    onMidi: ->
    onProcess: ->
    onParam: ->
    onReset: ->
    onIdle: ->

  newDeployment: (plugin=@newEmptyPlugin(), system=@newMockEngine(), configurable=undefined) ->
    deployer = new Scriptex(system, undefined, configurable)
    deployed = deployer.deploy(plugin)
    return deployed

  testScriptexEngine: () ->
    plugin = {}
    system = @newMockEngine()
    scriptex = new Scriptex(system)
    scriptex.deploy(plugin)
    expect(plugin).property("system").eql(system)
    return

  testDefaultScriptexEngine: ->
    plugin = {}
    scriptex = new Scriptex()
    scriptex.deploy(plugin)
    expect(plugin).property("system").eql(Scripter)
    return

  testDeployedEngine: (system) ->
    plugin = new Object()
    scriptex = new Scriptex(system)
    expect(plugin).not.to.have.property("system")
    scriptex.deploy(plugin)
    expect(plugin).to.have.property("system").eql(system)
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

    # all properties added to system
    expect(Reflect.ownKeys(mockEngine)).eql(engineKeys)

    for engineKey in engineKeys
      descriptor = Reflect.getOwnPropertyDescriptor(mockEngine, engineKey)
      expect(descriptor).property("configurable").eql(true)
      deleted = Reflect.deleteProperty(mockEngine, engineKey)
      expect(deleted).to.be.true

    # all properties deleted from system
    expect(Reflect.ownKeys(mockEngine)).eql([])
    return

  testNonConfigurableDeployment: ->
    NOT_CONFIGURABLE = false
    mockPlugin = @newCompletePlugin()
    mockEngine = @newMockEngine()
    engineKeys = @newDeployment(mockPlugin, mockEngine, CONFIGURABLE=false)

    # all properties added to system
    expect(Reflect.ownKeys(mockEngine)).eql(engineKeys)

    for engineKey in engineKeys
      descriptor = Reflect.getOwnPropertyDescriptor(mockEngine, engineKey)
      expect(descriptor).property("configurable").eql(false)
      deleted = Reflect.deleteProperty(mockEngine, engineKey)
      expect(deleted).to.be.false

    # all properties still accessible on system
    expect(Reflect.ownKeys(mockEngine)).eql(engineKeys)
    return

module.exports = ScriptexSpecHelp
