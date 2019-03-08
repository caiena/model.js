import _      from '@caiena/lodash-ext'
import Enum   from '@caiena/enum'
import moment from 'moment'
import Model  from '../../../src/model'
import i18n   from '../../../src/i18n'

// support models
import Admin         from '../../support/app/models/admin'
import translations from '../../support/app/config/i18n/translations'


describe('Admin', () => {

  describe('instantiating', () => {
    // TODO
  })


  describe('relations', () => {
    it('has many auditing_purchases', () => {
      expect(Admin.relations.auditing_purchases).to.have.property('type', 'hasMany')

      let yesterday = moment.utc().subtract(1, 'day').format('YYYY-MM-DD')
      let admin = new Admin({ auditing_purchases: [{ id: 11, createdAt: yesterday }] })

      expect(admin.auditing_purchases[0]).to.be.instanceof($models.Purchase)
      expect(admin.$get('auditing_purchases[0].id')).to.equal(11)
      expect(admin.$get('auditing_purchases[0].createdAt')).to.equal(yesterday)
    })
  })

  describe('attributes', () => {
    // TODO
  })

  describe('validation', () => {
    // TODO
  })

  describe('translations', () => {
    i18n.init({ locales: ['pt-BR', 'en-US'], defaultLocale: 'pt-BR', translations })

    context('static i18nScope', () => {
      it('reflects class name: "admin"', () => {
        expect(Admin.i18nScope).to.equal('models.admin')
      })
    })

    context('static $tModelName()', () => {
      it('translates model name', () => {
        expect(Admin.$tModelName()).to.equal('Administrador')
        expect(Admin.$tModelName({ count: 0 })).to.equal('Administrador')
      })

      it('translates pluralized model name', () => {
        expect(Admin.$tModelName({ count: _.sample([2, 3, 5]) })).to.equal('Administradores')
      })
    })

    context('translations attributes', () => {
      it('translates "id"', () => {
        expect(Admin.$tAttr('id')).to.equal('ID')
      })

      it('translates "status"', () => {
        expect(Admin.$tAttr('status')).to.equal('Situação')
      })
    })

    context('translations enums', () => {
      it('translates with enum name only', () => {
        expect(Admin.$tEnum('status')).to.equal('Situação')
      })

      it('translates with enum name and value', () => {
        expect(Admin.$tEnum('status', 'failure')).to.equal('Falha')
      })
    })
  })

})
