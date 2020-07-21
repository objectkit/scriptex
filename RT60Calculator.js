


class DecayTable extends DataTable {
  constructor () {
    super(`REVERB SIZE`, `PRE-DELAY`, `DECAY TIME`, `TOTAL TIME`)
  }

  addRow (description, totalTime) {
    let preDelay = totalTime/64
    let decayTime = totalTime-preDelay
    return super.addRow(description, preDelay, decayTime, totalTime )
  }
}

class DelayTable extends DataTable {
  constructor () {
    super(`NOTE VALUE`, `NOTES`, `DOTTED`, `TRIPLET`)
  }

  addRow (description, noteMs) {
    return super.addRow(description, noteMs, noteMs * 1.5, noteMs * 0.667)
  }
}

class OscTable extends DelayTable {
  addRow (description, noteMs) {
    let oscHz = 1000/noteMs
    return super.addRow(description, oscHz)
  }
}

/*
{
  "NOTE VALUE": description
, "NOTES": `${int(noteMs)} ms / ${fix(oscHz)} Hz`
, "DOTTED": `${int(noteMs * 1.5)} ms / ${fix(oscHz * 1.5)} Hz`
, "TRIPLET": `${int(noteMs * 0.667)} ms / ${fix(oscHz * 0.667)} Hz`
}

{
  "REVERB SIZE": description
, "PRE-DELAY": fix(preDelay)
, "DECAY TIME": fix(totalDelay - preDelay)
, "TOTAL TIME": fix(totalDelay)
}
*/


class RT60Calculator {

  calculateRT60 (bpm, meterNumerator, meterDenominator) {
    this.trace(`BPM ${bpm}`)
    this.trace(`METER ${meterNumerator}|${meterDenominator}`)
    this.trace(this.calculateDecays(bpm, meterNumerator))
    this.trace(this.calculateDelays(bpm))
    this.trace(this.calculateOscillations(bpm, meterNumerator))
  }

  trace (dataTable) {
    this.system.Trace(`${dataTable}`)
  }

  calculateDecays (bpm, meterNumerator) {
    let measureDuration = 60000/bpm * meterNumerator
    return new DecayTable()
      .addRow("Hall (2 Bars)", measureDuration *= 2, measureDuration * 1.5, measureDuration * 0.667)
      .addRow("Large Room (1 Bar)", measureDuration /= 2)
      .addRow("Small Room (1/2)", measureDuration /= 2)
      .addRow("Tight Ambience (1/4)", measureDuration /= 2)
  }

  calculateDelays (bpm) {
    let noteDuration = 60000/bpm
    return new DelayTable()
      .addRow(`1 (ONE BAR)`, noteDuration *= 4)
      .addRow(`1/2`, noteDuration /= 2)
      .addRow(`1/4 (ONE BEAT)`, noteDuration /= 2)
      .addRow(`1/8`, noteDuration /= 2)
      .addRow(`1/16`, noteDuration /= 2)
      .addRow(`1/32`, noteDuration /= 2)
      .addRow(`1/64`, noteDuration /= 2)
      .addRow(`1/128`, noteDuration /= 2)
      .addRow(`1/256`, noteDuration /= 2)
      .addRow(`1/512`, noteDuration /= 2)
  }

  calculateOscillations (bpm, meterNumerator) {
    let oscDuration = 60000/bpm * meterNumerator
    return new DataTable()
      .addRow(`3 Bars`, oscDuration * 3)
      .addRow(`2 Bars`, oscDuration *= 2)
      .addRow(`1 Bars`, oscDuration /= 2)
      .addRow(`1/2`, oscDuration /= 2)
      .addRow(`1/4`, oscDuration /= 2)
      .addRow(`1/8`, oscDuration /= 2)
      .addRow(`1/16`, oscDuration /= 2)
      .addRow(`1/32`, oscDuration /= 2)
      .addRow(`1/64`, oscDuration /= 2)
      .addRow(`1/128`, oscDuration /= 2)
      .addRow(`1/256`, oscDuration /= 2)
      .addRow(`1/512`, oscDuration /= 2)
  }

  /*

  .addRow("Hall (2 Bars)", measureDuration *= 2)
  .addRow("Large Room (1 Bar)", measureDuration /= 2)
  .addRow("Small Room (1/2)", measureDuration /= 2)
  .addRow("Tight Ambience (1/4)", measureDuration /= 2)
   */


  calculateReset (bpm, num, den) {
    let val = 0
    new DataTable(`REVERB SIZE`, `PRE-DELAY`, `DECAY TIME`, `TOTAL TIME`)
      .addRow("Hall (2 Bars)", val *= 2, val * 1.5, val * 0.667)
      .addRow("Hall (1 Bar)", val /= 2, val * 1.5, val * 0.667)
      .addRow("1/2", val /= 2, val * 1.5, val * 0.667)
      .addRow("1/2", val /= 2, val * 1.5, val * 0.667)
      .addRow("1/2", val /= 2, val * 1.5, val * 0.667)
      .addRow("1/2", val /= 2, val * 1.5, val * 0.667)
      .addRow("1/2", val /= 2, val * 1.5, val * 0.667)
      .addRow("1/2", val /= 2, val * 1.5, val * 0.667)
      .addRow("1/2", val /= 2, val * 1.5, val * 0.667)
      .addRow("1/2", val /= 2, val * 1.5, val * 0.667)
  }
}
