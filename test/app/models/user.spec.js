import _        from '@caiena/lodash-ext'
import { i18n } from '@caiena/i18n'
import Enum     from '@caiena/enum'
import moment   from 'moment'
import Model    from '../../../src/model'


// support models
import User         from '../../support/app/models/user'
import Purchase     from '../../support/app/models/purchase'


describe('User', () => {

  describe('instantiating', () => {
    // TODO
  })

  describe('relations', () => {
    it('has many purchases', () => {
      expect(User.relations.purchases).to.have.property('type', 'hasMany')

      let user = new User({ purchases: [{}] })
      expect(user.purchases[0]).to.be.instanceof(Purchase)
    })

    it('belongs to createdBy (Admin)', () => {
      expect(User.relations.createdBy).to.have.property('type', 'belongsTo')

      let user = new User({ createdBy: { id: 11 }, purchases: [] })
      expect(user.createdBy).to.be.instanceof($models.Admin)
      expect(user.$get('createdBy.id')).to.equal(11)
    })
  })

  describe('attributes', () => {
    // TODO
  })

  describe('enums', () => {
    it('defines "status"', () => {
      expect(User.enums.status).to.deep.equal({ failure: -1, scheduled: 0, success: 1 })
    })
  })


  describe('validation', () => {
    // TODO
  })


  describe('translations', () => {
    context('static i18nScope', () => {
      it('reflects class name: "user"', () => {
        expect(User.i18nScope).to.equal('models.user')
      })
    })

    context('static $tModelName()', () => {
      it('translates model name', () => {
        expect(User.$tModelName()).to.equal('Usuário')
        expect(User.$tModelName({ count: 0 })).to.equal('Usuário')
      })

      it('translates pluralized model name', () => {
        expect(User.$tModelName({ count: _.sample([2, 3, 5]) })).to.equal('Usuários')
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
