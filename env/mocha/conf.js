import chai from "chai"
import sinon from "sinon"
import sinonChai from "sinon-chai"

/* Bind Sinon assertions to Chai expect and assert */
// chai.use(sinonChai)
sinon.assert.expose(chai.assert, { prefix: "" });
/* expose sinon to global scope of tests */
global.sinon= sinon
/* expose chai.assert to global scope of tests */
global.assert= chai.assert
