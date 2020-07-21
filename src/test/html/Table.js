class Table {

  constructor (...headers) {
    this.rows = []
    this.headers= [...headers]
  }

  newRow (...cells) {
    this.rows.push([...cells])
    return this
  }

  /*
  serialise (padding=24) {
    let string = ``;
    ([this.headers, ...this.rows])
      .forEach(
        (row) => {
          let data = row.map(
            (cell) => `${cell}`.padEnd(padding, ` `)
          ).join(`|`)
          string += `\n${data}`
        }
      )
    return string;
  }
  */

  serialise (padding=24) {
    let strings = (``);
    for (let row of [this.headers, ...this.rows])
    let allRows = [this.headers, ...this.rows]

    allRows.map(
      (row) => row.map( (cell) => `${cell}`.padEnd(padding, ` `)).join(`|`)
    )

    return allRows.join(`\n`)
  }

  /*
  serialise (padding=24) {
    ([this.headers, ...this.rows])
      .map((row) => row.map( (cell) => `${cell}`.padEnd(padding, ` `)).join(`|`))
        .join(`\n`)
  }
  */

  /* @override */
  toString () {
    return this.serialise()
  }
}

let table = new Table(`A`, `B`, `C`, `D`)
  .newRow(1,1,1,1)
  .newRow(2,2,2,2)
  .newRow(3,3,3,3)
  .newRow(4,4,4,4)

Trace(`${table}`)
