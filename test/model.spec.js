import _     from '@caiena/lodash-ext'
import Enum  from '@caiena/enum'
import model from '../src/model'
import Base  from '../src/model/base'


describe('model', () => {

  // class Dummy extends model(Base) {
  // TODO: understand the best approach!
  const Dummy = model(class Dummy extends Base {
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
  })
  // }


  describe('instantiating', () => {
    it('allows defining the attributes, defining get/set properties on instances', () => {
      let dummy = new Dummy({ name: 'John Doe' })
      expect(dummy.name).to.equal('John Doe')

      dummy.name = 'Jane Doe'
      expect(dummy.name).to.equal('Jane Doe')
    })

    it('ignores unknown attributes', () => {
      let dummy = new Dummy({ ignored: true })

      expect(dummy).not.to.have.property('ignored')
      expect(dummy.$has('ignored')).to.be.false
      expect(dummy.toJSON()).not.to.have.property('ignored')
    })

    it('handles enums, transforming values in keys', () => {
      let dummy = new Dummy({ name: 'Forkbomb', status: -1 })

      expect(dummy.status).to.equal('failure')
    })
  })

  describe('validation', () => {
    it.only('provides an async $validate() method to perform validation', async () => {
      let dummy = new Dummy({ name: '' })

      expect(await dummy.$validate()).to.be.false
      expect(dummy.$errors).to.have.property('name')

      dummy.name = 'John Malkovich'
      expect(dummy.$props['name']).to.equal('John Malkovich')
      expect(await dummy.$validate()).to.be.true
      expect(dummy.$errors).to.be.empty
    })
  })

})
