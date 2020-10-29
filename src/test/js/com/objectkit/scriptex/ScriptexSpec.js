import chai from "chai"
import sinon from "sinon"
import { v4 as uuid } from "uuid"
import { Scriptex, Scripter } from "@objectkit/scriptex"

describe(`Scriptex`, () => {
  const { assert } = chai
  const sandbox = sinon.createSandbox()

  afterEach(()=>{
    sandbox.verifyAndRestore()
  })

  context(`static SYSTEM:Scripter`, () => {
    describe(`Given .SYSTEM is accessed`, () => {
      specify(`Then a reference to Scripter is returned.`, () => {
        assert.strictEqual(Scriptex.SYSTEM, Scripter)
      })
    })
  })

  context(`static API:Map<string,string>`, () => {
    describe(`Given .API is accessed`, () => {
      specify(`Then a group of 8 symmetric Scripter|Scriptex keys is presented.`, () => {
        assert.instanceOf(Scriptex.API, Map)
        assert.lengthOf(Scriptex.API, 8)
      })
      context(`When Scriptex.API.get("PluginParameters") is accessed`, () => {
        specify(`Then "params" is returned`, () => {
          assert.strictEqual(Scriptex.API.get(`PluginParameters`), `params`)
        })
      })
      context(`When Scriptex.API.get("NeedsTimingInfo") is accessed`, () => {
        specify(`Then "needsTiming" is returned`, () => {
          assert.strictEqual(Scriptex.API.get(`NeedsTimingInfo`), `needsTiming`)
        })
      })
      context(`When Scriptex.API.get("ResetParameterDefaults") is accessed`, () => {
        specify(`Then "needsDefaults" is returned`, () => {
          assert.strictEqual(Scriptex.API.get(`ResetParameterDefaults`), `needsDefaults`)
        })
      })
      context(`When Scriptex.API.get("HandleMIDI") is accessed`, () => {
        specify(`Then "onMIDI" is returned`, () => {
          assert.strictEqual(Scriptex.API.get(`HandleMIDI`), `onMIDI`)
        })
      })
      context(`When Scriptex.API.get("ParameterChanged") is accessed`, () => {
        specify(`Then "onParam" is returned`, () => {
          assert.strictEqual(Scriptex.API.get(`ParameterChanged`), `onParam`)
        })
      })
      context(`When Scriptex.API.get("ProcessMIDI") is accessed`, () => {
        specify(`Then "onProcess" is returned`, () => {
          assert.strictEqual(Scriptex.API.get(`ProcessMIDI`), `onProcess`)
        })
      })
      context(`When Scriptex.API.get("Reset") is accessed`, () => {
        specify(`Then "onReset" is returned`, () => {
          assert.strictEqual(Scriptex.API.get(`Reset`), `onReset`)
        })
      })
      context(`When Scriptex.API.get("Idle") is accessed`, () => {
        specify(`Then "onIdle" is returned`, () => {
          assert.strictEqual(Scriptex.API.get(`Idle`), `onIdle`)
        })
      })
    })
  })

  context(`new Scriptex(system, api, configurable):Scriptex`,()=> {
    describe("Given new Scriptex(...rest)", () => {
      describe(`When the "system" argument is missing`, () => {
        /* Given no system parameter */
        /* Then the system parameter is initalised to Scriptex.SYSTEM */
          /* deployment consequence: plugin.system */
        specify(`Then the "system" parameter is initialised as Scriptex.SYSTEM`, () => {
          const sysSpy= sandbox.spy(Scriptex, `SYSTEM`, ['get'])
          assert.isTrue(sysSpy.get.notCalled)
          new Scriptex(void(0))
          assert.isTrue(sysSpy.get.calledOnce)
        })
      })
      /* Given no api parameter */
      /* Then the api parameter is initialised to Scriptex.API */
        /* deploument consequence: plugin integration with Scripter */
      describe(`When the "api" argument is missing`, () => {
        specify(`Then the "api" parameter is initialised as Scriptex.API`, () => {
          const apiSpy= sandbox.spy(Scriptex, `API`, [`get`])
          assert.isTrue(apiSpy.get.notCalled)
          new Scriptex(Scriptex.SYSTEM, void(0))
          assert.isTrue(apiSpy.get.calledOnce)
        })
      })
      /* Given no configurable parameter */
      /* Then the configurable parameter is initialised to false */
        /* deployment consequence: system property implementation */
      describe(`When the "configurable" argument is missing`, () => {
        class Deployee {
          get needsTiming () {}
          get needsDefaults () {}
          get params() {}
          onMIDI () {}
          onParam () {}
          onProcess () {}
          onReset () {}
          onIdle () {}
        }
        const assertSystemIsConfigurable = (configurable, assertion) => {
          const plugin= new Deployee()
          const system= Object.create(null)
          /* deploy in place */
          {
            new Scriptex(system, Scriptex.API, configurable).deploy(plugin)
          }
          /* inspect each property of the plugin and assert its configurable status */
          for (const key of Scriptex.API.keys()) {
            const { configurable } = Reflect.getOwnPropertyDescriptor(system, key)
            assertion(configurable)
          }
        }
        specify(`Then the "configurable" parameter is initialised as false`, () => {
          const { isTrue, isFalse } = assert
          /* run for this specific test case */
          assertSystemIsConfigurable(undefined, isFalse)
          /* run again to demonstrate the same outcome when configurable is explicity set to false */
          assertSystemIsConfigurable(false, isFalse)
          /* run the positive test case to exemplify the veractiy of the previous two test caes */
          assertSystemIsConfigurable(true, isTrue)
        })
      })
    })
  })

  context(`deploy(plugin:Object):Array<string>`, () => {
    /* @todo move to deploy spec */
    /* Given a bespoke api os passed */
    /* Then Scriptex uses this api to bridge the plugin to the system */
    describe(`Given a plugin with property keys in #api.values()`, () => {
      /* create a ranomised system/plugin api */
      const newBespokeApi = (size= 8) => {
        const bespokeApi = new Map()
        while(size--) {
          const sysKey= `_${uuid().replace(/-/g, "")}`
          const plgKey= `_${uuid().replace(/-/g, "")}`
          bespokeApi.set(sysKey, plgKey)
        }
        return bespokeApi
      }

      const newBespokePlugin = (plgKeys, /*distribution=1.0*/) => {
        const bespokePlugin= Object.create(null)
        const defineMembers= (plgKey) =>
          bespokePlugin[plgKey] = (Math.random() > .5) // rnd method/
            ? plgKey
            : ()=> plgKey
        plgKeys.forEach(defineMembers)
        return bespokePlugin
      }

      const newSystem= () => Object.create(null)
      //@ see https://www.calculator.net/permutation-and-combination-calculator.html?cnv=8&crv=8&x=56&y=8
      specify(`Then #system is linked to plugin with corresponding #api.keys()`, () => {
        /** @todo randomised distribution of plugin/system correspondences */
        const rndApi= newBespokeApi(/*256*/)
        const plugin= newBespokePlugin(rndApi, true)
        const system= newSystem()
        const sysApi= new Scriptex(system, rndApi).deploy(plugin)
        const plgApi= Reflect.ownKeys(plugin).filter( k => k !== `system`)
        assert.sameMembers(sysApi, [...rndApi.keys()])
        assert.sameMembers(plgApi, [...rndApi.values()])
      })
    })
  })
})
