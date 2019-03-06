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
