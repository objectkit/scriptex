/* @interface */
export default class TimingInfoFixture {
 /* @type {boolean} */
 get playing () {
   return true
 }
 /* @type {number} */
 get blockStartBeat () {}
 /* @type {number} */
 get blockEndBeat () {}
 /* @type {number} */
 get tempo () {
   return 120
 }
 /* @type {number} */
 get meterNumerator () {
   return 4
 }
 /* @type {number} */
 get meterDenominator () {
   return 4
 }
  /* @type {boolean} */
 get cycling () {}
 /* @type {number} */
 get leftCycleBeat () {}
 /* @type {number} */
 get rightCycleBeat () {}
}
