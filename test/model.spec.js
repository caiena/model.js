import _        from '@caiena/lodash-ext'
import { i18n } from '@caiena/i18n'
import Enum     from '@caiena/enum'
import Model    from '../src/model'

// support models
import User  from './support/app/models/user'
import Admin from './support/app/models/admin'


describe('model', () => {

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
      expect(User.$enums.status.key(user.status)).to.equal('failure')
      expect(user.$enumValue('status')).to.equal(-1)
    })

    it('handles enums, ignoring invalid keys', () => {
      let user = new User({ name: 'Forkbomb', status: -1 })
      user.status = 'invalid_key'

      expect(user.status).to.be.undefined
    })

    it('handles enums, accepting null value', () => {
      let user = new User({ name: 'Forkbomb', status: -1 })
      user.status = null

      expect(user.status).to.be.null
    })
  })


  describe('attributes', () => {
    it('allows setting multiple attributes at once', () => {
      let user = new User({ name: 'First man' })
      user.$attrs = {
        id: 1,
        status: 'success'
      }

      expect(user.toJSON()).to.deep.equal({
        id: 1,
        name: 'First man',
        status: 'success'
      })

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
      let admin = new Admin({ name: 'Chuck Norris' })

      // default value with $afterInit() method
      expect(admin.status).to.equal('success')

      expect(await admin.$validate()).to.be.false
      expect(admin.$errors).to.have.property('area')
      expect(admin.$errors.area).to.containSubset([{
        message: "não pode ficar em branco"
      }])

      admin.area = 'Universe'
      expect(admin.area).to.equal('Universe')
      expect(await admin.$validate()).to.be.true
      expect(admin.$errors).to.be.empty

      expect(admin.disabled).to.be.false
      admin.disabledAt = '3500-01-01'
      expect(admin.disabled).to.be.true

      expect(admin.toJSON({ virtuals: true, undefs: true })).to.deep.equal({
        photoId:      undefined,
        id:           undefined,
        name:         '[admin] Chuck Norris',
        disabledAt:   '3500-01-01',
        disabled:     true,
        passwordHash: undefined,
        status:       'success',
        area:         'Universe'
      })
    })

    it('allows overriding attr setter', () => {
      let admin = new Admin({ name: 'Mesmerize' })

      expect(admin.name).to.equal('[admin] Mesmerize')
    })

    it('allows overriding virtual attributes', async () => {
      let admin = new Admin({ name: 'John Paul Getty' })
      expect(admin.disabled).to.be.false

      admin.status = 'failure'
      expect(admin.disabled).to.be.true

      expect(admin.toJSON({ virtuals: true })).to.containSubset({ disabled: true })
    })
  })


  describe('serialization', () => {
    it('ignores "methods" (functions)', () => {
      let user = new User()

      expect(user.toJSON({ virtuals: true, undefs: true })).not.to.have.key("wasDisabledBefore")
    })
  })

})
