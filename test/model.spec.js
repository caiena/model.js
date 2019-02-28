import _     from '@caiena/lodash-ext'
import Enum  from '@caiena/enum'
import Model from '../src/model'


describe('model', () => {

  class User extends Model {
    static get attrs() {
      return ['id', 'name', 'disabledAt']
    }

    static get virtuals() {
      return ['disabled']
    }

    static get enums() {
      return {
        status: { failure: -1, scheduled: 0, success: 1 }
      }
    }

    static get constraints() {
      return {
        name: { presence: true }
      }
    }

    get disabled() {
      return _.present(this.disabledAt)
    }
  }


  class Admin extends User {
    static get attrs() {
      return _.chain(super.attrs)
        .concat(['area'])
        .uniq()
        .value()
    }

    static get constraints() {
      return _.merge({}, super.constraints, {
        area: { presence: true }
      })
    }

    constructor(...args) {
      super(...args)

      // default value
      if (this.$blank('status')) {
        this.status = 'success'
      }
    }
  }


  describe('instantiating', () => {
    it('allows defining the attributes, defining get/set properties on instances', () => {
      let user = new User({ name: 'John Doe' })
      expect(user.name).to.equal('John Doe')

      user.name = 'Jane Doe'
      expect(user.name).to.equal('Jane Doe')
    })

    it('ignores unknown attributes', () => {
      let user = new User({ ignored: true })

      expect(user).not.to.have.property('ignored')
      expect(user.$has('ignored')).to.be.false
      expect(user.toJSON()).not.to.have.property('ignored')
    })

    it('handles enums, transforming values in keys', () => {
      let user = new User({ name: 'Forkbomb', status: -1 })

      expect(user.status).to.equal('failure')
    })
  })

  describe('validation', () => {
    it('provides an async $validate() method to perform validation', async () => {
      let user = new User({ name: '' })

      expect(await user.$validate()).to.be.false
      expect(user.$errors).to.have.property('name')

      user.name = 'John Malkovich'
      expect(user.name).to.equal('John Malkovich')
      expect(await user.$validate()).to.be.true
      expect(user.$errors).to.be.empty
    })
  })

  describe('extending', () => {
    it('allows model classes to extend others', async () => {
      let admin = new Admin({ name: 'Chuck Norris'})

      // default value
      expect(admin.status).to.equal('success')

      expect(await admin.$validate()).to.be.false
      expect(admin.$errors).to.have.property('area')

      admin.area = 'Universe'
      expect(admin.area).to.equal('Universe')
      expect(await admin.$validate()).to.be.true
      expect(admin.$errors).to.be.empty

      expect(admin.disabled).to.be.false
      admin.disabledAt = '3500-01-01'
      expect(admin.disabled).to.be.true

      expect(admin.toJSON({ virtuals: true, undefs: true })).to.deep.equal({
        id: undefined,
        name: 'Chuck Norris',
        disabledAt: '3500-01-01',
        disabled: true,
        status: 'success',
        area: 'Universe'
      })
    })
  })

})
