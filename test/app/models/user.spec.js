import _      from '@caiena/lodash-ext'
import Enum   from '@caiena/enum'
import moment from 'moment'
import Model  from '../../../src/model'
import i18n   from '../../../src/i18n'

// support models
import User         from '../../support/app/models/user'
import translations from '../../support/app/config/i18n/translations'


describe('User', () => {

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
      it('reflects class name: "user"', () => {
        expect(User.i18nScope).to.equal('models.user')
      })
    })

    context('translations attributes', () => {
      it('translates "id"', () => {
        expect(User.$tAttr('id')).to.equal('ID')
      })

      it('translates "status"', () => {
        expect(User.$tAttr('status')).to.equal('Situação')
      })
    })

    context('translations enums', () => {
      it('translates with enum name only', () => {
        expect(User.$tEnum('status')).to.equal('Situação')
      })

      it('translates with enum name and value', () => {
        expect(User.$tEnum('status', 'failure')).to.equal('Falha')
      })
    })
  })

})
