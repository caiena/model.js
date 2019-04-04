import _        from '@caiena/lodash-ext'
import { i18n } from '@caiena/i18n'
import Enum     from '@caiena/enum'
import moment   from 'moment'
import Model    from '../../../src/model'

// support models
import User          from '../../support/app/models/user'
import UserDecorator from '../../support/app/decorators/user_decorator'


describe('UserDecorator', () => {

  describe('instantiating', () => {
    context('with raw value (plain json object)', () => {
      it('defines source object as $object property', () => {
        let user = new UserDecorator({ createdBy: { name: 'Creator' } })

        expect(user.$object).to.be.an.instanceof(User)
        expect(user).to.be.an.instanceof(User)
      })
    })

    context('with a model instance', () => {
      it('defines source object as $object property', () => {
        let object = new User({ createdBy: { name: 'Creator' } })
        let user = new UserDecorator(object)

        expect(user.$object).to.equal(object)
        expect(user).to.be.an.instanceof(User)
      })
    })
  })


  describe('methods', () => {

    describe('get photoUrl()', () => {
      let user = null

      context('when attribute :photoId is set', () => {
        beforeEach(() => { user = new UserDecorator({ photoId: 11 }) })

        it('builds the photo url with :photoId', () => {
          expect(user.photoUrl).to.equal('/photos/11')
        })
      })

      context('when :photoId is not set', () => {
        beforeEach(() => { user = new UserDecorator({ photoId: null }) })

        it('returns null', () => {
          expect(user.photoUrl).to.be.null
        })
      })
    })

  })

})
