import _      from '@caiena/lodash-ext'
import Enum   from '@caiena/enum'
import moment from 'moment'
import Model  from '../../../src/model'

// support models
import Purchase  from '../../support/app/models/purchase'


describe('Purchase', () => {

  describe('instantiating', () => {
    // it('allows defining the attributes, defining get/set properties on instances', () => {
    //   let user = new User({ name: 'John Doe' })
    //   expect(user.name).to.equal('John Doe')

    //   user.name = 'Jane Doe'
    //   expect(user.name).to.equal('Jane Doe')
    // })

    // it('ignores unknown attributes', () => {
    //   let user = new User({ ignored: true })

    //   expect(user).not.to.have.property('ignored')
    //   expect(user.$has('ignored')).to.be.false
    //   expect(user.toJSON()).not.to.have.property('ignored')
    // })

    // it('handles enums, transforming values in keys', () => {
    //   let user = new User({ name: 'Forkbomb', status: -1 })

    //   expect(user.status).to.equal('failure')
    // })
  })


  describe('attributes', () => {
    // it('allows setting multiple attributes at once', () => {
    //   let user = new User({ name: 'First man' })
    //   user.$attrs = {
    //     id: 1,
    //     status: 'success'
    //   }

    //   expect(user.toJSON()).to.deep.equal({
    //     id: 1,
    //     name: 'First man',
    //     status: 'success'
    //   })

    // })
  })

  describe('validation', () => {
    context('approvedAt', () => {
      it('cannot be after createdAt', async () => {
        let purchase = new Purchase({
          createdAt:  moment.utc().format(),
          approvedAt: moment.utc().subtract(1, 'hour').format()
        })

        expect(await purchase.$validate()).to.be.false
        expect(purchase.$errors).to.have.property('approvedAt')

        purchase.approvedAt = _.sample([
          purchase.createdAt,
          moment.utc(purchase.createdAt).add(1, 'hour')
        ])
        expect(await purchase.$validate()).to.be.true
        expect(purchase.$errors).to.be.empty
      })
    })
  })

})
