import _        from '@caiena/lodash-ext'
import { i18n } from '@caiena/i18n'
import Enum     from '@caiena/enum'
import moment   from 'moment'
import Model    from '../../../src/model'

// support models
import Admin          from '../../support/app/models/admin'
import AdminDecorator from '../../support/app/decorators/admin_decorator'


describe('AdminDecorator', () => {

  describe('instantiating', () => {
    context('with raw value (plain json object)', () => {
      it('defines source object as $object property', () => {
        let admin = new AdminDecorator({ createdBy: { name: 'Creator' } })

        expect(admin.$object).to.be.an.instanceof(Admin)
        expect(admin).to.be.an.instanceof(Admin)
      })
    })

    context('with a model instance', () => {
      it('defines source object as $object property', () => {
        let object = new Admin({ createdBy: { name: 'Creator' } })
        let admin = new AdminDecorator(object)

        expect(admin.$object).to.equal(object)
        expect(admin).to.be.an.instanceof(Admin)
      })
    })
  })


  describe('methods', () => {
    describe('get createdBy()', () => {
      let admin = null

      context('when the relation :createdBy is set', () => {
        beforeEach(() => { admin = new AdminDecorator({ createdBy: { name: 'Creator' } }) })

        it('returns the creator name', () => {
          // XXX: here we're also testing that the attribute setter override is working - it adds
          // the "[admin] " prefix
          expect(admin.createdBy).to.equal('[admin] Creator')
        })
      })

      context('when :createdBy is not set', () => {
        beforeEach(() => { admin = new AdminDecorator({ createdBy: null }) })

        it('returns null', () => {
          expect(admin.createdBy).not.to.exist
        })
      })
    })
  })

})
