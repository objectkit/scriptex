import sinon from "sinon"
import chai from "chai"
import { Scriptex, Plugin, Scripter } from "@objectkit/scriptex"

describe(`Plugin`, () => {

  const { assert } = chai
  const sandbox= sinon.createSandbox()

  afterEach(()=>{
    sandbox.restore()
  })

  /** @todo Plugin.API use case demonstration test */
  describe(`static deploy(...ctorArgs):Array<string>`, () => {
    context(`Given parameters supplied to Plugin.deploy`, () => {
      class ConstructorArgumentsCapturingPlugin extends Plugin {
        /* constructor cannot be spied on */
        constructor (...ctorArgs) {
          super()
          this.ctorArgs= ctorArgs
        }
      }
      specify(`Then supplied parameters are given to the Plugin constructor`, () => {
        const ctorArgs= [1, 2, 3]
        const deploySpy= sandbox.spy(Scriptex.prototype, `deploy`)
        {
          ConstructorArgumentsCapturingPlugin.deploy( ...ctorArgs )
        }
        assert.deepEqual((deploySpy.lastCall.firstArg).ctorArgs, ctorArgs)
      })
    })
    /* edge case */
    context(`Given Plugin has a static "CONFIGURABLE" property`, () => {

      beforeEach(() => {
        /* setup */
        sandbox.stub(Scriptex, `SYSTEM`).get( () => Object.create(null) )
        sandbox.spy(Scriptex.prototype, `deploy`)
      })

      class ConfigurableSystemPlugin extends Plugin {
        /* hook for testing */
        onParameter () {}
      }
      const { isTrue, isFalse } = assert
      const assertSystemIsConfigurable= (configurable, assertion) => {
        ConfigurableSystemPlugin.CONFIGURABLE = configurable
        {
          ConfigurableSystemPlugin.deploy()
        }
        const { system } = Scriptex.prototype.deploy.lastCall.firstArg
        const { configurable: val } = Reflect.getOwnPropertyDescriptor(system, `ParameterChanged`)
        assertion( val )
      }

      describe(`When "configurable" is true`, () => {
        specify(`Then #system properties are configurable`, () => {
          assertSystemIsConfigurable(true, isTrue)
        })
      })
      describe(`When "configurable" is false`, () => {
        specify(`Then #system properties are non-configurable`, () => {
          assertSystemIsConfigurable(false, isFalse)
        })
      })
    })
  })
  describe(`#init():void`, () => {
    afterEach(() => sandbox.restore())
    context(`When #system is set`, () => {
      specify(`Then #init() is automatically invoked`, () => {
        const plugin= sandbox.spy(new Plugin())
        sandbox.assert.notCalled(plugin.init)
        {
          plugin.system= {}
        }
        sandbox.assert.calledOnce(plugin.init)
      })
    })
  })
  describe(`#system`, () => {
    context(`Given #system is accessed before Scriptex#deploy`, () => {
      specify(`Then a "SystemAccessFault" advisory is thrown`, () => {
        assert.throws(() => {new Plugin().system}, ReferenceError, "SystemAccessFault" )
      })
    })
    context(`Given #system is accessed after Plugin.deploy`, () => {
      specify(`Then a reference to Scripter is returned.`, () => {
        const deploySpy= sandbox.spy(Scriptex.prototype, `deploy`)
        {
          Plugin.deploy()
        }
        const plugin = deploySpy.lastCall.firstArg
        assert.propertyVal(plugin, `system`, Scripter)
      })
    })
  })
})
