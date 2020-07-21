{
  RT60Calculator
  DataTable
} = require(SCRIPTEX_TEST)

describe "RT60Calculator", ->

  BEATS_PER_MINUTE  = 120
  METER_NUMERATOR   = 4
  METER_DENOMINATOR = 4

  Help =
    validateDelay: (delay, bpm) ->
      [ beatDiv, noteMs, dottedMs, tripletMs ] = delay
      beatDiv = beatDiv.replace("1/","")
      expect(noteMs).eql(dottedMs/1.5)
      expect(noteMs).eql(tripletMs/0.667)

    validateDecay: (decay, bpm) ->
      [ name, preMs, decayMs, totalMs ] = decay
      expect(totalMs).eql(preMs+decayMs)
      expect(totalMs).eql(preMs*64)

    validateModulation: (modulation, bpm) ->
      [ name, oscHz, dottedHz, tripletHz ] = modulation
      expect(oscHz).eql(dottedHz/1.5)
      expect(oscHz).eql(tripletHz/0.667)

  # BEGIN SPEC

  describe "When calculateDecays() is invoked", ->
    it "Then the returned SerialDataTable holds the correct calculations", ->
      calculator = new RT60Calculator()
      calculated = calculator.calculateDecays(BEATS_PER_MINUTE, METER_NUMERATOR)
      console.info("#{calculated}")
      # [ hallReverb, roomReverb, roomReverb, ambientReverb ] = calculated.rows
      for decay in calculated.rows
        Help.validateDecay(decay, BEATS_PER_MINUTE, METER_DENOMINATOR)

      return

    return

  describe "When calculateDelays() is invoked", ->
    it "Then the returned SerialDataTable holds the correct calculations", ->
      calculator = new RT60Calculator
      calculated = calculator.calculateDelays(BEATS_PER_MINUTE, METER_NUMERATOR)
      console.info("#{calculated}")
      for delay in calculated.rows
        Help.validateDelay(delay)

      return

    return

  describe "When calculateModulations() is invoked", ->
    it "Then the returned SerialDataTable holds the correct calculations", ->
      calculator = new RT60Calculator
      calculated = calculator.calculateModulations(BEATS_PER_MINUTE, METER_NUMERATOR)
      console.info("#{calculated}")
      for modulation in calculated.rows
        Help.validateModulation(modulation)

      return

    return
