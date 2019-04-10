import _        from '@caiena/lodash-ext'
import { i18n } from '@caiena/i18n'
import Enum     from '@caiena/enum'
import moment   from 'moment'
import Model    from '../../../src/model'

// support models
import Purchase          from '../../support/app/models/purchase'
import PurchaseDecorator from '../../support/app/decorators/purchase_decorator'


describe('PurchaseDecorator', () => {

  describe('instantiating', () => {
    context('with raw value (plain json object)', () => {
      it('defines source object as $object property', () => {
        let purchase = new PurchaseDecorator({ createdAt: moment().format('YYYY-MM-DD') })

        expect(purchase.$object).to.be.an.instanceof(Purchase)
        expect(purchase).to.be.an.instanceof(Purchase)
      })
    })

    context('with a model instance', () => {
      it('defines source object as $object property', () => {
        let object = new Purchase({ createdAt: moment().format('YYYY-MM-DD') })
        let purchase = new PurchaseDecorator(object)

        expect(purchase.$object).to.equal(object)
        expect(purchase).to.be.an.instanceof(Purchase)
      })
    })
  })


  describe('methods', () => {

    describe('get createdAt()', () => {
      let purchase = null

      context('when attribute :createdAt is set', () => {
        beforeEach(() => { purchase = new PurchaseDecorator({ createdAt: '1987-06-25' }) })

        it('localized to date in long format', () => {
          expect(purchase.createdAt).to.equal('25 de Junho de 1987')
        })
      })

      context('when :createdAt is not set', () => {
        beforeEach(() => { purchase = new PurchaseDecorator({ createdAt: null }) })

        it('returns null', () => {
          expect(purchase.createdAt).to.be.null
        })
      })
    })

  })

})
