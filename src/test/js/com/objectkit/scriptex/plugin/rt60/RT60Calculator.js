import DataTable from "com/objectkit/scriptex/plugin/rt60/DataTable"

const val = (num) => num // WARN: +(num).toPrecision(3)

class RT60Calculator {

  calculateDecays (bpm, num) {
    let beatMs = 60000/bpm
    let dataTable = new DataTable([`REVERB SIZE`, `PRE-DELAY (ms)`, `DECAY TIME (ms)`, `TOTAL REVERB TIME (ms)`])
    let calcDecay = (sig, timeMs, preMs=timeMs/64) =>
      dataTable.addRow([sig, preMs, timeMs-preMs, timeMs])

    calcDecay( "Hall (2 Bars)", (beatMs * num * 2))
    calcDecay( "Large Room (1 Bar)", (beatMs * num))
    calcDecay( "Small Room (1/2 Note)", beatMs * 2 )
    calcDecay( "Tight Ambience (1/4 Note)", beatMs )

    return dataTable
  }

  calculateDelays (bpm, num) {
    let beatMs = 60000/bpm
    let dataTable = new DataTable([`NOTE VALUE`, `NOTE (ms)`, `DOTTED (ms)`, `TRIPLET (ms)`])
    let calcDelay = (div, timeMs) =>
      dataTable.addRow([`1/${div}`, timeMs, timeMs * 1.5, timeMs * 0.667])

    calcDelay(1, beatMs *= num)
    calcDelay(2, beatMs /= 2)
    calcDelay(4, beatMs /= 2)
    calcDelay(8, beatMs /= 2)
    calcDelay(16, beatMs /= 2)
    calcDelay(32, beatMs /= 2)
    calcDelay(64, beatMs /= 2)
    calcDelay(128, beatMs /= 2)
    calcDelay(256, beatMs /= 2)
    calcDelay(512, beatMs /= 2)

    return dataTable
  }

  calculateModulations (bpm, num) {
    let beatMs = 60000/bpm
    let dataTable = new DataTable([`BEAT`, `NOTE (Hz)`, `DOTTED (Hz)`, `TRIPLET (Hz)`])
    let calcMdltn = (sig, noteMs, oscHz=noteMs/1000) =>
      dataTable.addRow([sig, oscHz, oscHz * 1.5, oscHz * 0.667])

    calcMdltn(1, beatMs *= num)
    calcMdltn(2, beatMs /= 2)
    calcMdltn(4, beatMs /= 2)
    calcMdltn(8, beatMs /= 2)
    calcMdltn(16, beatMs /= 2)
    calcMdltn(32, beatMs /= 2)
    calcMdltn(64, beatMs /= 2)
    calcMdltn(128, beatMs /= 2)
    calcMdltn(256, beatMs /= 2)
    calcMdltn(512, beatMs /= 2)

    return dataTable
  }

}

export default RT60Calculator
