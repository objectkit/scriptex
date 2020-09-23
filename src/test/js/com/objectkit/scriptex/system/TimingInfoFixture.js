/* @interface */
class TimingInfoFixture {

  constructor () {
    this.playing = true
    this.tempo = 120
    this.meterNumerator = 4
    this.meterDenominator = 4
  }

  /* @type {boolean} */
  get playing() {
    return this.$playing
  }
  set playing (any) {
    this.$playing = any
  }
  /* @type {number} */
  get blockStartBeat() {
    return this.$blockStartBeat
  }
  set blockStartBeat(any) {
    this.$blockStartBeat = any
  }
  /* @type {number} */
  get blockEndBeat() {
    return this.$blockEndBeat
  }
  set blockEndBeat(any){
    this.$blockEndBeat = any
  }
  /* @type {number} */
  get tempo() {
    return this.$tempo
  }
  set tempo (any) {
    this.$tempo = any
  }
  /* @type {number} */
  get meterNumerator() {
    return this.$meterNumerator
  }
  set meterNumerator(any) {
    return this.$meterNumerator = any
  }
  /* @type {number} */
  get meterDenominator() {
    return this.$meterDenominator
  }
  set meterDenominator(any) {
    this.$meterDenominator = any
  }
  /* @type {boolean} */
  get cycling() {
    return this.$cycling
  }
  set cycling(any) {
    this.$cycling = any
  }
  /* @type {number} */
  get leftCycleBeat() {
    return this.$leftCycleBeat
  }
  set leftCycleBeat(any) {
    this.$leftCycleBeat = any
  }
  /* @type {number} */
  get rightCycleBeat() {
    return this.$rightCycleBeat
  }
  set rightCycleBeat(any) {
    this.$rightCycleBeat = any
  }
}

export default TimingInfoFixture
