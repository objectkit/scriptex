{
  DataTable
} = require(SCRIPTEX_TEST)

describe.only "DataTable", ->

  Help =
    assertPaddingEqualsLongestHeader: (headers, expected) ->
      longest = headers.concat().sort( (a,b) -> b.length-a.length )[0]
      expect(expected).equals(longest)
      padding = 2 * longest.length
      expect(new DataTable(headers)).property("padding", padding)

    assertAddRowCreatesRowFromCells: (cells) ->

      headers = "A,".repeat(cells.length).split(",")
      row = new DataTable(headers).addRow(...cells).rows.pop()
      expect(cells).eql(row)

  context "When headers are provided to the constructor", ->
    it "Then padding is defined by the length of the header", ->
      Help.assertPaddingEqualsLongestHeader(["A", "BB", "CCC", "DDDD"], "DDDD")
      Help.assertPaddingEqualsLongestHeader(["AAA", "BBBBBBB", "CCC", "D"], "BBBBBBB")
      Help.assertPaddingEqualsLongestHeader(["A"], "A")

  context "When addRow is used to add cells to a new row", ->
    it "Then the provided cells are combined into a row ", ->
      cells = [1,2,3,4]
      table = new DataTable(["A", "B", "C", "D"])
      table.addRow(...cells)
      expect(cells).eql(table.rows[table.rows.length-1])

      Help.assertAddRowCreatesRowFromCells([1,2,3,4])



  context "When addRows is used to add many rows", ->
