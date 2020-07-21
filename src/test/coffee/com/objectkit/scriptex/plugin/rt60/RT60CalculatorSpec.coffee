{
  RT60Calculator
  DataTable
} = require(SCRIPTEX_TEST)

describe.skip "RT60CalculatorSpec", ->

  DECAY_HEADERS = ["REVERB SIZE", "PRE-DELAY", "DECAY TIME", "TOTAL REVERB TIME"]
  DELAY_HEADERS = ["NOTE VALUE", "NOTES", "DOTTED", "TRIPLETS" ]

  context "calculateDecays(Number bpm, Number meterNumerator) DataTable", ->
    it "Returns a DataTable with expected headers", ->
      dataTable = new RT60Calculator().calculateDecays(120, 4, 4)
      expect(dataTable).property("headers").eql(DECAY_HEADERS)

  context "calculateDelays(Number bpm, Numer meterNumerator) DataTable", ->
    it "Returns a DataTable with expected headers", ->
      dataTable = new RT60Calculator().calculateDelays(120, 4, 4)
      expect(dataTable).property("headers").eql(DELAY_HEADERS)

  context "calculateLFOs(Number bpm) DataTable", ->
