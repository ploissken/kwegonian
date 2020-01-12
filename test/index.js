const chai = require('chai')
const expect = require('chai').expect
const translator = require('../src/translator.js')

 describe('translator.js', function () {
  describe('error detection', function () {
    it('should return error if no input was received', function (done) {
      const noInputResult = translator.translateKwego()
      expect(noInputResult.status).to.equal('error')
      expect(noInputResult.message).to.equal('no kwego received')

      const blankInputResult = translator.translateKwego('')
      expect(blankInputResult.status).to.equal('error')
      expect(blankInputResult.message).to.equal('no kwego received')
      done()
    })

    it('should return error if unknown kwego is received', function (done) {
      const result = translator.translateKwego('inexistentAlgarism')
      expect(result.status).to.equal('error')
      expect(result.message).to.equal('unable to decode "inexistentAlgarism"')
      done()
    })
  })

  describe('error report', function () {
    it('should return every unknown kwego algarism received', function (done) {
      const result = translator.translateKwego('kil,jong,un,POL,pow,PoL')
      expect(result.status).to.equal('error')
      expect(result.message).to.equal('unable to decode "jong, un, pow"')
      done()
    })

    it('should warn if roman inconsistences are detected', function (done) {
      let result = translator.translateKwego('kil,kil,kil,kil,pol,jinjin,jinjin')
      expect(result.status).to.equal('warning')
      expect(result.roman).to.equal('IIIIXDD')

      result = translator.translateKwego('kil,pol,pol')
      expect(result.status).to.equal('warning')
      expect(result.roman).to.equal('IXX')

      result = translator.translateKwego('kil kil jin pol kil jin')
      expect(result.status).to.equal('warning')
      expect(result.roman).to.equal('IIVXIV')
      done()
    })
  })

  describe('translation capabilities', function () {
    it('should translate kwego to roman and decimal correctly', function (done) {
      let result = translator.translateKwego('kil')
      expect(result.status).to.equal('success')
      expect(result.kwego).to.equal('kil')
      expect(result.roman).to.equal('I')
      expect(result.decimal).to.equal(1)

      result = translator.translateKwego('pol,kil,jin')
      expect(result.status).to.equal('success')
      expect(result.kwego).to.equal('pol kil jin')
      expect(result.roman).to.equal('XIV')
      expect(result.decimal).to.equal(14)

      result = translator.translateKwego('kilow,pol,jin,kil,kil')
      expect(result.status).to.equal('success')
      expect(result.kwego).to.equal('kilow pol jin kil kil')
      expect(result.roman).to.equal('LXVII')
      expect(result.decimal).to.equal(67)
      done()
    })
  })
})
