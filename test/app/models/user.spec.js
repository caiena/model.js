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
    const $relations = User.$relations

    it('belongs to createdBy (Admin)', () => {
      expect($relations.createdBy).to.have.property('type', 'belongsTo')

      let user = new User({ createdBy: { id: 11 }, purchases: [] })
      expect(user.createdBy).to.be.instanceof($models.Admin)
      expect(user.$get('createdBy.id')).to.equal(11)
    })

    it('has one photo', () => {
      expect($relations.photo).to.deep.equal({
        type: 'hasOne', model: 'Photo'
      })

      let user = new User({ photo: { filename: 'path/to/avatar.png', size: 128000 } })
      expect(user.photo).to.be.instanceof($models.Photo)
      expect(user.$get('photo.filename')).to.equal('path/to/avatar.png')
    })

    it('has many purchases', () => {
      expect($relations.purchases).to.have.property('type', 'hasMany')

      let user = new User({ purchases: [{}] })
      expect(user.purchases[0]).to.be.instanceof(Purchase)
    })
  })


  describe('enums', () => {
    const $enums = User.$enums

    it('defines "status"', () => {
      expect($enums.status.all).to.deep.equal({ failure: -1, scheduled: 0, success: 1 })
    })
  })


  describe('attributes', () => {
    // TODO
    const $attrs = User.$attrs

    context('fks', () => {
      it('declares :photoId', () => { expect($attrs).to.include('photoId') })
    })

    context('enums', () => {
      it('declares :status', () => { expect($attrs).to.include('status') })
    })

    it('declares :id',           () => { expect($attrs).to.include('id') })
    it('declares :name',         () => { expect($attrs).to.include('name') })
    it('declares :passwordHash', () => { expect($attrs).to.include('passwordHash') })
    it('declares :disabledAt',   () => { expect($attrs).to.include('disabledAt') })
    it('declares :cpf',          () => { expect($attrs).to.include('cpf') })
  })


  describe('virtuals', () => {
    const $virtuals = User.$virtuals

    it('declares :disabled', () => { expect($virtuals).to.include('disabled') })
    it('declares :password', () => { expect($virtuals).to.include('password') })
  })


  describe('validation', () => {
    const $constraints = User.$constraints

    context('name', () => {
      it('validates its presence', async () => {
        expect($constraints.name).to.have.property('presence', true)

        let user = new User({ name: null })
        expect(await user.$validate()).to.be.false
        expect(user.$errors).to.have.property('name')
        expect(user.$errors.name[0]).to.have.property('code', 'presence')
        expect(user.$errors.name).to.containSubset([{
          message: "não pode ficar em branco"
        }])

        user.name = 'John Wick'
        expect(await user.$validate()).to.be.true
        expect(user.$errors).to.be.empty
      })

      it('validates its type as "string"', async () => {
        expect($constraints.name).to.have.property('type', 'string')

        let user = new User({ name: true })
        expect(await user.$validate()).to.be.false
        expect(user.$errors).to.have.property('name')
        expect(user.$errors.name[0]).to.have.property('code', 'type')
        expect(user.$errors.name).to.containSubset([{
          message: "não é do tipo correto"
        }])

        user.name = 'John Wick'
        expect(await user.$validate()).to.be.true
        expect(user.$errors).to.be.empty
      })
    })

    context('cpf', () => {
      it('validates its format as valid cpf', async () => {
        expect($constraints.cpf).to.have.property('cpf', true)

        let user = new User({ name: 'João Silva', cpf: _.sample(['000.000.000-00', '000']) })
        expect(await user.$validate()).to.be.false
        expect(user.$errors).to.have.property('cpf')
        expect(user.$errors.cpf[0]).to.have.property('code', 'cpf')
        expect(user.$errors.cpf).to.containSubset([{
          message: 'não é um CPF válido'
        }])

        user.cpf = '975.225.910-31'
        expect(await user.$validate()).to.be.true
        expect(user.$errors).to.be.empty
      })

      it('validates its type as "string"', async () => {
        expect($constraints.cpf).to.have.property('type', 'string')

        let user = new User({ name: 'João Silva', cpf: _.sample([2, true, null]) })
        expect(await user.$validate()).to.be.false
        expect(user.$errors).to.have.property('cpf')
        expect(user.$errors.cpf[1]).to.have.property('code', 'type')
        expect(user.$errors.cpf).to.containSubset([{
          message: 'não é do tipo correto'
        }])

        user.cpf = '975.225.910-31'
        expect(await user.$validate()).to.be.true
        expect(user.$errors).to.be.empty
      })
    })
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
