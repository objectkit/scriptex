import { Scriptex, DefaultPlugin } from "@objectkit/scriptex"
import { Scripter, Event } from "@objectkit/scriptex-mocks"

describe(`Scriptex`, () => {

  class DefaultPluginDouble extends DefaultPlugin {
    get params () {
      return [
        { ID: 'a' }
      , { ID: 'b' }
      , { ID: 'c' }
      ]
    }
  }
  specify("stub", () => {
    const event= new Event()
    const system= new Scripter()
    const plugin= sinon.spy(new DefaultPluginDouble())
    const scriptex= new Scriptex(system)
    const deployed= scriptex.deploy(plugin)
    assert.lengthOf(deployed, 3)
    assert.includeMembers(deployed, [`HandleMIDI`, `ParameterChanged`, `PluginParameters`])
    assert.equal(plugin.params, system.PluginParameters)
    assert.isFunction(system.HandleMIDI)
    assert.notCalled(plugin.onMidi)
    assert.notCalled(plugin.onEvent)
    system.HandleMIDI(event)
    assert.callOrder(plugin.onMidi, plugin.onEvent, plugin.sendMidi)
    assert.notCalled(plugin.onParam)
    assert.notProperty(plugin, "a")
    system.ParameterChanged(0, "A")
    assert.calledOnce(plugin.onParam)
    assert.propertyVal(plugin, "a", "A")
    assert.notProperty(plugin, "b")
    system.ParameterChanged(1, "B")
    assert.calledTwice(plugin.onParam)
    assert.propertyVal(plugin, "b", "B")
    assert.notProperty(plugin, "c")
    system.ParameterChanged(2, "C")
    assert.calledThrice(plugin.onParam)
    assert.propertyVal(plugin, "c", "C")
  })
})
