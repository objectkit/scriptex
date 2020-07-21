class DataTable {
  constructor (headers, padding, unit) {
    this.rows = []
    this.headers = headers
    this.padding = padding
    this.unit = unit
  }

  addRow (row) {
    if (row.length !== this.headers.length)
      throw new Error(`BadRowSize`)
    this.rows.push(row)
    return this
  }

  addRows (rows) {
    for (let row of rows) this.addRow(row)
    return this
  }

  toString () {
    return this.serialise()
  }

  serialise () {

  }
}
