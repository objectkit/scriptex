const PADDING = 16
const PRECISION = 10**2

class DelayLineRenderer {

  constructor (system, padding=PADDING, precision=PRECISION) {
    this.system = system
    this.padding = padding
    this.precision = precision
  }

  renderDelayLines (delayLinesTable) {
    let { padding, precision } = this
    let renderedText = ``
    let formatData = (data) =>
      Number.isFinite(data) ? Math.round( data * precision) / precision : data
    let formatRow = (row) =>
      `| ${formatData(row)}`.padEnd(padding, ` `)
    for (let delayLineRow of delayLinesTable) {
      let formattedRow = delayLineRow.map(formatRow).join(``)
      this.system.Trace(formattedRow)
      renderedText += `\n${formattedRow}`
    }
    return renderedText
  }
}

export default DelayLineRenderer
