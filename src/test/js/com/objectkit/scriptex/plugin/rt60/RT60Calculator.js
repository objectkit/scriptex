import DataTable from "com/objectkit/scriptex/plugin/rt60/DataTable"

let fix = (num) => +(num).toFixed(2)

class RT60Calculator {

  /* "echoes" i.e. conventional delay lines */
  calculateDelays () {
    return new DataTable([`NOTE VALUE`, `NOTES`, `DOTTED`, `TRIPLETS`])
  }

  /* reverb and predelays */
  calculateDecays (bpm, meterNumerator) {
    /* TODO where to place unit signifiers such as "s", "ms" or "Hz"? */
    let measureMs = (60000/bpm) * meterNumerator
    let dataTable = new DataTable([`REVERB SIZE`, `PRE-DELAY`, `DECAY TIME`, `TOTAL REVERB TIME`])
    let calcDecay = (description, totalMs, preDelay=totalMs/64) =>
      dataTable.addRow(description, fix(preDelay),fix(totalMs-preDelay), fix(totalMs))

    calcDecay(`3 Bars`, measureMs * 3)
    calcDecay(`2 Bars`, measureMs *= 2)
    calcDecay(`1 Bar`,  measureMs /= 2)
    calcDecay(`1/2 Beat`, measureMs /= 2)
    calcDecay(`1/4 Beat`, measureMs /= 2)
    calcDecay(`1/8 Beat`, measureMs /= 2)

    return dataTable
  }

  /* modulation LFO's */
  calculateLFOs () {
    // NOTE: same headers as delays
    return new DataTable([`NOTE VALUE`, `NOTES`, `DOTTED`, `TRIPLETS`])
  }
}

export default RT60Calculator
