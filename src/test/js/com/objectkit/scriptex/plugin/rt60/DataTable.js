
/* @todo unit characters in correct cell */
/* @todo multiplier to fine tune padding */
class DataTable {

  constructor (headers=[]) {
    this.rows = []
    this.headers = headers
    this.padding = headers.reduce((a,b)=>(a.length>b.length?a:b)).length * 2
  }

  /* @type {Array} */
  addRow (row) {
    return this.rows.push(row), this;
  }

  /* @type {Array<Array>} */
  addRows (rows) {
    for (let row of rows) this.addRow(row)
    return this;
  }

  toString () {
    return [this.headers, ...this.rows]
      .map( (row) => row.map( cell => `| ${cell}`.padEnd(this.padding, ' ') ).join('') )
        .join(`\n`)
  }
}

export default DataTable
