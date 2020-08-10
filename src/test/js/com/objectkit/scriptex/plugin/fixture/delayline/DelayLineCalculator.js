class DelayLineCalculator {

  calculateDelayLines (beatsPerMinute, beatsPerBar, beatsPerWhole) {
    let crotchetMs = 60000/beatsPerMinute
    let delayLines = [ [ `BEAT`, `NOTE`, `DOTTED`, `TRIPLET` ] ]
    let proceedure = (beatValue, beatMs) =>
      delayLines.push([beatValue, beatMs, beatMs * 1.5, beatMs * 0.667])

    proceedure(`1/1`, crotchetMs *= beatsPerWhole)
    proceedure(`1/2`, crotchetMs /= 2)
    proceedure(`1/4`, crotchetMs /= 2)
    proceedure(`1/8`, crotchetMs /= 2)
    proceedure(`1/16`, crotchetMs /= 2)
    proceedure(`1/32`, crotchetMs /= 2)
    proceedure(`1/64`, crotchetMs /= 2)
    proceedure(`1/128`, crotchetMs /= 2)
    proceedure(`1/256`, crotchetMs /= 2)
    proceedure(`1/512`, crotchetMs /= 2)

    return delayLines
  }

}

export default DelayLineCalculator
