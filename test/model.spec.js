import _        from '@caiena/lodash-ext'
import { i18n } from '@caiena/i18n'
import Enum     from '@caiena/enum'
import Model    from '../src/model'

// support models
import User  from './support/app/models/user'
import Admin from './support/app/models/admin'
import Purchase from './support/app/models/purchase'
import Photo from './support/app/models/photo'


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
    it('validates relations', async () => {
      let purchase1 = new Purchase({ status: 'approved' })
      let purchase2 = new Purchase({ id: 12 })
      let photo = new Photo({ filename: 'avatar.jpg', size: -2 })
      let user = new User({ name: '', photo, purchases: [ purchase1, purchase2 ] })

      expect(await user.$validate({ relations: true })).to.be.false

      expect(user.$errors).to.have.property('name')
      expect(user.purchases[1].$errors).to.have.property('status')
      expect(user.photo.$errors).to.have.property('size')
    })

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
    let user

    beforeEach(() => {
      user = new User({ name: 'First man' })
    })

    it('ignores "methods" (functions)', () => {
      expect(user.toJSON({ virtuals: true, undefs: true })).not.to.have.key("wasDisabledBefore")
    })

    it('serializes props from include option', () => {
      let photo = new Photo({ filename: 'avatar.jpg' })
      user.photo = photo

      expect(user.toJSON({ include: ['photo'] })).to.deep.equal({
        name: 'First man', photo: { filename: 'avatar.jpg' }
      })
    })

    it('serializes realtions', () => {
      let purchase1 = new Purchase({ status: 'approved' })
      let purchase2 = new Purchase({ id: 12, status: 'delivered' })
      let photo = new Photo({ filename: 'avatar.jpg' })

      user.purchases = [purchase1, purchase2]
      user.photo = photo

      expect(user.toJSON({ relations: true })).to.deep.equal({
        name: 'First man',
        photo: { filename: 'avatar.jpg' },
        purchases: [
          { status: 'approved' },
          { status: 'delivered', id: 12 }
        ]
      })
    })

    it('serializes nested elements', () => {
      let photo = new Photo({ filename: 'avatar.jpg' })
      user.photo = photo

      let serializedData = user.toJSON({ include: ['oldPhotos'] })

      expect(serializedData).to.deep.equal({
        name: 'First man',
        oldPhotos: {
          photos: [{
            filename: 'avatar.jpg'
          }],
        }
      })

    })

    it('serializes Date props', () => {
      let disabledAt = new Date()
      user.disabledAt = disabledAt

      expect(user.toJSON()).to.deep.equal({
        name: 'First man',
        disabledAt: disabledAt.toJSON(),
      })
    })
  })

})
