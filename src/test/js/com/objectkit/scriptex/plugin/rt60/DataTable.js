
class DataTable {

  static serialise (dataTable) {
    let { headers, rows, padding } = dataTable
    return [headers, ...rows].map(
        (row) =>
          row.map(
            cell => `| ${cell}`.padEnd(padding, ' ') ).join('')
          )
        .join(`\n`)
  }

  constructor (headers, padding=30, unit=``) {
    this.headers = headers
    this.padding = padding
    this.unit = unit
    this.rows = []
  }

  addRow(row) {
    return this.rows.push(row), this
  }

  toString () {
    return DataTable.serialise(this)
  }
}

export default DataTable
