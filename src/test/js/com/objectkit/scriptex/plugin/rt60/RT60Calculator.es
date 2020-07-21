class RT60Calculator {

  calculateDecays (bpm, meterNumerator) {
    // init to one measure
    let decayMs = 60000/bpm * meterNumerator
    let dataTable = new DataTable(["REVERB TIME", "PRE-DELAY", "DECAY TIME", "TOTAL REVERB TIME"])
    let calcDecay = (sig, timeMs, preMs=timeMs/64) =>
      dataTable.addRow([sig, preMs, timeMs-preMs, timeMs])

    /*
      Hall        2 bars
      Room (L)    1 bar
      Room (s)    1/2 bar
      Tight       1/4 bar

     */
    calcDecay(`Hall`, decayMs *= 2) // 2 measures
    calcDecay(`Room`, beatDecay /= 2) // 1 measure
    calcDecay(`Tight`, beatDecay /= 2) // 1/2 note
    calcDecay(`Trace`, beatDecay /= 2) // 1/4 note

    return dataTable
  }

  calculateDelays (bpm, meter) {
    let beatDelay = 60000/bpm
    let dataTable = new DataTable(["BEAT", "NOTE", "DOTTED", "TRIPLET"])
    let calcDelay = (signifier, timeMs, preMs=timeMs/64) =>
      dataTable.addRow([`1/${signifier}`, timeMs, timeMs * 1.5, timeMs * 0.667])
    calcDelay(1, beatDecay * 4)
    calcDelay(2, beatDecay / 2)
    calcDelay(4, beatDecay)
    calcDelay(8, beatDecay / 8)

    return dataTable
  }

  calculateModulation (bpm, meter) {
    let dataTable = new DataTable(["BEAT", "NOTE", "DOTTED", "TRIPLET"])
    let calcMdltn = () => {}
  }

}
